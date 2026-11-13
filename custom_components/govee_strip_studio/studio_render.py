"""Light Studio render engine.

Pure, dependency-free functions that turn an effect definition and a strip
geometry into per-position colours for a point in time.

Part of Light Studio, built on teh-hippo/ha-govee-led-ble (MIT).
"""

from __future__ import annotations

from dataclasses import dataclass, field
import math
from typing import Any

RGB = tuple[int, int, int]

EFFECT_TYPES = ("static", "segments", "gradient", "fade", "marquee")
DIRECTIONS = ("forward", "backward", "center_out", "edges_in")
# "ha": Home Assistant sends every frame per segment.  "native": a per-IC pattern is
# uploaded once and the strip animates it itself (smooth, finer, but fewer options).
PLAYBACKS = ("ha", "native")
NATIVE_TYPES = ("static", "segments", "gradient", "marquee")
NATIVE_DIRECTIONS = ("forward", "backward")
BLACK: RGB = (0, 0, 0)


class StudioValidationError(ValueError):
    """An effect or geometry definition is invalid."""


def _rgb(value: Any, label: str) -> RGB:
    if (
        not isinstance(value, (list, tuple))
        or len(value) != 3
        or not all(isinstance(c, int) and not isinstance(c, bool) and 0 <= c <= 255 for c in value)
    ):
        raise StudioValidationError(f"{label} must be three integers from 0 to 255")
    return (value[0], value[1], value[2])


def _int(value: Any, label: str, lo: int, hi: int) -> int:
    if not isinstance(value, int) or isinstance(value, bool) or not lo <= value <= hi:
        raise StudioValidationError(f"{label} must be an integer from {lo} to {hi}")
    return value


@dataclass(frozen=True, slots=True)
class Geometry:
    """Where the visible strip starts and ends, in addressable units from the controller.

    ``first`` and ``last`` are 1-based and inclusive.  ``center`` is a position in
    the same units (may be fractional, e.g. 6.5 is the boundary between 6 and 7).
    ``reverse`` swaps what counts as forward.
    """

    units: int
    first: int = 1
    last: int | None = None
    center: float | None = None
    reverse: bool = False

    def __post_init__(self) -> None:
        _int(self.units, "unit count", 1, 255)
        last = self.units if self.last is None else self.last
        _int(self.first, "first position", 1, self.units)
        _int(last, "last position", 1, self.units)
        if last < self.first:
            raise StudioValidationError("last position must not be before the first position")
        object.__setattr__(self, "last", last)
        if self.center is not None:
            if not isinstance(self.center, (int, float)) or isinstance(self.center, bool):
                raise StudioValidationError("center must be a number")
            if not self.first <= self.center <= last:
                raise StudioValidationError("center must lie between the first and last position")
        if not isinstance(self.reverse, bool):
            raise StudioValidationError("reverse must be true or false")

    @property
    def positions(self) -> list[int]:
        """Visible positions (1-based) in forward order."""
        ordered = list(range(self.first, (self.last or self.units) + 1))
        return ordered[::-1] if self.reverse else ordered

    @property
    def length(self) -> int:
        return (self.last or self.units) - self.first + 1

    @property
    def effective_center(self) -> float:
        if self.center is not None:
            return float(self.center)
        return (self.first + (self.last or self.units)) / 2

    def to_dict(self) -> dict[str, Any]:
        return {
            "units": self.units,
            "first": self.first,
            "last": self.last,
            "center": self.center,
            "reverse": self.reverse,
        }

    @classmethod
    def from_dict(cls, raw: dict[str, Any], units: int) -> Geometry:
        return cls(
            units=units,
            first=raw.get("first", 1),
            last=raw.get("last"),
            center=raw.get("center"),
            reverse=raw.get("reverse", False),
        )

    def rescale(self, units: int) -> Geometry:
        """Map this geometry onto a different addressing resolution (e.g. ICs -> segments)."""
        if units == self.units:
            return self
        factor = self.units / units
        first = max(1, min(units, math.floor((self.first - 1) / factor) + 1))
        last = max(first, min(units, math.ceil((self.last or self.units) / factor)))
        center = None
        if self.center is not None:
            # Map the centre point in continuous space: unit k spans (k-1, k].
            center = (self.center - 0.5) / factor + 0.5
            center = min(max(center, first), last)
        return Geometry(units=units, first=first, last=last, center=center, reverse=self.reverse)


