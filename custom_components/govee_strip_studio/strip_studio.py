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
from .control_arbiter import ControlIntent
from .coordinator_status import ParsedMode
from .effect_catalogue import requires_approved_diy_slot
from .effect_compiler import DIY_ACK_EVIDENCE, compile_application, resolve_diy_code, validate_compiled_geometry
from .effect_setup import get_effect_backend
from .darts_rules import DEFAULT_DURATION, STATE_TRIGGERS, TRIGGER_GROUPS
from .generated_protocol_adapter import build_power
from .light_commands import build_segment_color
from .studio_darts import DEFAULT_CONFIG as DEFAULT_DARTS
from .studio_darts import DartsController
from .studio_darts import validate_config as validate_darts_config
from .studio_render import (
    DIRECTIONS,
    EFFECT_TYPES,
    Effect,
    Geometry,
    StudioValidationError,
    frame_writes,
    native_pattern,
    quantized_frame,
    render,
)

_LOGGER = logging.getLogger(__name__)

STUDIO_VERSION = "0.2.0"
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
    # Set when ``effect`` is swapped in place; wakes a player idling after a static frame.
    changed: asyncio.Event = field(default_factory=asyncio.Event)

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
        self.data: dict[str, Any] = {"geometry": {}, "effects": {}, "darts": dict(DEFAULT_DARTS)}
        self.players: dict[str, _Player] = {}
        # Effects the strip is animating by itself (native playback), per entry.
        self.native: dict[str, dict[str, Any]] = {}
        # Live edits while an upload runs: only the newest one is sent next.
        self._native_next: dict[str, tuple[Effect, str | None]] = {}
        self._native_workers: dict[str, asyncio.Task] = {}
        self.darts = DartsController(self)
        self.listeners: set[Any] = set()
        self._state_unsubs: dict[str, Any] = {}

    async def async_load(self) -> None:
        stored = await self.store.async_load()
        if isinstance(stored, dict):
            self.data["geometry"] = dict(stored.get("geometry", {}))
            self.data["effects"] = dict(stored.get("effects", {}))
            if isinstance(stored.get("darts"), dict):
                self.data["darts"] = validate_darts_config(stored["darts"])

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
            "native": self.native.get(entry_id),
            "darts": self.darts.status() if self.data["darts"].get("entry_id") == entry_id else None,
        }

    # -- playback ----------------------------------------------------------------
    def _notify(self, entry_id: str) -> None:
        try:
            payload = self.device_info(entry_id)
        except Exception:  # noqa: BLE001 - device may be unloading
            return
        for listener in list(self.listeners):
            listener(payload)

    async def async_play(
        self, entry_id: str, effect: Effect, *, name: str | None = None, live: bool = False
    ) -> None:
        """Play ``effect``.  ``live`` updates a running player in place.

        In-place updates keep the animation clock and the last written frame, so only
        the segments that actually change are sent.  A normal play repaints everything,
        which also recovers from any change made to the strip outside the studio.
        """
        if effect.playback == "native":
            await self.async_stop(entry_id, notify=False)
            if live:
                self._native_next[entry_id] = (effect, name)
                worker = self._native_workers.get(entry_id)
                if worker is None or worker.done():
                    self._native_workers[entry_id] = self.hass.async_create_background_task(
                        self._native_worker(entry_id), f"{DOMAIN} strip studio upload {entry_id}"
                    )
                return
            self._native_next.pop(entry_id, None)  # an explicit play supersedes queued live edits
            await self._async_apply_native(entry_id, effect, name)
            self.native[entry_id] = {"name": name, "effect": effect.to_dict()}
            self._notify(entry_id)
            return
        self.native.pop(entry_id, None)
        player = self.players.get(entry_id)
        if live and player is not None and player.task is not None and not player.task.done():
            player.effect = effect
            player.name = name
            player.changed.set()
            self._notify(entry_id)
            return
        await self.async_stop(entry_id, notify=False)
        coordinator = self.coordinator(entry_id)
        player = _Player(entry_id=entry_id, effect=effect, name=name)
        self.players[entry_id] = player
        player.task = self.hass.async_create_background_task(
            self._run(coordinator, player), f"{DOMAIN} strip studio {entry_id}"
        )
        self._watch_light(entry_id)
        self._notify(entry_id)

    async def _native_worker(self, entry_id: str) -> None:
        while (queued := self._native_next.pop(entry_id, None)) is not None:
            effect, name = queued
            status: dict[str, Any] = {"name": name, "effect": effect.to_dict()}
            try:
                await self._async_apply_native(entry_id, effect, name)
            except asyncio.CancelledError:
                raise
            except Exception as err:  # noqa: BLE001 - reported through the status stream
                status["error"] = str(err) or type(err).__name__
            self.native[entry_id] = status
            self._notify(entry_id)

    async def _async_apply_native(self, entry_id: str, effect: Effect, name: str | None) -> None:
        """Upload a per-IC painted pattern; the strip then animates it on its own.

        Uses upstream's compiler and its effect-sequence writer (reconnects, retries,
        waits for the upload ACK) but not its deployment engine: that engine reads the
        full device state before every apply and reads it back afterwards, which costs
        several round trips per edit and fails outright when the link has dropped.
        """
        backend = get_effect_backend(self.hass)
        if backend is None:
            raise StudioValidationError("the effect backend of this integration is not available")
        coordinator = self.coordinator(entry_id)
        if requires_approved_diy_slot(coordinator.model):
            raise StudioValidationError("this device needs the expert editor for on-strip effects")
        geometry = self.geometry(entry_id)
        if geometry.units != coordinator.profile.physical_ic_count:
            raise StudioValidationError("this device does not report its IC count")
        pattern = native_pattern(effect, geometry)
        item = backend.application.new_authored_item(
            name=(name or "Strip Studio")[:40],
            content={
                "kind": "h617a_painted",
                "effect": pattern.effect,
                "speed": pattern.speed,
                "brightness": effect.brightness,
                "segments": [None if c is None else list(c) for c in pattern.colors],
                "addressing": "physical_ic",
            },
        )
        diy_code = resolve_diy_code(item, None, model=coordinator.model, profile=coordinator.profile)
        compiled = compile_application(item, coordinator.model, diy_code=diy_code, profile=coordinator.profile)
        await backend.preview.async_supersede_device(entry_id, reason="committed_apply")

        def guard() -> None:
            validate_compiled_geometry(compiled, coordinator.profile)

        if not coordinator.is_on:
            await coordinator.send_command(build_power(True, coordinator.model), write_guard=guard)
            coordinator.is_on = True
        options: dict[str, Any] = {}
        if DIY_ACK_EVIDENCE in compiled.evidence_codes:
            options = {"require_upload_ack": True, "upload_ack_index": len(compiled.upload_packets) - 1}
        final = compiled.activation_packet if compiled.upload_transport == "a1_02" else None
        if final is not None:
            options["final_packet"] = final
        await coordinator.async_write_effect_sequence(
            compiled.upload_packets if final is not None else compiled.packets,
            intent=ControlIntent.APPLY,
            write_guard=guard,
            **options,
        )
        # Same optimistic mode bookkeeping as upstream after a DIY activation.
        coordinator.color_mode = ParsedMode.DIY
        coordinator._scene_code = None
        coordinator.effect = None
        coordinator.diy_code = compiled.diy_code
        coordinator.music_mode = coordinator.video_mode = "off"
        coordinator.async_update_listeners()

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
                # Clear before rendering: a swap that lands during the writes below must not be lost.
                player.changed.clear()
                effect = player.effect
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
                        # Frame is on the strip; stay ready for live edits.
                        await player.changed.wait()
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
            "darts": studio.darts.status(),
            "darts_triggers": [[group, [list(item) for item in items]] for group, items in TRIGGER_GROUPS],
            "darts_state_triggers": sorted(STATE_TRIGGERS),
            "darts_default_duration": DEFAULT_DURATION,
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
        native = studio.native.get(msg["entry_id"])
        if player is not None and player.task is not None and not player.task.done():
            await studio.async_play(msg["entry_id"], player.effect, name=player.name)
        elif native is not None:
            await studio.async_play(msg["entry_id"], Effect.from_dict(native["effect"]), name=native["name"])
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
        vol.Optional("live", default=False): bool,
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
        await studio.async_play(msg["entry_id"], effect, name=name, live=msg["live"])
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


