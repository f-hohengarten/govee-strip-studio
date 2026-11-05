"""Darts in Home Assistant: Autodarts games via darts-caller.

One connection to darts-caller (``darts_feed.DartsFeed``) serves three things:

* LED reactions: events are classified by ``darts_rules`` and played as saved Strip
  Studio effects on one strip; short effects return to the idle look of the player
  whose turn it is.  Every game event is also fired on the bus as
  ``govee_strip_studio_darts`` for custom automations.
* The caller in the browser: darts-caller's ``mirror`` events (which sound files to
  play) are forwarded to the "Darts" panel, which plays them on an output device of
  the viewer's choice; the files themselves are proxied by ``DartsSoundView``.
* Remote control of darts-caller: voice, announcements and board (``darts_caller``).

The connection runs whenever a darts-caller address is set; ``enabled`` only switches
the LED reactions.

Part of Govee Strip Studio, built on teh-hippo/ha-govee-led-ble (MIT).
"""

from __future__ import annotations

import asyncio
from collections.abc import Callable
import logging
from pathlib import Path
from typing import TYPE_CHECKING, Any
from urllib.parse import quote, unquote

import aiohttp
from aiohttp import web
import voluptuous as vol

from homeassistant.components import frontend, websocket_api
from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import DOMAIN
from .darts_caller import COMMANDS, mirror_files, option_commands, sound_path_ok, validate_options
from .darts_feed import DartsFeed
from .darts_presets import DARTS_GROUP, apply_presets
from .darts_rules import (
    DEFAULT_DURATION,
    STATE_TRIGGERS,
    TRIGGER_GROUPS,
    TRIGGERS,
    Reaction,
    duration_of,
    game_update,
    idle_candidates,
    pick,
    react,
)
from .studio_render import Effect, StudioValidationError

if TYPE_CHECKING:
    from .strip_studio import StripStudio

_LOGGER = logging.getLogger(__name__)

EVENT_TYPE = f"{DOMAIN}_darts"
DEFAULT_PORT = 8079
DEFAULT_CONFIG: dict[str, Any] = {
    "enabled": False,
    "host": "",
    "port": DEFAULT_PORT,
    "entry_id": None,
    "rules": {},
    "caller": {},
}
WS = f"{DOMAIN}/darts"
PANEL_PATH = "darts"
PANEL_ELEMENT = "govee-darts-panel"
SOUND_URL = f"/api/{DOMAIN}/darts/sound"
AUTH_POLL_SECONDS = 60
MAX_SOUND_BYTES = 8 * 1024 * 1024
_DATA = f"{DOMAIN}_darts"
# Caller-internal messages that are not game events (no bus event, no LED reaction).
_CALLER_EVENTS = {"mirror", "welcome", "sync"}


def validate_config(raw: dict[str, Any]) -> dict[str, Any]:
    """Normalise a darts configuration coming from the panel."""
    host = str(raw.get("host") or "").strip()
    if len(host) > 253 or any(c in host for c in "/ :?#@"):
        raise StudioValidationError("enter only the IP address or host name of the darts-caller computer")
    try:
        port = DEFAULT_PORT if raw.get("port") in (None, "") else int(raw["port"])
    except (TypeError, ValueError) as err:
        raise StudioValidationError("port must be a number") from err
    if not 1 <= port <= 65535:
        raise StudioValidationError("port must be between 1 and 65535")
    rules: dict[str, dict[str, Any]] = {}
    for trigger, rule in (raw.get("rules") or {}).items():
        if trigger not in TRIGGERS or not isinstance(rule, dict) or not rule.get("effect_id"):
            continue
        entry: dict[str, Any] = {"effect_id": str(rule["effect_id"])}
        if rule.get("duration") is not None:
            try:
                entry["duration"] = max(0.5, min(60.0, float(rule["duration"])))
            except (TypeError, ValueError) as err:
                raise StudioValidationError("duration must be a number of seconds") from err
        rules[trigger] = entry
    entry_id = raw.get("entry_id") or None
    return {
        "enabled": bool(raw.get("enabled")) and bool(host),
        "host": host,
        "port": port,
        "entry_id": None if entry_id is None else str(entry_id),
        "rules": rules,
        "caller": validate_options(raw.get("caller")),
    }


