"""darts_feed against a real python-socketio server (the library darts-caller's Flask-SocketIO uses).

Skipped when python-socketio/aiohttp are not installed:

    uvx --python 3.14 --with aiohttp --with python-socketio pytest tests/
"""

from __future__ import annotations

import asyncio
import importlib.util
from pathlib import Path
import socket
import sys

import pytest

socketio = pytest.importorskip("socketio")
aiohttp = pytest.importorskip("aiohttp")
from aiohttp import web  # noqa: E402

COMPONENT = Path(__file__).resolve().parent.parent / "custom_components" / "govee_strip_studio"
_spec = importlib.util.spec_from_file_location("darts_feed", COMPONENT / "darts_feed.py")
feed_module = importlib.util.module_from_spec(_spec)
sys.modules["darts_feed"] = feed_module
_spec.loader.exec_module(feed_module)



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


def test_feed_says_hello_and_sends_commands_like_the_caller_web_ui():
    async def scenario():
        port = _free_port()
        sio, runner = await _serve(port, ping_interval=5, require_token=True)
        heard = []

        @sio.on("message")
        async def on_message(sid, data):
            heard.append(data)
            if data == "hello":
                await sio.emit("message", {"event": "welcome", "caller": "en-us-onyx-male", "callersAvailable": ["en-us-onyx-male"], "callersFavoured": []}, to=sid)

        received = []
        async with aiohttp.ClientSession() as session:
            feed = feed_module.DartsFeed(session, "127.0.0.1", port, received.append)
            with pytest.raises(ConnectionError):
                await feed.send("board-stop")  # not connected yet
            feed.start(asyncio.ensure_future)
            await _wait(lambda: received)
            assert received[0]["event"] == "welcome" and heard == ["hello"] and feed.sessions == 1
            await feed.send("caller:en-us-sage-female")
            await _wait(lambda: len(heard) == 2)
            assert heard[1] == "caller:en-us-sage-female"
            await feed.stop()
        await runner.cleanup()

    asyncio.run(scenario())
