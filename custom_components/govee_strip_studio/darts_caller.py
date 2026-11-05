"""Remote control of darts-caller's voice and announcements (pure, no Home Assistant).

darts-caller's own web UI changes the caller by sending plain text messages over its
Socket.IO channel; this module maps Strip Studio's stored options onto exactly those
messages and validates the sound paths that darts-caller asks clients to play.

    caller:<name>   language:<0-7>   gender:<0-2>   fav:<0|1>
    arg:e:<0-3>     arg:ccp:<0-2>    arg:cba:<0|1>  arg:pcc:<0-100>  arg:pccyo:<0|1>
    board-start  board-stop  board-calibrate  board-reset  next  call:hi

darts-caller does not report the current argument values back, so the options the
user set here are stored and sent again whenever the connection (re)starts: a restarted
caller would otherwise fall back to its command-line defaults.

Part of Govee Strip Studio, built on teh-hippo/ha-govee-led-ble (MIT).
"""

from __future__ import annotations

from typing import Any
from urllib.parse import unquote

# option -> (command template, kind, min, max)
OPTIONS: dict[str, tuple[str, str, int, int]] = {
    "voice": ("caller:{}", "str", 0, 0),
    "language": ("language:{}", "int", 0, 7),
    "gender": ("gender:{}", "int", 0, 2),
    "every_dart": ("arg:e:{}", "int", 0, 3),
    "call_player": ("arg:ccp:{}", "int", 0, 2),
    "bot_actions": ("arg:cba:{}", "bool", 0, 1),
    "checkout_calls": ("arg:pcc:{}", "int", 0, 100),
    "checkout_self": ("arg:pccyo:{}", "bool", 0, 1),
}

COMMANDS = frozenset({"board-start", "board-stop", "board-calibrate", "board-reset", "next", "call:hi", "fav:0", "fav:1"})

SOUND_SUFFIXES = (".mp3", ".wav", ".ogg", ".m4a")


class CallerOptionError(ValueError):
    """An option value the panel sent is not valid."""


def validate_options(raw: Any) -> dict[str, Any]:
    """Keep known options with sane values; ``None`` (or missing) means "not set by the user"."""
    if not isinstance(raw, dict):
        return {}
    out: dict[str, Any] = {}
    for key, (_template, kind, low, high) in OPTIONS.items():
        value = raw.get(key)
        if value is None or value == "":
            continue
        if kind == "str":
            text = str(value).strip()
            # darts-caller treats ":" and newlines as separators of its text commands.
            if not text or len(text) > 80 or any(c in text for c in ":\n\r"):
                raise CallerOptionError(f"invalid {key}")
            out[key] = text
        elif kind == "bool":
            out[key] = bool(value)
        else:
            try:
                number = int(value)
            except (TypeError, ValueError) as err:
                raise CallerOptionError(f"{key} must be a number") from err
            if not low <= number <= high:
                raise CallerOptionError(f"{key} must be between {low} and {high}")
            out[key] = number
    return out


def option_commands(options: dict[str, Any], only: set[str] | None = None) -> list[str]:
    """darts-caller messages that apply ``options``; filters (language, gender) before the voice."""
    commands = []
    for key in ("language", "gender", "voice", "every_dart", "call_player", "bot_actions", "checkout_calls", "checkout_self"):
        if key not in options or (only is not None and key not in only):
            continue
        value = options[key]
        template = OPTIONS[key][0]
        commands.append(template.format(int(value) if isinstance(value, bool) else value))
    return commands


def sound_path_ok(encoded: str) -> bool:
    """A path from a darts-caller ``mirror`` event that may be fetched from its /sounds/ route.

    The paths are URL-encoded absolute file paths (``%2Fopt%2Fdarts-media%2F…%2F18.mp3``).
    Only audio files are passed through, never anything with a parent-directory step.
    """
    if not isinstance(encoded, str) or not encoded or len(encoded) > 1024:
        return False
    path = unquote(encoded)
    if "\x00" in path or ".." in path.replace("\\", "/").split("/"):
        return False
    return path.lower().endswith(SOUND_SUFFIXES)


def mirror_files(payload: dict[str, Any]) -> list[dict[str, Any]]:
    """The playable files of a ``mirror`` event, normalised for the browser."""
    files = []
    for item in payload.get("files") or []:
        if not isinstance(item, dict) or not sound_path_ok(item.get("path")):
            continue
        try:
            volume = max(0.0, min(2.0, float(item.get("volume", 1.0))))
        except (TypeError, ValueError):
            volume = 1.0
        name = unquote(item["path"]).rsplit("/", 1)[-1]
        files.append(
            {
                "path": item["path"],
                "name": name,
                "caller": str(item.get("caller") or ""),
                "wait": bool(item.get("wait")),
                "skip_if_busy": bool(item.get("skip_if_busy")),
                "volume": volume,
            }
        )
    return files
