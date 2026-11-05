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


# -- live game summary -----------------------------------------------------------------


def test_game_update_tracks_visit_and_resets():
    game = {}
    assert rules.game_update(game, {"event": "match-started"}) and game == {"event": "match-started", "darts": []}
    for n, (field, value) in enumerate([("t20", "60"), ("s5", "5"), ("s1", "1")], start=1):
        msg = {"event": f"dart{n}-thrown", "player": "Fred", "game": {"pointsLeft": str(501 - 66), "dartNumber": str(n), "fieldName": field, "dartValue": value}}
        assert rules.game_update(game, msg)
    assert game["player"] == "Fred" and [d["field"] for d in game["darts"]] == ["t20", "s5", "s1"]
    rules.game_update(game, {"event": "darts-thrown", "game": {"dartValue": "66"}})
    assert game["visit"] == "66"
    rules.game_update(game, {"event": "dart1-thrown", "game": {"dartNumber": "1", "fieldName": "d20", "dartValue": "40"}})
    assert [d["field"] for d in game["darts"]] == ["d20"]  # a new visit starts fresh
    assert not rules.game_update(game, {"event": "Board Status", "data": {"status": "Takeout Started"}})
    assert rules.game_update(game, {"event": "match-ended"}) and game == {}


# -- caller remote control -------------------------------------------------------------

caller = _load("darts_caller")


def test_caller_options_validate_and_map_to_commands():
    opts = caller.validate_options(
        {"voice": "en-us-sage-female", "language": "4", "every_dart": 2, "bot_actions": 0, "checkout_calls": None, "x": 1}
    )
    assert opts == {"voice": "en-us-sage-female", "language": 4, "every_dart": 2, "bot_actions": False}
    # filters first, then the voice, so the voice is picked from the filtered list
    assert caller.option_commands(opts) == ["language:4", "caller:en-us-sage-female", "arg:e:2", "arg:cba:0"]
    assert caller.option_commands(opts, {"every_dart"}) == ["arg:e:2"]
    for bad in ({"language": 9}, {"every_dart": "x"}, {"voice": "a:b"}, {"voice": "x\nboard-stop"}):
        with pytest.raises(caller.CallerOptionError):
            caller.validate_options(bad)
    assert caller.validate_options("nope") == {}


@pytest.mark.parametrize(
    ("path", "ok"),
    [
        ("%2Fopt%2Fdarts-media%2Fen-US-sage-FEMALE%2Fmatchon%2B1.mp3", True),
        ("%2Fopt%2Fdarts-media%2Fen-US-sage-FEMALE%2F18.WAV", True),
        ("%2Fetc%2Fpasswd", False),
        ("%2Fopt%2Fdarts-media%2F..%2F..%2Fetc%2Fshadow.mp3", False),
        ("%2Fopt%2Fa.mp3%00.txt", False),
        ("", False),
        (None, False),
    ],
)
def test_sound_paths(path, ok):
    assert caller.sound_path_ok(path) is ok


def test_mirror_files_are_normalised():
    files = caller.mirror_files(
        {
            "event": "mirror",
            "files": [
                {"caller": "en-us-sage-female", "path": "%2Fopt%2Fm%2F18.mp3", "wait": False, "volume": 1.0, "mod": True, "skip_if_busy": False},
                {"path": "%2Fetc%2Fpasswd"},
                {"path": "%2Fopt%2Fm%2Fbust.mp3", "wait": 1, "volume": "9"},
                "garbage",
            ],
        }
    )
    assert [f["name"] for f in files] == ["18.mp3", "bust.mp3"]
    assert files[1]["wait"] is True and files[1]["volume"] == 2.0
