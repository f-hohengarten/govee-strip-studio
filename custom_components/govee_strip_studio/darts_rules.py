"""Map darts-caller game events onto Light Studio triggers.

Pure and dependency-free (tests load it directly).  darts-caller
(https://github.com/Peschi90/darts-caller) forwards autodarts.io game events as
Socket.IO ``message`` payloads such as::

    {"event": "dart1-thrown", "playerIndex": "0", "game": {"mode": "X01", "dartValue": "60",
     "fieldName": "t20", "fieldMultiplier": 3}}
    {"event": "darts-thrown", "playerIndex": "0", "game": {"dartValue": "180", ...}}
    {"event": "Board Status", "data": {"status": "Takeout Started"}}

Part of Light Studio, built on teh-hippo/ha-govee-led-ble (MIT).
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

MAX_PLAYERS = 4

# Trigger id -> German label, grouped for the panel.  Order inside a group is the
# lookup priority: the first configured trigger that matches wins.
TRIGGER_GROUPS: tuple[tuple[str, tuple[tuple[str, str], ...]], ...] = (
    (
        "Grundzustand",
        (
            ("idle", "Bereit (Standard)"),
            *((f"player_{i}", f"Spieler {i + 1} am Zug") for i in range(MAX_PLAYERS)),
        ),
    ),
    (
        "Einzelner Dart",
        (
            ("dart_bullseye", "Bullseye (50)"),
            ("dart_bull", "Bull (25)"),
            ("dart_t20", "Triple 20"),
            ("dart_triple", "Triple"),
            ("dart_double", "Double"),
            ("dart_miss", "Daneben (0)"),
        ),
    ),
    (
        "Aufnahme (3 Darts)",
        (
            ("visit_180", "180"),
            ("visit_140", "ab 140"),
            ("visit_100", "ab 100"),
            ("visit_60", "ab 60"),
            ("visit_0", "0 Punkte"),
        ),
    ),
    (
        "Spiel",
        (
            ("busted", "Bust"),
            ("high_finish", "High Finish (ab 100)"),
            ("game_won", "Leg gewonnen"),
            ("match_won", "Match gewonnen"),
            ("match_started", "Match gestartet"),
            ("match_ended", "Match beendet"),
        ),
    ),
    (
        "Board",
        (
            ("takeout", "Darts ziehen (Takeout)"),
            ("board_stopped", "Board gestoppt"),
            ("calibration", "Kalibrierung"),
        ),
    ),
)
TRIGGERS: tuple[str, ...] = tuple(t for _, items in TRIGGER_GROUPS for t, _ in items)

# Triggers that end on their own (state changes), not after a duration.
STATE_TRIGGERS = frozenset({"idle", *(f"player_{i}" for i in range(MAX_PLAYERS)), "takeout", "board_stopped", "calibration"})
DEFAULT_DURATION = 3.0
HIGH_FINISH = 100


@dataclass(frozen=True, slots=True)
class Reaction:
    """What the strip should do for one event."""

    kind: str  # "trigger": play a rule | "idle": return to the idle/player effect | "none"
    candidates: tuple[str, ...] = ()  # trigger ids, most specific first
    player: str | None = None  # playerIndex the event belongs to, if any


NONE = Reaction("none")


def _int(value: Any) -> int | None:
    try:
        return int(str(value).strip())
    except (TypeError, ValueError):
        return None


def _player(msg: dict[str, Any]) -> str | None:
    value = msg.get("playerIndex")
    return None if value is None else str(value)


def dart_candidates(game: dict[str, Any]) -> tuple[str, ...]:
    value = _int(game.get("dartValue"))
    field = str(game.get("fieldName") or "").strip().lower()
    multiplier = _int(game.get("fieldMultiplier"))
    if value == 50 or field == "d25":
        return ("dart_bullseye", "dart_bull")
    if value == 25 or field == "s25":
        return ("dart_bull",)
    if multiplier == 3 or field.startswith("t") or value == 60:  # one dart scores 60 only as T20
        return ("dart_t20", "dart_triple") if value == 60 or field == "t20" else ("dart_triple",)
    if multiplier == 2 or field.startswith("d"):
        return ("dart_double",)
    if value == 0:
        return ("dart_miss",)
    return ()


def visit_candidates(score: int | None) -> tuple[str, ...]:
    if score is None:
        return ()
    if score == 180:
        return ("visit_180", "visit_140", "visit_100", "visit_60")
    if score >= 140:
        return ("visit_140", "visit_100", "visit_60")
    if score >= 100:
        return ("visit_100", "visit_60")
    if score >= 60:
        return ("visit_60",)
    if score == 0:
        return ("visit_0",)
    return ()


def react(msg: Any) -> Reaction:
    """Classify one darts-caller message."""
    if not isinstance(msg, dict):
        return NONE
    event = msg.get("event")
    player = _player(msg)
    game = msg.get("game") if isinstance(msg.get("game"), dict) else {}
    if event in ("dart1-thrown", "dart2-thrown", "dart3-thrown"):
        return Reaction("trigger", dart_candidates(game), player)
    if event == "darts-thrown":
        return Reaction("trigger", visit_candidates(_int(game.get("dartValue"))), player)
    if event == "busted":
        return Reaction("trigger", ("busted",), player)
    if event in ("game-won", "match-won"):
        won = ("match_won", "game_won") if event == "match-won" else ("game_won",)
        checkout = _int(game.get("dartsThrownValue"))
        high = ("high_finish",) if checkout is not None and checkout >= HIGH_FINISH else ()
        return Reaction("trigger", high + won, player)
    if event in ("darts-pulled", "game-started"):
        return Reaction("idle", (), player)
    if event == "match-started":
        return Reaction("trigger", ("match_started",), player)
    if event == "match-ended":
        return Reaction("trigger", ("match_ended",), None)
    if event == "Board Status":
        data = msg.get("data") if isinstance(msg.get("data"), dict) else {}
        status = data.get("status")
        if status == "Takeout Started":
            return Reaction("trigger", ("takeout",), player)
        if status == "Board Stopped":
            return Reaction("trigger", ("board_stopped",), player)
        if status == "Calibration Started":
            return Reaction("trigger", ("calibration",), player)
        if status in ("Takeout Finished", "Board Started", "Calibration Finished"):
            return Reaction("idle", (), player)
    return NONE


def idle_candidates(player: str | None) -> tuple[str, ...]:
    """Idle look for the player whose turn it is, falling back to the general idle."""
    index = _int(player)
    if index is not None and 0 <= index < MAX_PLAYERS:
        return (f"player_{index}", "idle")
    return ("idle",)


def pick(rules: dict[str, Any], candidates: tuple[str, ...]) -> tuple[str, dict[str, Any]] | None:
    """First candidate with a configured effect."""
    for trigger in candidates:
        rule = rules.get(trigger)
        if isinstance(rule, dict) and rule.get("effect_id"):
            return trigger, rule
    return None


def duration_of(trigger: str, rule: dict[str, Any]) -> float | None:
    """Seconds until the idle look returns; None for state triggers (they end on their own)."""
    if trigger in STATE_TRIGGERS:
        return None
    value = rule.get("duration", DEFAULT_DURATION)
    try:
        return max(0.5, min(60.0, float(value)))
    except (TypeError, ValueError):
        return DEFAULT_DURATION


def game_update(game: dict[str, Any], msg: dict[str, Any]) -> bool:
    """Fold one darts-caller event into the live game summary; True if it changed."""
    event = str(msg.get("event") or "")
    info = msg.get("game") if isinstance(msg.get("game"), dict) else {}
    if event == "match-started":
        game.clear()
        game.update({"event": event, "darts": []})
        return True
    if event in ("match-ended", "lobby"):
        changed = bool(game)
        game.clear()
        return changed
    if not (event.startswith("dart") or event in ("busted", "game-won", "match-won")):
        return False
    if msg.get("player") is not None:
        game["player"] = str(msg["player"])
    if info.get("pointsLeft") not in (None, ""):
        game["points_left"] = info["pointsLeft"]
    if info.get("mode"):
        game["mode"] = info["mode"]
    darts = game.setdefault("darts", [])
    if event.endswith("-thrown") and event[4:5].isdigit():
        if info.get("dartNumber") in ("1", 1):
            darts.clear()
        darts.append({"field": info.get("fieldName") or "", "value": info.get("dartValue")})
        del darts[:-3]
    elif event == "darts-thrown":
        game["visit"] = info.get("dartValue")
    elif event in ("game-won", "match-won"):
        game["visit"] = info.get("dartsThrownValue", game.get("visit"))
    game["event"] = event
    return True


def board_throws(state: Any) -> list[dict[str, Any]]:
    """The current visit's darts from the Autodarts Board Manager (``GET /api/state``).

    Coordinates are in units of the double ring's outer edge (170 mm), y pointing up;
    ``bed`` names the ring (SingleInner, Triple, …) and ``number`` the segment (25 = bull).
    """
    if not isinstance(state, dict) or not isinstance(state.get("throws"), list):
        return []
    out = []
    for item in state["throws"][:3]:
        if not isinstance(item, dict):
            continue
        try:
            x, y = float(item["coordsX"]), float(item["coordsY"])
        except (KeyError, TypeError, ValueError):
            continue
        if not (-2 <= x <= 2 and -2 <= y <= 2):
            continue
        try:
            number = int(item.get("segmentNumber") or 0)
        except (TypeError, ValueError):
            number = 0
        out.append(
            {
                "x": round(x, 4),
                "y": round(y, 4),
                "name": str(item.get("segmentName") or "")[:8],
                "bed": str(item.get("bed") or "")[:16],
                "number": number if 0 <= number <= 25 else 0,
            }
        )
    return out
