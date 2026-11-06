"""Tests for choreo validation and the panel's choreo constants, without Home Assistant."""

from __future__ import annotations

import importlib.util
from pathlib import Path
import re
import sys

import pytest

COMPONENT = Path(__file__).resolve().parent.parent / "custom_components" / "govee_strip_studio"


def _load(name: str):
    spec = importlib.util.spec_from_file_location(name, COMPONENT / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


choreo = _load("studio_choreo")
EFFECTS = frozenset({"a", "b"})


def test_valid_choreo_is_normalised():
    raw = {"name": "  Game on ", "end": "loop", "steps": [{"effect_id": "a", "seconds": "12.34"}, {"effect_id": "b", "seconds": 5}]}
    assert choreo.validate_choreo(raw, EFFECTS) == {
        "name": "Game on",
        "steps": [{"effect_id": "a", "seconds": 12.3}, {"effect_id": "b", "seconds": 5.0}],
        "end": "loop",
    }


def test_end_defaults_to_keep():
    assert choreo.validate_choreo({"name": "x", "steps": [{"effect_id": "a", "seconds": 1}]}, EFFECTS)["end"] == "keep"


@pytest.mark.parametrize(
    "raw",
    [
        None,
        {"name": "", "steps": [{"effect_id": "a", "seconds": 1}]},
        {"name": "x" * 41, "steps": [{"effect_id": "a", "seconds": 1}]},
        {"name": "x", "steps": []},
        {"name": "x", "steps": [{"effect_id": "zzz", "seconds": 1}]},
        {"name": "x", "steps": [{"effect_id": "a", "seconds": 0.1}]},
        {"name": "x", "steps": [{"effect_id": "a", "seconds": 4000}]},
        {"name": "x", "steps": [{"effect_id": "a", "seconds": "lang"}]},
        {"name": "x", "steps": [{"effect_id": "a", "seconds": 1}], "end": "explode"},
        {"name": "x", "steps": [{"effect_id": "a", "seconds": 1}] * (choreo.MAX_STEPS + 1)},
    ],
)
def test_invalid_choreos_are_rejected(raw):
    with pytest.raises(choreo.ChoreoError):
        choreo.validate_choreo(raw, EFFECTS)


def test_panel_knows_the_same_end_actions():
    panel = (COMPONENT / "studio_frontend" / "panel.js").read_text(encoding="utf-8")
    block = panel[panel.index("const CHOREO_ENDS") : panel.index("];", panel.index("const CHOREO_ENDS"))]
    assert set(re.findall(r'id: "(\w+)"', block)) == set(choreo.END_ACTIONS)