@dataclass(frozen=True, slots=True)
class Effect:
    type: str
    colors: tuple[RGB, ...] = ((255, 255, 255),)
    segments: tuple[RGB | None, ...] = ()
    direction: str = "forward"
    speed: int = 50
    block: int = 1
    gap: int = 0
    spread: int = 0
    brightness: int = 100
    background: RGB = BLACK
    # Per-segment brightness in percent, parallel to ``segments`` (missing = 100).
    levels: tuple[int, ...] = ()
    # Marquee: how far each block dims from its head to its tail, in percent.
    tail: int = 0
    playback: str = "ha"
    extra: dict[str, Any] = field(default_factory=dict)

    def __post_init__(self) -> None:
        if self.type not in EFFECT_TYPES:
            raise StudioValidationError(f"unknown effect type {self.type!r}")
        if self.direction not in DIRECTIONS:
            raise StudioValidationError(f"unknown direction {self.direction!r}")
        if not 1 <= len(self.colors) <= 8:
            raise StudioValidationError("an effect needs 1 to 8 colours")
        object.__setattr__(self, "colors", tuple(_rgb(c, "colour") for c in self.colors))
        object.__setattr__(
            self,
            "segments",
            tuple(None if c is None else _rgb(c, "segment colour") for c in self.segments),
        )
        _int(self.speed, "speed", 0, 100)
        _int(self.block, "block length", 1, 30)
        _int(self.gap, "gap length", 0, 30)
        _int(self.spread, "spread", 0, 100)
        _int(self.brightness, "brightness", 1, 100)
        object.__setattr__(self, "background", _rgb(self.background, "background"))
        object.__setattr__(self, "levels", tuple(_int(v, "segment brightness", 1, 100) for v in self.levels))
        _int(self.tail, "tail", 0, 100)
        if self.playback not in PLAYBACKS:
            raise StudioValidationError(f"unknown playback {self.playback!r}")
        if self.playback == "native":
            if self.type not in NATIVE_TYPES:
                raise StudioValidationError("this effect type cannot be played by the strip itself")
            if self.type == "marquee" and self.direction not in NATIVE_DIRECTIONS:
                raise StudioValidationError("the strip itself can only move away from or towards the controller")
        if self.type == "segments" and not self.segments:
            raise StudioValidationError("a segmented effect needs segment colours")

    @property
    def animated(self) -> bool:
        if self.type in ("static", "segments"):
            return False
        if self.type == "gradient":
            return self.speed > 0
        return self.speed > 0

    def to_dict(self) -> dict[str, Any]:
        return {
            "type": self.type,
            "colors": [list(c) for c in self.colors],
            "segments": [None if c is None else list(c) for c in self.segments],
            "direction": self.direction,
            "speed": self.speed,
            "block": self.block,
            "gap": self.gap,
            "spread": self.spread,
            "brightness": self.brightness,
            "background": list(self.background),
            "levels": list(self.levels),
            "tail": self.tail,
            "playback": self.playback,
        }

    @classmethod
    def from_dict(cls, raw: dict[str, Any]) -> Effect:
        if not isinstance(raw, dict):
            raise StudioValidationError("effect must be an object")
        known = {
            "type", "colors", "segments", "direction", "speed", "block", "gap",
            "spread", "brightness", "background", "levels", "tail", "playback",
        }
        kwargs: dict[str, Any] = {k: raw[k] for k in known if k in raw}
        if "colors" in kwargs:
            kwargs["colors"] = tuple(tuple(c) if isinstance(c, list) else c for c in kwargs["colors"])
        if "segments" in kwargs:
            kwargs["segments"] = tuple(
                None if c is None else (tuple(c) if isinstance(c, list) else c) for c in kwargs["segments"]
            )
        if "levels" in kwargs:
            if not isinstance(kwargs["levels"], (list, tuple)):
                raise StudioValidationError("segment brightness must be a list")
            kwargs["levels"] = tuple(kwargs["levels"])
        if "background" in kwargs and isinstance(kwargs["background"], list):
            kwargs["background"] = tuple(kwargs["background"])
        if "type" not in kwargs:
            raise StudioValidationError("effect type is required")
        return cls(**kwargs)


