"""Govee Strip Studio: geometry-aware effects authored in Home Assistant.

Adds a sidebar panel, a small effect library and a frame player on top of the
coordinator from teh-hippo/ha-govee-led-ble (MIT licence, see LICENSE).
Frames are rendered by ``studio_render`` and written as segment-colour packets
without the post-write segment read-back, which the H617C does not answer.
"""

from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
import logging
from pathlib import Path
import time
from typing import Any
import uuid

import voluptuous as vol

from homeassistant.components import frontend, websocket_api
from homeassistant.components.http.server import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.event import async_track_state_change_event
from homeassistant.helpers.storage import Store

from .const import DOMAIN
from .light_commands import build_segment_color
from .studio_render import (
    DIRECTIONS,
    EFFECT_TYPES,
    Effect,
    Geometry,
    StudioValidationError,
    frame_writes,
    quantized_frame,
    render,
)

_LOGGER = logging.getLogger(__name__)

STUDIO_VERSION = "0.1.0"
STORE_KEY = f"{DOMAIN}.strip_studio"
STORE_VERSION = 1
PANEL_PATH = "strip-studio"
PANEL_ELEMENT = "govee-strip-studio-panel"
STATIC_URL = f"/{DOMAIN}_studio"
_STATIC_DIR = Path(__file__).parent / "studio_frontend"
_DATA = f"{DOMAIN}_strip_studio"

MIN_FRAME_INTERVAL = 0.08  # seconds; the strip paces writes on its own replies
QUANTIZE_STEP = 4
WS = f"{DOMAIN}/studio"


@dataclass
class _Player:
    entry_id: str
    effect: Effect
    task: asyncio.Task | None = None
    started: float = field(default_factory=time.monotonic)
    frames: int = 0
    writes: int = 0
    errors: int = 0
    last_error: str | None = None
    write_seconds: float = 0.0
    name: str | None = None

    def status(self) -> dict[str, Any]:
        elapsed = max(time.monotonic() - self.started, 1e-6)
        return {
            "entry_id": self.entry_id,
            "running": self.task is not None and not self.task.done(),
            "name": self.name,
            "effect": self.effect.to_dict(),
            "frames": self.frames,
            "writes": self.writes,
            "errors": self.errors,
            "last_error": self.last_error,
            "fps": round(self.frames / elapsed, 2),
            "avg_write_ms": round(1000 * self.write_seconds / self.writes, 1) if self.writes else None,
        }


