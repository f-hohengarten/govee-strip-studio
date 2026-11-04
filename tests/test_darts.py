"""Tests for the darts-caller integration (rules and Socket.IO feed), without Home Assistant.

The feed test runs against a real python-socketio server (the library Flask-SocketIO in
darts-caller is built on).  It is skipped when python-socketio/aiohttp are not installed:

    uvx --python 3.14 --with aiohttp --with python-socketio pytest tests/
"""

from __future__ import annotations

import asyncio
import importlib.util
from pathlib import Path
import socket
import sys

import pytest

COMPONENT = Path(__file__).resolve().parent.parent / "custom_components" / "govee_strip_studio"


def _load(name: str):
    spec = importlib.util.spec_from_file_location(name, COMPONENT / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


rules = _load("darts_rules")


def dart(value, field=None, mult=None, event="dart1-thrown", player="0"):
    game = {"mode": "X01", "dartValue": str(value)}
    if field is not None:
        game["fieldName"] = field
    if mult is not None:
        game["fieldMultiplier"] = mult
    return {"event": event, "playerIndex": player, "game": game}


@pytest.mark.parametrize(
    ("msg", "candidates"),
    [
        (dart(60, "t20", 3), ("dart_t20", "dart_triple")),
        (dart(57, "t19", 3), ("dart_triple",)),
        (dart(40, "d20", 2), ("dart_double",)),
        (dart(50, "d25", 2), ("dart_bullseye", "dart_bull")),
        (dart(25, "s25", 1), ("dart_bull",)),
        (dart(0, "m5", 0), ("dart_miss",)),
        (dart(20, "s20", 1), ()),
        (dart(60), ("dart_t20", "dart_triple")),  # no field info: one dart scores 60 only as T20
        (dart(50), ("dart_bullseye", "dart_bull")),
        (dart(0), ("dart_miss",)),
        (dart(40), ()),  # D20 or ... unknown without field info: no guess
    ],
)
def test_single_dart_candidates(msg, candidates):
    reaction = rules.react(msg)
    assert reaction.kind == "trigger" and reaction.candidates == candidates and reaction.player == "0"


@pytest.mark.parametrize(
    ("score", "first"),
    [(180, "visit_180"), (171, "visit_140"), (100, "visit_100"), (85, "visit_60"), (59, None), (0, "visit_0")],
)
def test_visit_scores(score, first):
    reaction = rules.react({"event": "darts-thrown", "playerIndex": "1", "game": {"dartValue": str(score)}})
    assert (reaction.candidates[0] if reaction.candidates else None) == first


def test_visit_falls_back_to_lower_bands_when_not_configured():
    rule = {"effect_id": "abc", "duration": 4}
    picked = rules.pick({"visit_100": rule}, rules.react({"event": "darts-thrown", "game": {"dartValue": "180"}}).candidates)
    assert picked == ("visit_100", rule)


def test_wins_and_high_finish():
    won = rules.react({"event": "game-won", "playerIndex": "0", "game": {"dartsThrownValue": "120"}})
    assert won.candidates == ("high_finish", "game_won")
    match = rules.react({"event": "match-won", "game": {"dartsThrownValue": "40"}})
    assert match.candidates == ("match_won", "game_won")


def test_board_status_and_turn_changes():
    assert rules.react({"event": "Board Status", "data": {"status": "Takeout Started"}}).candidates == ("takeout",)
    assert rules.react({"event": "Board Status", "data": {"status": "Takeout Finished"}}).kind == "idle"
    pulled = rules.react({"event": "darts-pulled", "playerIndex": "2", "player": "Fred"})
    assert pulled.kind == "idle" and pulled.player == "2"
    assert rules.idle_candidates("2") == ("player_2", "idle")
    assert rules.idle_candidates(None) == ("idle",)
    assert rules.react({"event": "lobby", "action": "player-joined"}).kind == "none"
    assert rules.react("garbage").kind == "none"


def test_durations():
    assert rules.duration_of("takeout", {"effect_id": "x", "duration": 5}) is None
    assert rules.duration_of("visit_180", {"effect_id": "x", "duration": 7}) == 7
    assert rules.duration_of("visit_180", {"effect_id": "x"}) == rules.DEFAULT_DURATION
    assert rules.duration_of("visit_180", {"effect_id": "x", "duration": 999}) == 60


def test_trigger_ids_are_unique():
    assert len(rules.TRIGGERS) == len(set(rules.TRIGGERS))


# -- feed against a real Socket.IO server ---------------------------------------------

socketio = pytest.importorskip("socketio")
aiohttp = pytest.importorskip("aiohttp")
from aiohttp import web  # noqa: E402

feed_module = _load("darts_feed")


def _free_port() -> int:
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


TOKEN = "eyJhbGciOiJIUzI1NiJ9.e30.c2lnbmF0dXJl"


async def _serve(port: int, ping_interval: float, *, require_token: bool = False, serve_page: bool = True):
    """A Socket.IO server; with ``require_token`` it behaves like darts-caller 3."""
    sio = socketio.AsyncServer(async_mode="aiohttp", ping_interval=ping_interval, ping_timeout=2)

    @sio.event
    async def connect(sid, environ, auth):
        if require_token and auth != {"token": TOKEN}:
            raise socketio.exceptions.ConnectionRefusedError("missing auth token")

    app = web.Application()
    if require_token and serve_page:
        page = f'<script>const webAuthToken = "{TOKEN}";</script>'

        async def index(_request):
            return web.Response(text=page, content_type="text/html")

        app.router.add_get("/", index)
    sio.attach(app)
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, "127.0.0.1", port)
    await site.start()
    return sio, runner