class DartsController:
    """One darts-caller connection: LED reactions, caller audio and remote control."""

    def __init__(self, studio: StripStudio) -> None:
        self.studio = studio
        self.hass: HomeAssistant = studio.hass
        self.feed: DartsFeed | None = None
        self.player: str | None = None  # playerIndex whose turn it is
        self.active: str | None = None  # trigger currently shown
        self.callers: dict[str, Any] = {}  # from darts-caller's "welcome"
        self.autodarts: dict[str, Any] | None = None  # darts-caller's own Autodarts login
        self.game: dict[str, Any] = {}
        self.listeners: set[Callable[[dict[str, Any]], None]] = set()
        self._revert: asyncio.TimerHandle | None = None
        self._generation = 0  # bumped by every event; a stale revert must not undo a newer effect
        self._lock = asyncio.Lock()
        self._applied_session = 0
        self._auth_task: asyncio.Task | None = None

    @property
    def config(self) -> dict[str, Any]:
        return self.studio.data.setdefault("darts", dict(DEFAULT_CONFIG))

    def status(self) -> dict[str, Any]:
        feed = self.feed.status() if self.feed is not None else None
        return {
            **self.config,
            "feed": feed,
            "player": self.player,
            "active": self.active,
            "callers": self.callers,
            "autodarts": self.autodarts,
            "game": self.game,
        }

    def _broadcast(self, payload: dict[str, Any]) -> None:
        for listener in list(self.listeners):
            listener(payload)

    def _notify(self) -> None:
        self._broadcast({"type": "status", "status": self.status()})

    # -- connection ----------------------------------------------------------------
    async def async_restart(self, *, force: bool = True) -> None:
        """(Re)connect after a configuration change; ``force=False`` keeps a matching link."""
        cfg = self.config
        if not cfg.get("enabled"):
            self._cancel_revert()
            self.active = None
        target = (cfg.get("host"), cfg.get("port"))
        if not force and self.feed is not None and (self.feed.host, self.feed.port) == target:
            self._notify()
            return
        await self.async_stop()
        self.callers, self.autodarts, self.game = {}, None, {}
        if not cfg.get("host"):
            self._notify()
            return
        self.feed = DartsFeed(
            async_get_clientsession(self.hass, verify_ssl=False),
            cfg["host"],
            cfg["port"],
            self._on_event,
            self._on_feed_status,
        )
        self.feed.start(lambda coro: self.hass.async_create_background_task(coro, f"{DOMAIN} darts-caller feed"))
        self._auth_task = self.hass.async_create_background_task(self._auth_loop(), f"{DOMAIN} darts-caller login")
        self._notify()

    async def async_stop(self) -> None:
        self._cancel_revert()
        if self._auth_task is not None:
            self._auth_task.cancel()
            self._auth_task = None
        if self.feed is not None:
            await self.feed.stop()
            self.feed = None

    @callback
    def _on_feed_status(self) -> None:
        if self.feed is not None and self.feed.connected and self._auth_task is not None:
            # Refresh the login state right away instead of waiting for the next poll.
            self.hass.async_create_task(self._refresh_auth())
        self._notify()

    async def _auth_loop(self) -> None:
        while True:
            await self._refresh_auth()
            await asyncio.sleep(AUTH_POLL_SECONDS)

    async def _refresh_auth(self) -> None:
        """darts-caller's own Autodarts login: without it, it never sees a game."""
        feed = self.feed
        if feed is None:
            return
        http = "http" if feed.scheme == "ws" else "https"
        state: dict[str, Any]
        try:
            async with async_get_clientsession(self.hass, verify_ssl=False).get(
                f"{http}://{feed.host}:{feed.port}/api/auth/status", ssl=False, timeout=aiohttp.ClientTimeout(total=10)
            ) as resp:
                data = await resp.json(content_type=None) if resp.status == 200 else None
            if isinstance(data, dict):
                state = {"state": str(data.get("state") or "unknown"), "error": data.get("error")}
            else:
                state = {"state": "unknown", "error": None}  # older callers have no login API
        except (aiohttp.ClientError, TimeoutError, ValueError) as err:
            state = {"state": "unreachable", "error": str(err) or type(err).__name__}
        if state != self.autodarts:
            self.autodarts = state
            self._notify()

    # -- caller control ------------------------------------------------------------
    async def async_send(self, command: str) -> None:
        if command not in COMMANDS:
            raise StudioValidationError("unknown darts-caller command")
        # Favourites change the voice list: ask for a fresh "welcome".
        await self._send([command, "hello"] if command.startswith("fav:") else [command])

    async def _send(self, commands: list[str]) -> None:
        if self.feed is None or not self.feed.connected:
            raise StudioValidationError("darts-caller is not connected")
        for command in commands:
            await self.feed.send(command)

    async def async_set_options(self, changes: dict[str, Any]) -> None:
        """Store caller options (``None`` forgets one) and send the changed ones."""
        merged = {**self.config.get("caller", {}), **changes}
        options = validate_options({k: v for k, v in merged.items() if v is not None})
        self.config["caller"] = options
        await self.studio.async_save()
        changed = {k for k in changes if k in options}
        if changed and self.feed is not None and self.feed.connected:
            commands = option_commands(options, changed)
            if changed & {"voice", "language", "gender"}:
                commands.append("hello")  # refresh the voice list shown in the panel
            await self._send(commands)
        self._notify()

    def _apply_stored_options(self) -> None:
        """Once per connection: a restarted darts-caller forgot what was set here."""
        feed = self.feed
        if feed is None or self._applied_session == feed.sessions:
            return
        self._applied_session = feed.sessions
        commands = option_commands(self.config.get("caller", {}))
        if commands:
            self.hass.async_create_task(self._send_quietly(commands))

    async def _send_quietly(self, commands: list[str]) -> None:
        try:
            await self._send(commands)
        except Exception as err:  # noqa: BLE001 - retried on the next connection
            _LOGGER.debug("Could not apply darts-caller options: %s", err)

    # -- events --------------------------------------------------------------------
    @callback
    def _on_event(self, msg: dict[str, Any]) -> None:
        event = msg.get("event")
        if event == "mirror":
            files = mirror_files(msg)
            if files:
                self._broadcast({"type": "play", "files": files})
            return
        if event == "welcome":
            self.callers = {
                "current": str(msg.get("caller") or ""),
                "available": [str(c) for c in msg.get("callersAvailable") or []],
                "favoured": [str(c) for c in msg.get("callersFavoured") or []],
            }
            self._notify()
            self._apply_stored_options()
            return
        if event in _CALLER_EVENTS:
            return
        self.hass.bus.async_fire(
            EVENT_TYPE,
            {
                "event": event,
                "player": msg.get("player"),
                "player_index": msg.get("playerIndex"),
                "game": msg.get("game") if isinstance(msg.get("game"), dict) else {},
                "data": msg.get("data") if isinstance(msg.get("data"), dict) else {},
            },
        )
        if game_update(self.game, msg):
            self._broadcast({"type": "game", "game": self.game})
        reaction = react(msg)
        if reaction.player is not None:
            self.player = reaction.player
        if event in ("match-ended", "lobby"):
            self.player = None
        if reaction.kind != "none" and self.config.get("enabled") and self.config.get("entry_id"):
            self._generation += 1
            self.hass.async_create_task(self._handle(reaction, self._generation))

    async def async_simulate(self, trigger: str) -> None:
        """Play one rule as if its event had happened (panel test buttons)."""
        if trigger not in TRIGGERS:
            raise StudioValidationError("unknown darts event")
        if not self.config.get("entry_id"):
            raise StudioValidationError("choose a strip for darts first")
        if pick(self.config["rules"], (trigger,)) is None:
            raise StudioValidationError("no effect is assigned to this event")
        self._generation += 1
        await self._handle(Reaction("trigger", (trigger,), None), self._generation)

    async def _handle(self, reaction: Reaction, generation: int) -> None:
        async with self._lock:
            if generation != self._generation:
                return  # a newer event arrived while this one waited
            self._cancel_revert()
            if reaction.kind == "idle":
                await self._show_idle()
                return
            picked = pick(self.config["rules"], reaction.candidates)
            if picked is None:
                return
            trigger, rule = picked
            if await self._play(trigger, rule["effect_id"]):
                duration = duration_of(trigger, rule)
                if duration is not None:
                    self._revert = self.hass.loop.call_later(
                        duration,
                        lambda: self.hass.async_create_task(self._handle(Reaction("idle"), generation)),
                    )

    async def _show_idle(self) -> None:
        picked = pick(self.config["rules"], idle_candidates(self.player))
        if picked is not None:
            await self._play(picked[0], picked[1]["effect_id"])

    async def _play(self, trigger: str, effect_id: str) -> bool:
        entry_id = self.config.get("entry_id")
        saved = self.studio.data["effects"].get(effect_id)
        if not entry_id or saved is None:
            return False
        try:
            # live: running players swap in place and native uploads coalesce, so rapid
            # throws never queue up stale effects.
            await self.studio.async_play(entry_id, Effect.from_dict(saved["effect"]), name=saved["name"], live=True)
        except Exception as err:  # noqa: BLE001 - keep reacting to the next throw
            _LOGGER.warning("Strip Studio could not play %s for darts event %s: %s", saved.get("name"), trigger, err)
            return False
        self.active = trigger
        self._notify()
        return True

    def _cancel_revert(self) -> None:
        if self._revert is not None:
            self._revert.cancel()
            self._revert = None

    # -- configuration -------------------------------------------------------------
    async def async_configure(self, raw: dict[str, Any]) -> None:
        """Connection and LED settings from the panel or the set_darts_mode action."""
        config = validate_config({**raw, "caller": self.config.get("caller", {})})
        if config["entry_id"] is not None:
            self.studio.coordinator(config["entry_id"])  # must be a loaded strip
        self.studio.data["darts"] = config
        await self.studio.async_save()
        await self.async_restart(force=False)

    def panel_info(self) -> dict[str, Any]:
        devices = []
        for entry in self.studio._entries():
            try:
                info = self.studio.device_info(entry.entry_id)
            except StudioValidationError:
                continue
            devices.append({"entry_id": info["entry_id"], "title": info["title"]})
        effects = {
            effect_id: {"name": item.get("name"), "group": item.get("group"), "playback": item.get("effect", {}).get("playback")}
            for effect_id, item in self.studio.data["effects"].items()
        }
        return {
            "status": self.status(),
            "devices": devices,
            "effects": effects,
            "darts_group": DARTS_GROUP,
            "triggers": [[group, [list(item) for item in items]] for group, items in TRIGGER_GROUPS],
            "state_triggers": sorted(STATE_TRIGGERS),
            "default_duration": DEFAULT_DURATION,
        }


