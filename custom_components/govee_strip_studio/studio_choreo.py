"""Choreographies: saved effects played one after another (pure, no Home Assistant).

A choreo is ``{"name", "steps": [{"effect_id", "seconds"}], "end"}``.  Steps refer to
saved effects by id, so renaming an effect keeps its choreos intact; a step whose
effect was deleted later is skipped while playing.

``end`` says what happens after the last step:
    keep  the last effect keeps running      stop  the strip keeps its last frame
    off   the light is switched off          loop  start again with the first step

Part of Light Studio, built on teh-hippo/ha-govee-led-ble (MIT).
"""

from __future__ import annotations

from typing import Any

END_ACTIONS = ("keep", "stop", "off", "loop")
MIN_SECONDS = 0.5
MAX_SECONDS = 3600.0
MAX_STEPS = 50
MAX_NAME = 40


class ChoreoError(ValueError):
    """A choreo the panel sent is not valid."""


def validate_choreo(raw: Any, effect_ids: set[str] | frozenset[str]) -> dict[str, Any]:
    """Normalised choreo; every step must name one of ``effect_ids``."""
    if not isinstance(raw, dict):
        raise ChoreoError("choreo must be an object")
    name = str(raw.get("name") or "").strip()
    if not name or len(name) > MAX_NAME:
        raise ChoreoError(f"name must have 1 to {MAX_NAME} characters")
    end = raw.get("end", "keep")
    if end not in END_ACTIONS:
        raise ChoreoError(f"end must be one of {', '.join(END_ACTIONS)}")
    steps_raw = raw.get("steps")
    if not isinstance(steps_raw, list) or not steps_raw:
        raise ChoreoError("a choreo needs at least one step")
    if len(steps_raw) > MAX_STEPS:
        raise ChoreoError(f"a choreo has at most {MAX_STEPS} steps")
    steps = []
    for number, step in enumerate(steps_raw, 1):
        if not isinstance(step, dict) or step.get("effect_id") not in effect_ids:
            raise ChoreoError(f"step {number}: unknown effect")
        try:
            seconds = float(step.get("seconds"))
        except (TypeError, ValueError) as err:
            raise ChoreoError(f"step {number}: seconds must be a number") from err
        if not MIN_SECONDS <= seconds <= MAX_SECONDS:
            raise ChoreoError(f"step {number}: seconds must be between {MIN_SECONDS:g} and {MAX_SECONDS:g}")
        steps.append({"effect_id": step["effect_id"], "seconds": round(seconds, 1)})
    return {"name": name, "steps": steps, "end": end}
