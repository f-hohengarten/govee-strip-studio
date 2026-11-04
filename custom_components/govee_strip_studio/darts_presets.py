"""Ready-made darts effects, in the spirit of darts-wled's examples.

Pure data plus one pure function (tests load this file directly).  Quick, frequent
reactions (single darts, turn colours) use Home Assistant playback: one colour change
reaches the strip almost at once.  Rarer highlights (big visits, wins) use native
playback: the upload takes a moment, but the strip then animates smoothly by itself.

Part of Govee Strip Studio, built on teh-hippo/ha-govee-led-ble (MIT).
"""

from __future__ import annotations

from typing import Any

DARTS_GROUP = "darts"  # library group: shown with the darts settings, not under "Meine Effekte"

RED, GREEN, BLUE = [255, 0, 0], [0, 200, 40], [10, 90, 255]
GOLD, ORANGE, WHITE = [255, 170, 0], [255, 90, 0], [255, 255, 255]
CYAN, MAGENTA, PURPLE, BLACK = [0, 200, 255], [255, 0, 160], [150, 40, 255], [0, 0, 0]
RAINBOW = [[255, 0, 0], [255, 140, 0], [255, 230, 0], [0, 210, 60], [0, 120, 255], [150, 40, 255]]


def _static(color: list[int], brightness: int = 100) -> dict[str, Any]:
    return {"type": "static", "colors": [color], "brightness": brightness, "playback": "ha"}


def _marquee(colors: list[list[int]], *, speed: int, block: int = 3, gap: int = 2, tail: int = 70) -> dict[str, Any]:
    # block + gap = 5 divides the 30 ICs: the pattern loops over cut-off ICs without a seam.
    return {"type": "marquee", "colors": colors, "direction": "forward", "speed": speed,
            "block": block, "gap": gap, "tail": tail, "brightness": 100, "playback": "native"}


def _gradient(colors: list[list[int]], *, speed: int) -> dict[str, Any]:
    return {"type": "gradient", "colors": colors, "speed": speed, "brightness": 100, "playback": "native"}


# id -> (name, effect).  Ids are stable so installing twice never duplicates anything.
PRESETS: dict[str, tuple[str, dict[str, Any]]] = {
    "darts-idle": ("Darts · Bereit", _static([255, 190, 120], 45)),
    "darts-player-1": ("Darts · Spieler 1", _static(BLUE, 70)),
    "darts-player-2": ("Darts · Spieler 2", _static(GREEN, 70)),
    "darts-player-3": ("Darts · Spieler 3", _static(ORANGE, 70)),
    "darts-player-4": ("Darts · Spieler 4", _static(PURPLE, 70)),
    "darts-bullseye": ("Darts · Bullseye", {"type": "segments", "segments": [RED, GREEN] * 8, "playback": "ha"}),
    "darts-bull": ("Darts · Bull", _static(GREEN)),
    "darts-t20": ("Darts · Triple 20", _static(RED)),
    "darts-triple": ("Darts · Triple", _static(MAGENTA)),
    "darts-double": ("Darts · Double", _static(CYAN)),
    "darts-180": ("Darts · 180", _gradient(RAINBOW, speed=95)),
    "darts-140": ("Darts · ab 140", _marquee([GOLD], speed=95)),
    "darts-100": ("Darts · ab 100", _marquee([ORANGE, WHITE], speed=85)),
    "darts-bust": ("Darts · Bust", {"type": "fade", "colors": [RED, BLACK], "speed": 100, "playback": "ha"}),
    "darts-high-finish": ("Darts · High Finish", _gradient([GOLD, ORANGE, WHITE], speed=95)),
    "darts-leg": ("Darts · Leg gewonnen", _marquee([GREEN, WHITE], speed=90)),
    "darts-match": ("Darts · Match gewonnen", _gradient(RAINBOW, speed=100)),
    "darts-takeout": ("Darts · Darts ziehen", _static(WHITE, 80)),
    "darts-board-stopped": ("Darts · Board gestoppt", _static(RED, 25)),
    "darts-calibration": ("Darts · Kalibrierung", _static(WHITE)),
}

# trigger -> (preset id, seconds or None for state triggers)
PRESET_RULES: dict[str, tuple[str, float | None]] = {
    "idle": ("darts-idle", None),
    "player_0": ("darts-player-1", None),
    "player_1": ("darts-player-2", None),
    "player_2": ("darts-player-3", None),
    "player_3": ("darts-player-4", None),
    "dart_bullseye": ("darts-bullseye", 2),
    "dart_bull": ("darts-bull", 1.5),
    "dart_t20": ("darts-t20", 1.5),
    "dart_triple": ("darts-triple", 1.5),
    "dart_double": ("darts-double", 1.5),
    "visit_180": ("darts-180", 8),
    "visit_140": ("darts-140", 5),
    "visit_100": ("darts-100", 4),
    "busted": ("darts-bust", 3),
    "high_finish": ("darts-high-finish", 8),
    "game_won": ("darts-leg", 6),
    "match_won": ("darts-match", 12),
    "takeout": ("darts-takeout", None),
    "board_stopped": ("darts-board-stopped", None),
    "calibration": ("darts-calibration", None),
}


def apply_presets(effects: dict[str, Any], rules: dict[str, Any]) -> tuple[list[str], list[str]]:
    """Add missing preset effects and assign them to triggers that have no effect yet.

    Existing effects and rules are never overwritten.  Returns (added effect ids,
    newly assigned triggers).
    """
    added: list[str] = []
    for effect_id, (name, effect) in PRESETS.items():
        if effect_id not in effects:
            effects[effect_id] = {"name": name, "effect": effect, "group": DARTS_GROUP}
            added.append(effect_id)
    assigned: list[str] = []
    for trigger, (effect_id, duration) in PRESET_RULES.items():
        if (rules.get(trigger) or {}).get("effect_id"):
            continue
        rules[trigger] = {"effect_id": effect_id} if duration is None else {"effect_id": effect_id, "duration": duration}
        assigned.append(trigger)
    return added, assigned