# -- sound proxy -----------------------------------------------------------------------


class DartsSoundView(HomeAssistantView):
    """Serves darts-caller's sound files to the Darts panel (same origin, no certificate prompt)."""

    url = SOUND_URL
    name = f"api:{DOMAIN}:darts_sound"
    requires_auth = True

    def __init__(self, controller: DartsController) -> None:
        self.controller = controller

    async def get(self, request: web.Request) -> web.StreamResponse:
        user = request.get("hass_user")
        if user is None or not user.is_admin:
            return web.Response(status=403)
        encoded = request.query.get("path", "")
        feed = self.controller.feed
        if feed is None:
            return web.Response(status=503, text="darts-caller is not configured")
        if not sound_path_ok(encoded):
            return web.Response(status=400, text="not a sound file")
        http = "http" if feed.scheme == "ws" else "https"
        # darts-caller expects the whole file path as one encoded path segment.
        url = f"{http}://{feed.host}:{feed.port}/sounds/{quote(unquote(encoded), safe='')}"
        try:
            async with async_get_clientsession(self.controller.hass, verify_ssl=False).get(
                url, ssl=False, timeout=aiohttp.ClientTimeout(total=15)
            ) as resp:
                if resp.status != 200:
                    return web.Response(status=resp.status)
                # Read the whole file (``content.read(n)`` returns only what has arrived so far).
                body = bytearray()
                async for chunk in resp.content.iter_chunked(64 * 1024):
                    body += chunk
                    if len(body) > MAX_SOUND_BYTES:
                        return web.Response(status=413)
                content_type = resp.content_type or "audio/mpeg"
        except (aiohttp.ClientError, TimeoutError) as err:
            return web.Response(status=502, text=str(err) or "darts-caller unreachable")
        return web.Response(
            body=bytes(body),
            content_type=content_type,
            headers={"Cache-Control": "private, max-age=604800"},
        )