class StripStudio:
    """Per-Home-Assistant state for the studio."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self.store: Store[dict[str, Any]] = Store(hass, STORE_VERSION, STORE_KEY)
        self.data: dict[str, Any] = {"geometry": {}, "effects": {}}
        self.players: dict[str, _Player] = {}
        self.listeners: set[Any] = set()
        self._state_unsubs: dict[str, Any] = {}

    async def async_load(self) -> None:
        stored = await self.store.async_load()
        if isinstance(stored, dict):
            self.data["geometry"] = dict(stored.get("geometry", {}))
            self.data["effects"] = dict(stored.get("effects", {}))

    async def async_save(self) -> None:
        await self.store.async_save(self.data)

    # -- devices -----------------------------------------------------------------
    def _entries(self) -> list[ConfigEntry]:
        return [
            entry
            for entry in self.hass.config_entries.async_entries(DOMAIN)
            if getattr(entry, "runtime_data", None) is not None
        ]

    def coordinator(self, entry_id: str) -> Any:
        entry = self.hass.config_entries.async_get_entry(entry_id)
        if entry is None or entry.domain != DOMAIN or getattr(entry, "runtime_data", None) is None:
            raise StudioValidationError("device is not loaded")
        coordinator = entry.runtime_data
        if not coordinator.profile.supports_segments:
            raise StudioValidationError("this device does not support segment control")
        return coordinator

    def units(self, entry_id: str) -> tuple[int, int]:
        """(fine units for geometry, segment count)."""
        profile = self.coordinator(entry_id).profile
        segments = profile.segment_count
        ics = profile.physical_ic_count or segments
        return ics, segments

    def geometry(self, entry_id: str) -> Geometry:
        ics, _ = self.units(entry_id)
        raw = self.data["geometry"].get(entry_id, {})
        try:
            return Geometry.from_dict(raw, ics)
        except StudioValidationError:
            return Geometry(units=ics)

    def light_entity_id(self, entry_id: str) -> str | None:
        registry = er.async_get(self.hass)
        for entity in er.async_entries_for_config_entry(registry, entry_id):
            if entity.domain == "light":
                return entity.entity_id
        return None

    def device_info(self, entry_id: str) -> dict[str, Any]:
        entry = self.hass.config_entries.async_get_entry(entry_id)
        coordinator = self.coordinator(entry_id)
        ics, segments = self.units(entry_id)
        player = self.players.get(entry_id)
        return {
            "entry_id": entry_id,
            "title": entry.title if entry else entry_id,
            "model": coordinator.model,
            "ic_count": ics,
            "segment_count": segments,
            "geometry": self.geometry(entry_id).to_dict(),
            "light_entity_id": self.light_entity_id(entry_id),
            "player": player.status() if player else None,
        }

    # -- playback ----------------------------------------------------------------
    def _notify(self, entry_id: str) -> None:
        try:
            payload = self.device_info(entry_id)
        except Exception:  # noqa: BLE001 - device may be unloading
            return
        for listener in list(self.listeners):
            listener(payload)

    async def async_play(self, entry_id: str, effect: Effect, *, name: str | None = None) -> None:
        await self.async_stop(entry_id, notify=False)
        coordinator = self.coordinator(entry_id)
        player = _Player(entry_id=entry_id, effect=effect, name=name)
        self.players[entry_id] = player
        player.task = self.hass.async_create_background_task(
            self._run(coordinator, player), f"{DOMAIN} strip studio {entry_id}"
        )
        self._watch_light(entry_id)
        self._notify(entry_id)

    async def async_stop(self, entry_id: str, *, notify: bool = True) -> None:
        player = self.players.get(entry_id)
        if player is not None and player.task is not None and not player.task.done():
            player.task.cancel()
            try:
                await player.task
            except (asyncio.CancelledError, Exception):  # noqa: BLE001 - shutdown of our own task
                pass
        if notify and entry_id in self.players:
            self._notify(entry_id)

    def _watch_light(self, entry_id: str) -> None:
        if entry_id in self._state_unsubs:
            return
        entity_id = self.light_entity_id(entry_id)
        if entity_id is None:
            return

        @callback
        def _changed(event: Event) -> None:
            new = event.data.get("new_state")
            if new is not None and new.state == "off":
                player = self.players.get(entry_id)
                if player is not None and player.task is not None and not player.task.done():
                    self.hass.async_create_task(self.async_stop(entry_id))

        self._state_unsubs[entry_id] = async_track_state_change_event(self.hass, [entity_id], _changed)

    async def _write(self, coordinator: Any, player: _Player, segments: list[int], rgb: tuple[int, int, int]) -> None:
        packet = build_segment_color(segments, *rgb, coordinator.model, profile=coordinator.profile)
        started = time.monotonic()
        await coordinator.send_command(packet)
        player.write_seconds += time.monotonic() - started
        player.writes += 1

    async def _run(self, coordinator: Any, player: _Player) -> None:
        effect = player.effect
        geometry = self.geometry(player.entry_id).rescale(coordinator.profile.segment_count)
        previous: dict[int, tuple[int, int, int]] | None = None
        hidden = [
            s
            for s in range(1, coordinator.profile.segment_count + 1)
            if s not in set(geometry.positions)
        ]
        try:
            if hidden:
                # Cut-off segments are dark so wrap-around never lights invisible hardware.
                await self._write(coordinator, player, hidden, (0, 0, 0))
            while True:
                t = time.monotonic() - player.started
                frame = render(effect, geometry, t)
                writes = frame_writes(frame, previous, step=QUANTIZE_STEP)
                for segments, rgb in writes:
                    try:
                        await self._write(coordinator, player, segments, rgb)
                    except asyncio.CancelledError:
                        raise
                    except Exception as err:  # noqa: BLE001 - keep playing through transient BLE errors
                        player.errors += 1
                        player.last_error = str(err) or type(err).__name__
                        previous = None  # force a full repaint
                        await asyncio.sleep(0.5)
                        break
                else:
                    previous = quantized_frame(frame, QUANTIZE_STEP)
                player.frames += 1
                if player.frames % 10 == 0:
                    self._notify(player.entry_id)
                if not effect.animated:
                    if previous is not None:
                        break
                    continue
                await asyncio.sleep(MIN_FRAME_INTERVAL)
        finally:
            self._notify(player.entry_id)

    async def async_benchmark(self, entry_id: str, count: int) -> dict[str, Any]:
        await self.async_stop(entry_id, notify=False)
        coordinator = self.coordinator(entry_id)
        segments = list(range(1, coordinator.profile.segment_count + 1))
        times: list[float] = []
        errors: list[str] = []
        colors = [(255, 40, 0), (0, 60, 255)]
        for index in range(count):
            packet = build_segment_color(
                segments[index % 2 :: 2], *colors[index % 2], coordinator.model, profile=coordinator.profile
            )
            started = time.monotonic()
            try:
                await coordinator.send_command(packet)
            except Exception as err:  # noqa: BLE001 - reported to the caller
                errors.append(str(err) or type(err).__name__)
            times.append(time.monotonic() - started)
        ordered = sorted(times)
        return {
            "count": count,
            "errors": errors,
            "median_ms": round(1000 * ordered[len(ordered) // 2], 1),
            "min_ms": round(1000 * ordered[0], 1),
            "max_ms": round(1000 * ordered[-1], 1),
            "times_ms": [round(1000 * t, 1) for t in times],
        }


def _studio(hass: HomeAssistant) -> StripStudio:
    return hass.data[_DATA]


def _error(connection: websocket_api.ActiveConnection, msg_id: int, err: Exception) -> None:
    connection.send_error(msg_id, "studio_error", str(err) or type(err).__name__)


# -- websocket API -------------------------------------------------------------------


@websocket_api.websocket_command({vol.Required("type"): f"{WS}/info"})
@callback
def ws_info(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    studio = _studio(hass)
    devices = []
    for entry in studio._entries():
        try:
            devices.append(studio.device_info(entry.entry_id))
        except StudioValidationError:
            continue
    connection.send_result(
        msg["id"],
        {
            "version": STUDIO_VERSION,
            "effect_types": list(EFFECT_TYPES),
            "directions": list(DIRECTIONS),
            "devices": devices,
            "effects": studio.data["effects"],
        },
    )


@websocket_api.websocket_command({vol.Required("type"): f"{WS}/subscribe"})
@callback
def ws_subscribe(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    studio = _studio(hass)

    @callback
    def forward(payload: dict[str, Any]) -> None:
        connection.send_event(msg["id"], payload)

    studio.listeners.add(forward)

    @callback
    def unsubscribe() -> None:
        studio.listeners.discard(forward)

    connection.subscriptions[msg["id"]] = unsubscribe
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{WS}/geometry/set",
        vol.Required("entry_id"): str,
        vol.Required("geometry"): dict,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_geometry_set(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    studio = _studio(hass)
    try:
        ics, _ = studio.units(msg["entry_id"])
        geometry = Geometry.from_dict(msg["geometry"], ics)
        studio.data["geometry"][msg["entry_id"]] = {
            k: v for k, v in geometry.to_dict().items() if k != "units"
        }
        await studio.async_save()
        player = studio.players.get(msg["entry_id"])
        if player is not None and player.task is not None and not player.task.done():
            await studio.async_play(msg["entry_id"], player.effect, name=player.name)
    except Exception as err:  # noqa: BLE001
        _error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], studio.device_info(msg["entry_id"]))


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{WS}/play",
        vol.Required("entry_id"): str,
        vol.Optional("effect"): dict,
        vol.Optional("effect_id"): str,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_play(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    studio = _studio(hass)
    try:
        name = None
        if "effect_id" in msg:
            saved = studio.data["effects"].get(msg["effect_id"])
            if saved is None:
                raise StudioValidationError("unknown effect")
            effect, name = Effect.from_dict(saved["effect"]), saved["name"]
        elif "effect" in msg:
            effect = Effect.from_dict(msg["effect"])
        else:
            raise StudioValidationError("effect or effect_id is required")
        await studio.async_play(msg["entry_id"], effect, name=name)
    except Exception as err:  # noqa: BLE001
        _error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], studio.device_info(msg["entry_id"]))


@websocket_api.websocket_command({vol.Required("type"): f"{WS}/stop", vol.Required("entry_id"): str})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_stop(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    studio = _studio(hass)
    await studio.async_stop(msg["entry_id"])
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{WS}/effects/save",
        vol.Optional("effect_id"): str,
        vol.Required("name"): vol.All(str, vol.Length(min=1, max=40)),
        vol.Required("effect"): dict,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_effect_save(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    studio = _studio(hass)
    try:
        effect = Effect.from_dict(msg["effect"])
        effect_id = msg.get("effect_id") or uuid.uuid4().hex[:12]
        studio.data["effects"][effect_id] = {"name": msg["name"].strip(), "effect": effect.to_dict()}
        await studio.async_save()
    except Exception as err:  # noqa: BLE001
        _error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], {"effect_id": effect_id, "effects": studio.data["effects"]})


@websocket_api.websocket_command(
    {vol.Required("type"): f"{WS}/effects/delete", vol.Required("effect_id"): str}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_effect_delete(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    studio = _studio(hass)
    studio.data["effects"].pop(msg["effect_id"], None)
    await studio.async_save()
    connection.send_result(msg["id"], {"effects": studio.data["effects"]})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{WS}/benchmark",
        vol.Required("entry_id"): str,
        vol.Optional("count", default=10): vol.All(int, vol.Range(min=1, max=40)),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_benchmark(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    try:
        result = await _studio(hass).async_benchmark(msg["entry_id"], msg["count"])
    except Exception as err:  # noqa: BLE001
        _error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], result)


# -- setup ---------------------------------------------------------------------------


async def async_setup_strip_studio(hass: HomeAssistant) -> None:
    if _DATA in hass.data:
        return
    studio = StripStudio(hass)
    await studio.async_load()
    hass.data[_DATA] = studio
    for handler in (
        ws_info,
        ws_subscribe,
        ws_geometry_set,
        ws_play,
        ws_stop,
        ws_effect_save,
        ws_effect_delete,
        ws_benchmark,
    ):
        websocket_api.async_register_command(hass, handler)
    if _STATIC_DIR.is_dir():
        await hass.http.async_register_static_paths(
            [StaticPathConfig(STATIC_URL, str(_STATIC_DIR), cache_headers=False)]
        )
        frontend.async_register_built_in_panel(
            hass,
            component_name="custom",
            sidebar_title="Strip Studio",
            sidebar_icon="mdi:led-strip-variant",
            frontend_url_path=PANEL_PATH,
            require_admin=True,
            config={
                "_panel_custom": {
                    "name": PANEL_ELEMENT,
                    "module_url": f"{STATIC_URL}/panel.js?v={STUDIO_VERSION}",
                    "embed_iframe": False,
                    "trust_external": False,
                }
            },
            update=True,
        )


async def async_unload_strip_studio_entry(hass: HomeAssistant, entry_id: str) -> None:
    studio = hass.data.get(_DATA)
    if studio is None:
        return
    await studio.async_stop(entry_id, notify=False)
    studio.players.pop(entry_id, None)
    if (unsub := studio._state_unsubs.pop(entry_id, None)) is not None:
        unsub()
