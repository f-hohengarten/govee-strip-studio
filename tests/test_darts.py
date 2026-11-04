"""Tests for the darts rules and presets, without Home Assistant (feed: test_darts_feed.py)."""

from __future__ import annotations

import importlib.util
from pathlib import Path
import sys

import pytest

COMPONENT = Path(__file__).resolve().parent.parent / "custom_components" / "govee_strip_studio"


def _load(name: str):
    spec = importlib.util.spec_from_file_location(name, COMPONENT / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


rules = _load("darts_rules")


def dart(value, field=None, mult=None, event="dart1-thrown", player="0"):
    game = {"mode": "X01", "dartValue": str(value)}
    if field is not None:
        game["fieldName"] = field
    if mult is not None:
        game["fieldMultiplier"] = mult
    return {"event": event, "playerIndex": player, "game": game}


@pytest.mark.parametrize(
    ("msg", "candidates"),
    [
        (dart(60, "t20", 3), ("dart_t20", "dart_triple")),
        (dart(57, "t19", 3), ("dart_triple",)),
        (dart(40, "d20", 2), ("dart_double",)),
        (dart(50, "d25", 2), ("dart_bullseye", "dart_bull")),
        (dart(25, "s25", 1), ("dart_bull",)),
        (dart(0, "m5", 0), ("dart_miss",)),
        (dart(20, "s20", 1), ()),
        (dart(60), ("dart_t20", "dart_triple")),  # no field info: one dart scores 60 only as T20
        (dart(50), ("dart_bullseye", "dart_bull")),
        (dart(0), ("dart_miss",)),
        (dart(40), ()),  # D20 or ... unknown without field info: no guess
    ],
)
def test_single_dart_candidates(msg, candidates):
    reaction = rules.react(msg)
    assert reaction.kind == "trigger" and reaction.candidates == candidates and reaction.player == "0"


@pytest.mark.parametrize(
    ("score", "first"),
    [(180, "visit_180"), (171, "visit_140"), (100, "visit_100"), (85, "visit_60"), (59, None), (0, "visit_0")],
)
def test_visit_scores(score, first):
    reaction = rules.react({"event": "darts-thrown", "playerIndex": "1", "game": {"dartValue": str(score)}})
    assert (reaction.candidates[0] if reaction.candidates else None) == first


def test_visit_falls_back_to_lower_bands_when_not_configured():
    rule = {"effect_id": "abc", "duration": 4}
    picked = rules.pick({"visit_100": rule}, rules.react({"event": "darts-thrown", "game": {"dartValue": "180"}}).candidates)
    assert picked == ("visit_100", rule)


def test_wins_and_high_finish():
    won = rules.react({"event": "game-won", "playerIndex": "0", "game": {"dartsThrownValue": "120"}})
    assert won.candidates == ("high_finish", "game_won")
    match = rules.react({"event": "match-won", "game": {"dartsThrownValue": "40"}})
    assert match.candidates == ("match_won", "game_won")


def test_board_status_and_turn_changes():
    assert rules.react({"event": "Board Status", "data": {"status": "Takeout Started"}}).candidates == ("takeout",)
    assert rules.react({"event": "Board Status", "data": {"status": "Takeout Finished"}}).kind == "idle"
    pulled = rules.react({"event": "darts-pulled", "playerIndex": "2", "player": "Fred"})
    assert pulled.kind == "idle" and pulled.player == "2"
    assert rules.idle_candidates("2") == ("player_2", "idle")
    assert rules.idle_candidates(None) == ("idle",)
    assert rules.react({"event": "lobby", "action": "player-joined"}).kind == "none"
    assert rules.react("garbage").kind == "none"


def test_durations():
    assert rules.duration_of("takeout", {"effect_id": "x", "duration": 5}) is None
    assert rules.duration_of("visit_180", {"effect_id": "x", "duration": 7}) == 7
    assert rules.duration_of("visit_180", {"effect_id": "x"}) == rules.DEFAULT_DURATION
    assert rules.duration_of("visit_180", {"effect_id": "x", "duration": 999}) == 60


def test_trigger_ids_are_unique():
    assert len(rules.TRIGGERS) == len(set(rules.TRIGGERS))


# -- presets ---------------------------------------------------------------------------

render = _load("studio_render")
presets = _load("darts_presets")


def test_every_preset_is_a_valid_effect_and_native_ones_loop_seamlessly():
    geometry = render.Geometry(units=30, first=1, last=24)  # the user's cut strip
    for effect_id, (name, raw) in presets.PRESETS.items():
        effect = render.Effect.from_dict(raw)
        assert name.startswith("Darts · "), effect_id
        if effect.playback == "native":
            pattern = render.native_pattern(effect, geometry)
            assert len(pattern.colors) == 30 and pattern.speed == effect.speed
            if effect.type == "marquee":
                assert render.native_period(effect.block, effect.gap, 30) == effect.block + effect.gap, effect_id
        else:
            assert render.render(effect, geometry.rescale(15), 0.7), effect_id


def test_preset_rules_point_at_real_triggers_and_presets():
    for trigger, (effect_id, duration) in presets.PRESET_RULES.items():
        assert trigger in rules.TRIGGERS and effect_id in presets.PRESETS
        assert (duration is None) == (trigger in rules.STATE_TRIGGERS), trigger
        if duration is not None:
            assert rules.duration_of(trigger, {"effect_id": effect_id, "duration": duration}) == duration


def test_apply_presets_fills_gaps_only_and_is_idempotent():
    effects = {"mine": {"name": "Mein 180", "effect": {"type": "static"}}}
    darts_rules = {"visit_180": {"effect_id": "mine", "duration": 9}}
    added, assigned = presets.apply_presets(effects, darts_rules)
    assert set(added) == set(presets.PRESETS) and "visit_180" not in assigned
    assert darts_rules["visit_180"] == {"effect_id": "mine", "duration": 9}  # user's choice kept
    assert darts_rules["busted"] == {"effect_id": "darts-bust", "duration": 3}
    assert darts_rules["takeout"] == {"effect_id": "darts-takeout"}
    assert presets.apply_presets(effects, darts_rules) == ([], [])
    assert all(effects[i]["group"] == presets.DARTS_GROUP for i in presets.PRESETS) and "group" not in effects["mine"]