# -- websocket API -----------------------------------------------------------------------


def _controller(hass: HomeAssistant) -> DartsController:
    return hass.data[_DATA]


def _error(connection: websocket_api.ActiveConnection, msg_id: int, err: Exception) -> None:
    connection.send_error(msg_id, "darts_error", str(err) or type(err).__name__)


@websocket_api.websocket_command({vol.Required("type"): f"{WS}/info"})
@websocket_api.require_admin
@callback
def ws_info(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    connection.send_result(msg["id"], _controller(hass).panel_info())


@websocket_api.websocket_command({vol.Required("type"): f"{WS}/subscribe"})
@websocket_api.require_admin
@callback
def ws_subscribe(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    controller = _controller(hass)

    @callback
    def forward(payload: dict[str, Any]) -> None:
        connection.send_event(msg["id"], payload)

    controller.listeners.add(forward)

    @callback
    def unsubscribe() -> None:
        controller.listeners.discard(forward)

    connection.subscriptions[msg["id"]] = unsubscribe
    connection.send_result(msg["id"])


@websocket_api.websocket_command({vol.Required("type"): f"{WS}/set", vol.Required("config"): dict})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_set(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    controller = _controller(hass)
    try:
        await controller.async_configure(msg["config"])
    except Exception as err:  # noqa: BLE001
        _error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], controller.status())


@websocket_api.websocket_command({vol.Required("type"): f"{WS}/caller", vol.Required("options"): dict})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_caller(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    controller = _controller(hass)
    try:
        await controller.async_set_options(msg["options"])
    except Exception as err:  # noqa: BLE001
        _error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], controller.status())