def _lerp(a: RGB, b: RGB, t: float) -> RGB:
    return (
        round(a[0] + (b[0] - a[0]) * t),
        round(a[1] + (b[1] - a[1]) * t),
        round(a[2] + (b[2] - a[2]) * t),
    )


def _palette_smooth(colors: tuple[RGB, ...], x: float, *, cyclic: bool) -> RGB:
    """Sample a palette smoothly.  ``x`` in palette-units (0..n for cyclic, 0..n-1 otherwise)."""
    n = len(colors)
    if n == 1:
        return colors[0]
    if cyclic:
        x %= n
        i = int(math.floor(x)) % n
        return _lerp(colors[i], colors[(i + 1) % n], x - math.floor(x))
    x = min(max(x, 0.0), n - 1)
    i = min(int(math.floor(x)), n - 2)
    return _lerp(colors[i], colors[i + 1], x - i)


def _dim(color: RGB, f: float) -> RGB:
    return (round(color[0] * f), round(color[1] * f), round(color[2] * f))


def _scale(color: RGB, brightness: int) -> RGB:
    if brightness >= 100:
        return color
    return _dim(color, brightness / 100)


def speed_to_units_per_second(speed: int) -> float:
    """Map a 0..100 UI speed onto movement in positions per second (0.25 .. 8, exponential)."""
    if speed <= 0:
        return 0.0
    return 0.25 * (32 ** ((speed - 1) / 99))


def direction_coordinates(geometry: Geometry, direction: str) -> list[float]:
    """Return a travel coordinate for each visible position, in forward order.

    Content moves towards increasing coordinates over time.
    """
    positions = geometry.positions
    center = geometry.effective_center
    if direction == "forward":
        return [float(i) for i in range(len(positions))]
    if direction == "backward":
        n = len(positions)
        return [float(n - 1 - i) for i in range(n)]
    distances = [abs(p - center) for p in positions]
    if direction == "center_out":
        return distances
    furthest = max(distances) if distances else 0.0
    return [furthest - d for d in distances]  # edges_in