@websocket_api.websocket_command(
    {vol.Required("type"): f"{WS}/darts/set", vol.Required("config"): dict}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_darts_set(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    studio = _studio(hass)
    try:
        config = validate_darts_config(msg["config"])
        if config["entry_id"] is not None:
            studio.coordinator(config["entry_id"])  # must be a loaded strip
        studio.data["darts"] = config
        await studio.async_save()
        await studio.darts.async_restart()
    except Exception as err:  # noqa: BLE001
        _error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"], studio.darts.status())


@websocket_api.websocket_command(
    {vol.Required("type"): f"{WS}/darts/simulate", vol.Required("trigger"): str}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_darts_simulate(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    try:
        await _studio(hass).darts.async_simulate(msg["trigger"])
    except Exception as err:  # noqa: BLE001
        _error(connection, msg["id"], err)
        return
    connection.send_result(msg["id"])


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
        ws_darts_set,
        ws_darts_simulate,
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
    # Connects in the background and keeps retrying, so the strip need not be loaded yet.
    await studio.darts.async_restart()


async def async_unload_strip_studio_entry(hass: HomeAssistant, entry_id: str) -> None:
    studio = hass.data.get(_DATA)
    if studio is None:
        return
    await studio.async_stop(entry_id, notify=False)
    studio.players.pop(entry_id, None)
    studio.native.pop(entry_id, None)
    studio._native_next.pop(entry_id, None)
    if (worker := studio._native_workers.pop(entry_id, None)) is not None:
        worker.cancel()
    if (unsub := studio._state_unsubs.pop(entry_id, None)) is not None:
        unsub()