@websocket_api.websocket_command({vol.Required("type"): f"{WS}/command", vol.Required("command"): str})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_command(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    try:
        await _controller(hass).async_send(msg["command"])
    except Exception as err:  # noqa: BLE001
        _error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"])


@websocket_api.websocket_command({vol.Required("type"): f"{WS}/simulate", vol.Required("trigger"): str})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_simulate(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    try:
        await _controller(hass).async_simulate(msg["trigger"])
    except Exception as err:  # noqa: BLE001
        _error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"])


@websocket_api.websocket_command({vol.Required("type"): f"{WS}/presets"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_presets(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Install the ready-made darts effects; never overwrites the user's own choices."""
    controller = _controller(hass)
    studio = controller.studio
    try:
        effects = dict(studio.data["effects"])
        darts = dict(studio.data["darts"])
        rules = dict(darts.get("rules") or {})
        added, assigned = apply_presets(effects, rules)
        for effect_id in added:  # same validation and shape as effects saved from the panel
            effects[effect_id]["effect"] = Effect.from_dict(effects[effect_id]["effect"]).to_dict()
        darts["rules"] = rules
        studio.data["effects"] = effects
        studio.data["darts"] = validate_config(darts)
        await studio.async_save()
    except Exception as err:  # noqa: BLE001
        _error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], {**controller.panel_info(), "added": added, "assigned": assigned})


async def async_setup_darts(hass: HomeAssistant, controller: DartsController, static_url: str, version: str) -> None:
    """Register the Darts panel, its websocket API and the sound proxy; connect."""
    hass.data[_DATA] = controller
    for handler in (ws_info, ws_subscribe, ws_set, ws_caller, ws_command, ws_simulate, ws_presets):
        websocket_api.async_register_command(hass, handler)
    hass.http.register_view(DartsSoundView(controller))
    if (Path(__file__).parent / "studio_frontend" / "darts_panel.js").is_file():
        frontend.async_register_built_in_panel(
            hass,
            component_name="custom",
            sidebar_title="Darts",
            sidebar_icon="mdi:bullseye-arrow",
            frontend_url_path=PANEL_PATH,
            require_admin=True,
            config={
                "_panel_custom": {
                    "name": PANEL_ELEMENT,
                    "module_url": f"{static_url}/darts_panel.js?v={version}",
                    "embed_iframe": False,
                    "trust_external": False,
                }
            },
            update=True,
        )
    # Connects in the background and keeps retrying, so the strip need not be loaded yet.
    await controller.async_restart()