def render(effect: Effect, geometry: Geometry, t: float) -> dict[int, RGB]:
    """Colour for each visible position (1-based physical index) at time ``t`` seconds."""
    positions = geometry.positions
    n = len(positions)
    if n == 0:
        return {}
    if effect.type == "static":
        frame = [effect.colors[0]] * n
    elif effect.type == "segments":
        source = list(effect.segments)
        levels = effect.levels
        frame = [
            _scale(source[i], levels[i] if i < len(levels) else 100)
            if i < len(source) and source[i] is not None
            else effect.background
            for i in range(n)
        ]
    else:
        coords = direction_coordinates(geometry, effect.direction)
        offset = speed_to_units_per_second(effect.speed) * t
        frame = []
        if effect.type == "gradient":
            span = max(max(coords) - min(coords), 1.0)
            cyclic = effect.speed > 0
            for c in coords:
                if cyclic:
                    x = (c - offset) / span * len(effect.colors)
                else:
                    x = (c - min(coords)) / span * (len(effect.colors) - 1)
                frame.append(_palette_smooth(effect.colors, x, cyclic=cyclic))
        elif effect.type == "fade":
            # Whole-strip colour cycle; ``spread`` turns it into a travelling wave.
            seconds_per_colour = max(0.4, 6.0 / max(speed_to_units_per_second(effect.speed), 0.01))
            spread = effect.spread / 100 * len(effect.colors)
            span = max(max(coords) - min(coords), 1.0)
            for c in coords:
                phase = t / seconds_per_colour - (c / span) * spread
                frame.append(_palette_smooth(effect.colors, phase, cyclic=True))
        else:  # marquee
            period = effect.block + effect.gap
            ncol = len(effect.colors)
            step = math.floor(offset + 1e-9)  # marquee moves in whole-position steps
            for c in coords:
                slot = math.floor(c + 1e-9) - step
                within = slot % period
                if within >= effect.block:
                    frame.append(effect.background)
                else:
                    color = effect.colors[(slot // period) % ncol]
                    if effect.tail and effect.block > 1:
                        # The head (largest coordinate, leading the motion) is brightest.
                        color = _dim(color, 1 - effect.tail / 100 * (effect.block - 1 - within) / effect.block)
                    frame.append(color)
    return {positions[i]: _scale(frame[i], effect.brightness) for i in range(n)}


def quantize(color: RGB, step: int = 4) -> RGB:
    """Snap a colour onto a coarse grid so near-identical colours share one BLE write."""
    if step <= 1:
        return color
    return tuple(min(255, round(c / step) * step) for c in color)  # type: ignore[return-value]


def frame_writes(
    frame: dict[int, RGB],
    previous: dict[int, RGB] | None,
    *,
    step: int = 4,
) -> list[tuple[list[int], RGB]]:
    """Group the positions that changed by colour: one entry per required write."""
    groups: dict[RGB, list[int]] = {}
    for pos, color in frame.items():
        q = quantize(color, step)
        if previous is not None and previous.get(pos) == q:
            continue
        groups.setdefault(q, []).append(pos)
    # Largest groups first so the strip converges visibly as early as possible.
    return sorted(((sorted(p), c) for c, p in groups.items()), key=lambda g: -len(g[0]))


def quantized_frame(frame: dict[int, RGB], step: int = 4) -> dict[int, RGB]:
    return {pos: quantize(color, step) for pos, color in frame.items()}


# -- native playback ----------------------------------------------------------------
# Measured on an H617C: firmware speed 50 moves ~2.4 ICs/s, 85 moves ~8 ICs/s.


def native_ics_per_second(speed: int) -> float:
    """Approximate movement of the strip's own animation, for labels and the preview."""
    return 0.0 if speed <= 0 else 2.4 * 1.035 ** (speed - 50)


def native_period(block: int, gap: int, ring: int) -> int:
    """Smallest pattern period >= block + gap that divides the ring.

    The strip rotates its pattern over every IC, including cut-off ones, so only a
    period that divides the IC count wraps around without a visible seam.
    """
    period = min(block + gap, ring)
    while ring % period:
        period += 1
    return period


@dataclass(frozen=True, slots=True)
class NativePattern:
    effect: str  # firmware painted effect: clockwise | counter_clockwise | gradient
    speed: int
    colors: tuple[RGB | None, ...]  # one per physical IC from the controller; None = dark


def native_pattern(effect: Effect, geometry: Geometry) -> NativePattern:
    """Per-IC pattern for ``effect`` on ``geometry`` (in physical ICs).

    ``segments``/``levels`` are per visible IC in native mode.  Overall brightness is
    not baked in; it travels as the firmware brightness field.
    """
    ring = geometry.units
    colors: list[RGB | None] = [None] * ring
    visible = geometry.positions
    if effect.type == "static":
        for p in visible:
            colors[p - 1] = effect.colors[0]
        return NativePattern("clockwise", 0, tuple(colors))
    if effect.type == "segments":
        for i, p in enumerate(visible):
            if i < len(effect.segments) and effect.segments[i] is not None:
                level = effect.levels[i] if i < len(effect.levels) else 100
                colors[p - 1] = _scale(effect.segments[i], level)
        return NativePattern("clockwise", 0, tuple(colors))
    if effect.type == "gradient":
        n = len(effect.colors)
        if effect.speed == 0:
            span = max(len(visible) - 1, 1)
            for i, p in enumerate(visible):
                colors[p - 1] = _palette_smooth(effect.colors, i / span * (n - 1), cyclic=False)
            return NativePattern("clockwise", 0, tuple(colors))
        # Cyclic over the whole ring so the firmware's own blending has no seam.
        for j in range(ring):
            colors[j] = _palette_smooth(effect.colors, j / ring * n, cyclic=True)
        return NativePattern("gradient", effect.speed, tuple(colors))
    # marquee: the head of each block leads the motion.
    away = (effect.direction == "forward") != geometry.reverse
    period = native_period(effect.block, effect.gap, ring)
    ncol = len(effect.colors)
    for j in range(ring):
        c = j if away else ring - 1 - j
        within = c % period
        if within >= effect.block:
            colors[j] = None if effect.background == BLACK else effect.background
            continue
        color = effect.colors[(c // period) % ncol]
        if effect.tail and effect.block > 1:
            color = _dim(color, 1 - effect.tail / 100 * (effect.block - 1 - within) / effect.block)
        colors[j] = color
    if effect.speed == 0:
        return NativePattern("clockwise", 0, tuple(colors))
    return NativePattern("clockwise" if away else "counter_clockwise", effect.speed, tuple(colors))