async def _wait(predicate, timeout=8.0):
    deadline = asyncio.get_running_loop().time() + timeout
    while not predicate():
        if asyncio.get_running_loop().time() > deadline:
            raise AssertionError("timed out")
        await asyncio.sleep(0.05)


def test_feed_receives_events_keeps_alive_and_reconnects():
    async def scenario():
        port = _free_port()
        sio, runner = await _serve(port, ping_interval=1)
        received = []
        async with aiohttp.ClientSession() as session:
            feed = feed_module.DartsFeed(session, "127.0.0.1", port, received.append)
            feed.start(asyncio.ensure_future)
            await _wait(lambda: feed.connected)  # wss fails on a plain server, ws joins
            assert feed.scheme == "ws"
            await asyncio.sleep(3.5)  # several ping intervals: pongs must keep the session alive
            assert feed.connected
            await sio.emit("message", {"event": "darts-thrown", "playerIndex": "0", "game": {"dartValue": "180"}})
            await _wait(lambda: received)
            assert received[0]["game"]["dartValue"] == "180" and feed.last_event == "darts-thrown"
            # server drops every client -> the feed reconnects on its own
            for sid in list(sio.manager.get_participants("/", None)):
                await sio.disconnect(sid[0] if isinstance(sid, tuple) else sid)
            await _wait(lambda: not feed.connected)
            await _wait(lambda: feed.connected)
            await sio.emit("message", {"event": "busted", "playerIndex": "1"})
            await _wait(lambda: len(received) == 2)
            await feed.stop()
        await runner.cleanup()

    asyncio.run(scenario())


def test_feed_fetches_the_join_token_like_the_caller_web_ui():
    async def scenario():
        port = _free_port()
        sio, runner = await _serve(port, ping_interval=5, require_token=True)
        received = []
        async with aiohttp.ClientSession() as session:
            feed = feed_module.DartsFeed(session, "127.0.0.1", port, received.append)
            feed.start(asyncio.ensure_future)
            await _wait(lambda: feed.connected)
            await sio.emit("message", {"event": "busted", "playerIndex": "0"})
            await _wait(lambda: received)
            await feed.stop()
        await runner.cleanup()

    asyncio.run(scenario())


def test_feed_without_token_is_refused_and_reported():
    async def scenario():
        port = _free_port()
        sio, runner = await _serve(port, ping_interval=5, require_token=True, serve_page=False)
        async with aiohttp.ClientSession() as session:
            feed = feed_module.DartsFeed(session, "127.0.0.1", port, lambda _m: None)
            feed.start(asyncio.ensure_future)
            await _wait(lambda: feed.error is not None)
            assert not feed.connected
            await feed.stop()
        await runner.cleanup()

    asyncio.run(scenario())


def test_feed_reports_unreachable_host():
    async def scenario():
        async with aiohttp.ClientSession() as session:
            feed = feed_module.DartsFeed(session, "127.0.0.1", _free_port(), lambda _m: None)
            feed.start(asyncio.ensure_future)
            await _wait(lambda: feed.error is not None)
            assert not feed.connected
            await feed.stop()

    asyncio.run(scenario())
