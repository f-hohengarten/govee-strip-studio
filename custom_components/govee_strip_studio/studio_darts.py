"""Strip Studio reacting to Autodarts games (via darts-caller).

Events arrive from ``darts_feed.DartsFeed``, are classified by ``darts_rules`` and
played as saved Strip Studio effects on one strip.  Short effects (a 180, a bust)
return to the idle look of the player whose turn it is.  Every event is also fired
on the Home Assistant bus as ``govee_strip_studio_darts`` for custom automations.

Part of Govee Strip Studio, built on teh-hippo/ha-govee-led-ble (MIT).
"""

from __future__ import annotations

import asyncio
import logging
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import DOMAIN
from .darts_feed import DartsFeed
from .darts_rules import TRIGGERS, Reaction, duration_of, idle_candidates, pick, react
from .studio_render import Effect, StudioValidationError

if TYPE_CHECKING:
    from .strip_studio import StripStudio

_LOGGER = logging.getLogger(__name__)

EVENT_TYPE = f"{DOMAIN}_darts"
DEFAULT_PORT = 8079
DEFAULT_CONFIG: dict[str, Any] = {"enabled": False, "host": "", "port": DEFAULT_PORT, "entry_id": None, "rules": {}}


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
    }


class DartsController:
    """One darts-caller connection driving one strip."""

    def __init__(self, studio: StripStudio) -> None:
        self.studio = studio
        self.hass: HomeAssistant = studio.hass
        self.feed: DartsFeed | None = None
        self.player: str | None = None  # playerIndex whose turn it is
        self.active: str | None = None  # trigger currently shown
        self._revert: asyncio.TimerHandle | None = None
        self._generation = 0  # bumped by every event; a stale revert must not undo a newer effect
        self._lock = asyncio.Lock()

    @property
    def config(self) -> dict[str, Any]:
        return self.studio.data.setdefault("darts", dict(DEFAULT_CONFIG))

    def status(self) -> dict[str, Any]:
        feed = self.feed.status() if self.feed is not None else None
        return {**self.config, "feed": feed, "player": self.player, "active": self.active}

    def _notify(self) -> None:
        entry_id = self.config.get("entry_id")
        if entry_id:
            self.studio._notify(entry_id)

    async def async_restart(self) -> None:
        await self.async_stop()
        cfg = self.config
        if not (cfg.get("enabled") and cfg.get("host") and cfg.get("entry_id")):
            self._notify()
            return
        self.feed = DartsFeed(
            async_get_clientsession(self.hass, verify_ssl=False),
            cfg["host"],
            cfg["port"],
            self._on_event,
            self._notify,
        )
        self.feed.start(lambda coro: self.hass.async_create_background_task(coro, f"{DOMAIN} darts-caller feed"))
        self._notify()

    async def async_stop(self) -> None:
        self._cancel_revert()
        if self.feed is not None:
            await self.feed.stop()
            self.feed = None

    # -- events --------------------------------------------------------------------
    @callback
    def _on_event(self, msg: dict[str, Any]) -> None:
        self.hass.bus.async_fire(
            EVENT_TYPE,
            {
                "event": msg.get("event"),
                "player": msg.get("player"),
                "player_index": msg.get("playerIndex"),
                "game": msg.get("game") if isinstance(msg.get("game"), dict) else {},
                "data": msg.get("data") if isinstance(msg.get("data"), dict) else {},
            },
        )
        reaction = react(msg)
        if reaction.player is not None:
            self.player = reaction.player
        if msg.get("event") in ("match-ended", "lobby"):
            self.player = None
        if reaction.kind != "none":
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
