"""Tests for the pure Strip Studio render engine.

Runs without Home Assistant: studio_render.py is loaded straight from its file so the
package __init__ (which imports Home Assistant) is never executed.

    python3 -m pytest tests/        # or: python3 tests/test_studio_render.py
"""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path
import shutil
import subprocess
import sys

import pytest

ROOT = Path(__file__).resolve().parent.parent
COMPONENT = ROOT / "custom_components" / "govee_strip_studio"
_spec = importlib.util.spec_from_file_location("studio_render", COMPONENT / "studio_render.py")
sr = importlib.util.module_from_spec(_spec)
sys.modules["studio_render"] = sr
_spec.loader.exec_module(sr)

R, G, B, K = (255, 0, 0), (0, 255, 0), (0, 0, 255), (0, 0, 0)
# The user's strip: H617C, 30 ICs / 15 segments, cut after IC 24 (= 12 segments).
USER_GEOMETRY = sr.Geometry(units=30, first=1, last=24)


def letters(frame):
    names = {R: "R", G: "G", B: "B", K: "."}
    return "".join(names.get(frame[p], "?") for p in sorted(frame))


def test_user_geometry_maps_to_twelve_segments_centre_between_6_and_7():
    seg = USER_GEOMETRY.rescale(15)
    assert (seg.first, seg.last) == (1, 12)
    assert seg.effective_center == 6.5
    assert USER_GEOMETRY.effective_center == 12.5


def test_marquee_center_out_moves_outwards_symmetrically():
    seg = USER_GEOMETRY.rescale(15)
    effect = sr.Effect(type="marquee", colors=(R,), block=1, gap=2, speed=1, direction="center_out")
    assert letters(sr.render(effect, seg, 0)) == "..R..RR..R.."
    assert letters(sr.render(effect, seg, 4)) == ".R..R..R..R."  # speed 1 = 0.25 seg/s -> 1 step


def test_marquee_edges_in_is_the_reverse_of_center_out():
    seg = USER_GEOMETRY.rescale(15)
    effect = sr.Effect(type="marquee", colors=(R,), block=1, gap=2, speed=1, direction="edges_in")
    assert letters(sr.render(effect, seg, 0)) == "R..R....R..R"


def test_marquee_forward_and_backward():
    seg = USER_GEOMETRY.rescale(15)
    forward = sr.Effect(type="marquee", colors=(R, G, B), block=2, speed=1, direction="forward")
    assert letters(sr.render(forward, seg, 0)) == "RRGGBBRRGGBB"
    assert letters(sr.render(forward, seg, 4)) == "BRRGGBBRRGGB"
    backward = sr.Effect(type="marquee", colors=(R, G, B), block=2, speed=1, direction="backward")
    assert letters(sr.render(backward, seg, 0)) == "BBGGRRBBGGRR"


def test_reverse_flips_forward():
    seg = sr.Geometry(units=30, first=1, last=24, reverse=True).rescale(15)
    forward = sr.Effect(type="marquee", colors=(R, G, B), block=2, speed=1, direction="forward")
    assert letters(sr.render(forward, seg, 0)) == "BBGGRRBBGGRR"


def test_explicit_centre_is_respected():
    seg = sr.Geometry(units=30, first=1, last=24, center=8.5).rescale(15)
    assert seg.effective_center == pytest.approx(4.5)
    effect = sr.Effect(type="marquee", colors=(R,), block=1, gap=3, speed=1, direction="center_out")
    frame = sr.render(effect, seg, 0)
    assert frame[4] == R and frame[5] == R  # both neighbours of the centre light first


def test_static_gradient_spans_first_to_last_colour():
    seg = USER_GEOMETRY.rescale(15)
    frame = sr.render(sr.Effect(type="gradient", colors=(R, B), speed=0), seg, 0)
    assert frame[1] == R and frame[12] == B


def test_fade_without_spread_is_uniform():
    seg = USER_GEOMETRY.rescale(15)
    frame = sr.render(sr.Effect(type="fade", colors=(R, B), speed=50), seg, 1.0)
    assert len(set(frame.values())) == 1


def test_brightness_scales_colours():
    seg = USER_GEOMETRY.rescale(15)
    frame = sr.render(sr.Effect(type="static", colors=((200, 100, 50),), brightness=50), seg, 0)
    assert frame[1] == (100, 50, 25)


def test_frame_writes_only_sends_changes_and_groups_by_colour():
    seg = USER_GEOMETRY.rescale(15)
    effect = sr.Effect(type="marquee", colors=(R, G, B), block=2, speed=1, direction="forward")
    first = sr.render(effect, seg, 0)
    writes = sr.frame_writes(first, None)
    assert sorted(len(s) for s, _ in writes) == [4, 4, 4]
    previous = sr.quantized_frame(first)
    assert sr.frame_writes(sr.render(effect, seg, 0.1), previous) == []


def test_effect_roundtrip_and_validation():
    effect = sr.Effect(type="marquee", colors=(R, B), direction="edges_in", speed=40, block=2, gap=1)
    assert sr.Effect.from_dict(json.loads(json.dumps(effect.to_dict()))) == effect
    with pytest.raises(sr.StudioValidationError):
        sr.Effect(type="sparkle")
    with pytest.raises(sr.StudioValidationError):
        sr.Geometry(units=30, first=10, last=5)
    with pytest.raises(sr.StudioValidationError):
        sr.Geometry(units=30, first=1, last=24, center=25)


@pytest.mark.skipif(shutil.which("node") is None, reason="node not installed")
def test_panel_preview_matches_python_renderer(tmp_path):
    """panel.js mirrors studio_render.py; the on-screen preview must equal what the strip gets."""
    src = (COMPONENT / "studio_frontend" / "panel.js").read_text(encoding="utf-8")
    engine = src.split("// ---------- helpers ----------")[0]
    module = tmp_path / "engine.mjs"
    module.write_text(engine + "\nexport { render, rescale };\n", encoding="utf-8")
    cases = []
    for direction in sr.DIRECTIONS:
        for kind in ("gradient", "fade", "marquee"):
            for t in (0.0, 1.3, 4.7, 11.0):
                cases.append({"type": kind, "direction": direction, "t": t})
    script = tmp_path / "run.mjs"
    script.write_text(
        f"""
import {{ render, rescale }} from {json.dumps(module.as_uri())};
const cases = {json.dumps(cases)};
const g = rescale({{units:30, first:1, last:24, center:null, reverse:false}}, 15);
const out = cases.map(c => render({{type:c.type, colors:[[255,0,0],[0,0,255],[0,255,0]], segments:[], direction:c.direction,
  speed:37, block:2, gap:1, spread:30, brightness:80, background:[0,0,0]}}, g, c.t));
console.log(JSON.stringify(out));
""",
        encoding="utf-8",
    )
    js = json.loads(subprocess.run(["node", str(script)], check=True, capture_output=True, text=True).stdout)
    seg = USER_GEOMETRY.rescale(15)
    for case, js_frame in zip(cases, js):
        effect = sr.Effect(
            type=case["type"], colors=(R, B, G), direction=case["direction"],
            speed=37, block=2, gap=1, spread=30, brightness=80,
        )
        py_frame = sr.render(effect, seg, case["t"])
        for pos, colour in py_frame.items():
            assert max(abs(a - b) for a, b in zip(colour, js_frame[str(pos)])) <= 1, (case, pos)


if __name__ == "__main__":
    sys.exit(pytest.main([__file__, "-q"]))
