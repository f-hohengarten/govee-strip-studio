// Govee Strip Studio panel. Built on teh-hippo/ha-govee-led-ble (MIT).
const DOMAIN = "govee_strip_studio";
const WS = `${DOMAIN}/studio`;

const TYPES = [
  { id: "static", label: "Statisch", icon: "mdi:checkbox-blank" },
  { id: "segments", label: "Segmente", icon: "mdi:view-week" },
  { id: "gradient", label: "Verlauf", icon: "mdi:gradient-horizontal" },
  { id: "fade", label: "Fade", icon: "mdi:transition" },
  { id: "marquee", label: "Marquee", icon: "mdi:dots-horizontal" },
];
const DIRECTIONS = [
  { id: "forward", label: "Vom Controller weg", glyph: "→" },
  { id: "backward", label: "Zum Controller hin", glyph: "←" },
  { id: "center_out", label: "Aus der Mitte", glyph: "↔" },
  { id: "edges_in", label: "Von den Seiten", glyph: "→←" },
];
const PRESET_COLORS = ["#ff3b30", "#ff9500", "#ffcc00", "#34c759", "#00c7be", "#0a84ff", "#5e5ce6", "#ff2d55", "#ffffff"];
const TOOLS = [
  { id: "color", label: "Farbe" },
  { id: "off", label: "Aus" },
  { id: "level", label: "Nur Helligkeit" },
];

// ---------- render engine (mirror of studio_render.py) ----------
const speedToUnits = (s) => (s <= 0 ? 0 : 0.25 * Math.pow(32, (s - 1) / 99));
const dim = (c, f) => c.map((v) => Math.round(v * f));
const scale = (c, pct) => (pct >= 100 ? c : dim(c, pct / 100));
const lerp = (a, b, t) => [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t));
function paletteSmooth(colors, x, cyclic) {
  const n = colors.length;
  if (n === 1) return colors[0];
  if (cyclic) {
    x = ((x % n) + n) % n;
    const i = Math.floor(x) % n;
    return lerp(colors[i], colors[(i + 1) % n], x - Math.floor(x));
  }
  x = Math.min(Math.max(x, 0), n - 1);
  const i = Math.min(Math.floor(x), n - 2);
  return lerp(colors[i], colors[i + 1], x - i);
}
function rescale(g, units) {
  if (units === g.units) return { ...g };
  const f = g.units / units;
  const first = Math.max(1, Math.min(units, Math.floor((g.first - 1) / f) + 1));
  const last = Math.max(first, Math.min(units, Math.ceil(g.last / f)));
  let center = null;
  if (g.center !== null && g.center !== undefined) center = Math.min(Math.max((g.center - 0.5) / f + 0.5, first), last);
  return { units, first, last, center, reverse: g.reverse };
}
function positions(g) {
  const out = [];
  for (let p = g.first; p <= g.last; p++) out.push(p);
  return g.reverse ? out.reverse() : out;
}
const effectiveCenter = (g) => (g.center !== null && g.center !== undefined ? g.center : (g.first + g.last) / 2);
function coords(g, dir) {
  const pos = positions(g);
  const c = effectiveCenter(g);
  if (dir === "forward") return pos.map((_, i) => i);
  if (dir === "backward") return pos.map((_, i) => pos.length - 1 - i);
  const d = pos.map((p) => Math.abs(p - c));
  if (dir === "center_out") return d;
  const m = Math.max(...d);
  return d.map((x) => m - x);
}
function render(e, g, t) {
  const pos = positions(g);
  const n = pos.length;
  let frame = [];
  if (e.type === "static") frame = pos.map(() => e.colors[0]);
  else if (e.type === "segments") {
    const levels = e.levels || [];
    frame = pos.map((_, i) => (e.segments[i] ? scale(e.segments[i], levels[i] ?? 100) : e.background));
  }
  else {
    const cs = coords(g, e.direction);
    const offset = speedToUnits(e.speed) * t;
    const span = Math.max(Math.max(...cs) - Math.min(...cs), 1);
    if (e.type === "gradient") {
      const cyclic = e.speed > 0;
      frame = cs.map((c) =>
        paletteSmooth(e.colors, cyclic ? ((c - offset) / span) * e.colors.length : ((c - Math.min(...cs)) / span) * (e.colors.length - 1), cyclic),
      );
    } else if (e.type === "fade") {
      const spc = Math.max(0.4, 6 / Math.max(speedToUnits(e.speed), 0.01));
      const spread = (e.spread / 100) * e.colors.length;
      frame = cs.map((c) => paletteSmooth(e.colors, t / spc - (c / span) * spread, true));
    } else {
      const period = e.block + e.gap;
      const step = Math.floor(offset + 1e-9);
      frame = cs.map((c) => {
        const slot = Math.floor(c + 1e-9) - step;
        const within = ((slot % period) + period) % period;
        if (within >= e.block) return e.background;
        const color = e.colors[(((Math.floor(slot / period)) % e.colors.length) + e.colors.length) % e.colors.length];
        // The head (largest coordinate, leading the motion) is brightest.
        return e.tail && e.block > 1 ? dim(color, 1 - ((e.tail / 100) * (e.block - 1 - within)) / e.block) : color;
      });
    }
  }
  const out = {};
  const f = e.brightness / 100;
  pos.forEach((p, i) => (out[p] = frame[i].map((v) => Math.round(v * f))));
  return out;
}

// ---------- native playback (mirror of studio_render.native_*) ----------
const NATIVE_TYPES = ["static", "segments", "gradient", "marquee"];
const NATIVE_DIRECTIONS = ["forward", "backward"];
const nativeIcsPerSecond = (s) => (s <= 0 ? 0 : 2.4 * Math.pow(1.035, s - 50));
function nativePeriod(block, gap, ring) {
  let p = Math.min(block + gap, ring);
  while (ring % p) p++;
  return p;
}
function nativePattern(e, g) {
  const ring = g.units;
  const colors = new Array(ring).fill(null);
  const vis = positions(g);
  if (e.type === "static") {
    vis.forEach((p) => (colors[p - 1] = e.colors[0]));
    return { effect: "clockwise", speed: 0, colors };
  }
  if (e.type === "segments") {
    const levels = e.levels || [];
    vis.forEach((p, i) => {
      if (e.segments[i]) colors[p - 1] = scale(e.segments[i], levels[i] ?? 100);
    });
    return { effect: "clockwise", speed: 0, colors };
  }
  if (e.type === "gradient") {
    const n = e.colors.length;
    if (e.speed === 0) {
      const span = Math.max(vis.length - 1, 1);
      vis.forEach((p, i) => (colors[p - 1] = paletteSmooth(e.colors, (i / span) * (n - 1), false)));
      return { effect: "clockwise", speed: 0, colors };
    }
    for (let j = 0; j < ring; j++) colors[j] = paletteSmooth(e.colors, (j / ring) * n, true);
    return { effect: "gradient", speed: e.speed, colors };
  }
  const away = (e.direction === "forward") !== Boolean(g.reverse);
  const period = nativePeriod(e.block, e.gap, ring);
  const black = e.background.every((v) => v === 0);
  for (let j = 0; j < ring; j++) {
    const c = away ? j : ring - 1 - j;
    const within = c % period;
    if (within >= e.block) {
      colors[j] = black ? null : e.background;
      continue;
    }
    const color = e.colors[Math.floor(c / period) % e.colors.length];
    colors[j] = e.tail && e.block > 1 ? dim(color, 1 - ((e.tail / 100) * (e.block - 1 - within)) / e.block) : color;
  }
  return { effect: e.speed === 0 ? "clockwise" : away ? "clockwise" : "counter_clockwise", speed: e.speed, colors };
}
// Approximation of what the strip shows at time t (it steps whole ICs; its gradient blends).
function nativeFrame(e, g, t) {
  const pat = nativePattern(e, g);
  const ring = g.units;
  const at = (j) => pat.colors[((j % ring) + ring) % ring] || [0, 0, 0];
  const shift = nativeIcsPerSecond(pat.speed) * t;
  const out = {};
  for (let j = 0; j < ring; j++) {
    let c;
    if (pat.speed === 0) c = at(j);
    else if (pat.effect === "gradient") {
      const x = j - shift;
      const i = Math.floor(x);
      c = lerp(at(i), at(i + 1), x - i);
    } else c = at(pat.effect === "clockwise" ? j - Math.floor(shift) : j + Math.floor(shift));
    out[j + 1] = dim(c, e.brightness / 100);
  }
  return out;
}

// ---------- helpers ----------
const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgbToHex = (c) => "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
const css = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;
const clone = (o) => JSON.parse(JSON.stringify(o));

const DEFAULT_EFFECT = {
  type: "marquee",
  colors: [[255, 59, 48], [10, 132, 255]],
  segments: [],
  levels: [],
  tail: 0,
  playback: "ha",
  direction: "center_out",
  speed: 40,
  block: 2,
  gap: 1,
  spread: 0,
  brightness: 100,
  background: [0, 0, 0],
};

class GoveeStripStudioPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._info = null;
    this._entryId = null;
    this._effect = clone(DEFAULT_EFFECT);
    this._geometry = null;
    this._geoDirty = false;
    this._live = false;
    this._paintColor = [255, 255, 255];
    this._tool = "color"; // color | off | level
    this._brushLevel = 100;
    this._editingId = null;
    this._name = "";
    this._t0 = performance.now();
    this._raf = null;
    this._status = null;
    this._message = null;
    this._liveTimer = null;
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (first) this._init();
  }
  set narrow(v) {
    this._narrow = v;
  }

  connectedCallback() {
    if (!this._raf) this._loop();
  }
  disconnectedCallback() {
    cancelAnimationFrame(this._raf);
    this._raf = null;
    if (this._unsub) this._unsub.then((u) => u()).catch(() => {});
    this._unsub = null;
  }

  async _init() {
    try {
      this._info = await this._hass.callWS({ type: `${WS}/info` });
    } catch (err) {
      this._message = { kind: "error", text: `Strip Studio nicht erreichbar: ${err.message || err}` };
      this._render();
      return;
    }
    const dev = this._info.devices[0];
    if (dev) this._selectDevice(dev.entry_id);
    this._resetDartsDraft();
    this._unsub = this._hass.connection.subscribeMessage((ev) => this._onStatus(ev), { type: `${WS}/subscribe` });
    this._render();
  }

  _device() {
    return this._info?.devices.find((d) => d.entry_id === this._entryId);
  }

  _selectDevice(id) {
    this._entryId = id;
    const dev = this._device();
    this._geometry = { units: dev.ic_count, ...dev.geometry };
    if (this._geometry.last == null) this._geometry.last = dev.ic_count;
    this._status = dev.player;
    this._ensureSegments();
  }

  _native() {
    return this._effect.playback === "native";
  }

  // Geometry in the units the current playback paints: physical ICs (native) or segments.
  _unitGeometry() {
    return this._native() ? { ...this._geometry, units: this._device().ic_count } : this._segGeometry();
  }

  _setPlayback(mode) {
    const e = this._effect;
    if (mode === e.playback) return;
    const before = positions(this._unitGeometry()).length;
    e.playback = mode;
    const after = positions(this._unitGeometry()).length;
    const pick = (arr, fill) => Array.from({ length: after }, (_, i) => (arr || [])[Math.floor((i * before) / after)] ?? fill);
    e.segments = pick(e.segments, null);
    e.levels = pick(e.levels, 100);
    const f = mode === "native" ? 2 : 0.5; // marquee lengths: segments <-> ICs
    e.block = Math.min(30, Math.max(1, Math.round(e.block * f)));
    e.gap = Math.min(30, Math.max(0, Math.round(e.gap * f)));
    if (mode === "native" && !NATIVE_DIRECTIONS.includes(e.direction)) e.direction = "forward";
    this._changed();
  }

  _segGeometry() {
    const dev = this._device();
    return rescale({ ...this._geometry, units: dev.ic_count }, dev.segment_count);
  }

  _ensureSegments() {
    const n = positions(this._unitGeometry()).length;
    const segs = this._effect.segments || [];
    const levels = this._effect.levels || [];
    this._effect.segments = Array.from({ length: n }, (_, i) => segs[i] || null);
    this._effect.levels = Array.from({ length: n }, (_, i) => levels[i] ?? 100);
  }

  _onStatus(ev) {
    if (ev.darts) {
      this._info.darts = ev.darts;
      this._renderDartsStatus();
    }
    if (ev.entry_id !== this._entryId) return;
    this._status = ev.player;
    const idx = this._info.devices.findIndex((d) => d.entry_id === ev.entry_id);
    if (idx >= 0) this._info.devices[idx] = ev;
    this._renderStatus();
  }

  _toast(kind, text) {
    this._message = { kind, text };
    this._render();
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      this._message = null;
      this._render();
    }, 4000);
  }

  async _call(msg) {
    try {
      return await this._hass.callWS(msg);
    } catch (err) {
      this._toast("error", err.message || String(err));
      throw err;
    }
  }

  async _play(live = false) {
    // live: swap the effect into the running player; only changed segments are sent.
    await this._call({ type: `${WS}/play`, entry_id: this._entryId, effect: this._effect, live });
  }
  async _stop() {
    await this._call({ type: `${WS}/stop`, entry_id: this._entryId });
  }
  async _saveGeometry() {
    const { first, last, center, reverse } = this._geometry;
    const dev = await this._call({ type: `${WS}/geometry/set`, entry_id: this._entryId, geometry: { first, last, center, reverse } });
    const idx = this._info.devices.findIndex((d) => d.entry_id === this._entryId);
    this._info.devices[idx] = dev;
    this._geoDirty = false;
    this._ensureSegments();
    this._toast("ok", "Streifen-Geometrie gespeichert");
  }
  async _saveEffect() {
    const name = (this._name || "").trim();
    if (!name) return this._toast("error", "Bitte gib dem Effekt einen Namen");
    const msg = { type: `${WS}/effects/save`, name, effect: this._effect };
    if (this._editingId) msg.effect_id = this._editingId;
    const res = await this._call(msg);
    this._info.effects = res.effects;
    this._editingId = res.effect_id;
    this._toast("ok", `„${name}“ gespeichert`);
  }
  async _deleteEffect(id) {
    const name = this._info.effects[id]?.name;
    if (!confirm(`„${name}“ wirklich löschen?`)) return;
    const res = await this._call({ type: `${WS}/effects/delete`, effect_id: id });
    this._info.effects = res.effects;
    if (this._editingId === id) this._editingId = null;
    this._render();
  }
  _loadEffect(id) {
    const saved = this._info.effects[id];
    this._effect = { ...clone(DEFAULT_EFFECT), ...clone(saved.effect) };
    this._editingId = id;
    this._name = saved.name;
    this._ensureSegments();
    this._render();
    this._changed(false);
  }
  _newEffect() {
    this._effect = clone(DEFAULT_EFFECT);
    this._editingId = null;
    this._name = "";
    this._ensureSegments();
    this._render();
  }

  // ---------- darts (Autodarts via darts-caller) ----------
  _resetDartsDraft() {
    const d = this._info.darts || {};
    this._dartsDraft = {
      enabled: Boolean(d.enabled),
      host: d.host || "",
      port: d.port || 8079,
      entry_id: d.entry_id || this._entryId,
      rules: clone(d.rules || {}),
    };
    this._dartsDirty = false;
  }

  async _saveDarts() {
    const status = await this._call({ type: `${WS}/darts/set`, config: this._dartsDraft });
    this._info.darts = status;
    this._resetDartsDraft();
    this._toast("ok", status.enabled ? "Darts-Einstellungen gespeichert – verbinde mit darts-caller …" : "Darts-Einstellungen gespeichert");
  }

  async _testDarts(trigger) {
    if (this._dartsDirty) await this._saveDarts();
    await this._call({ type: `${WS}/darts/simulate`, trigger });
  }

  _renderDartsStatus() {
    const el = this.shadowRoot.querySelector(".darts-status");
    if (!el) return;
    const d = this._info.darts || {};
    const feed = d.feed;
    if (!d.enabled || !feed) {
      el.innerHTML = `<span class="dot off"></span> Aus`;
      return;
    }
    const label = this._info.darts_triggers.flatMap(([, items]) => items).find(([id]) => id === d.active)?.[1];
    const last = feed.last_event ? ` · letztes Ereignis: ${feed.last_event} (vor ${Math.round(feed.last_event_age)} s)` : "";
    el.innerHTML = feed.connected
      ? `<span class="dot on"></span> Verbunden mit darts-caller${last}${label ? ` · zeigt: <b>${label}</b>` : ""}`
      : `<span class="dot off"></span> <span class="warn">Nicht verbunden${feed.error ? `: ${feed.error}` : ""}</span> – neuer Versuch läuft`;
  }

  _dartsCard() {
    const d = this._dartsDraft;
    const effects = Object.entries(this._info.effects || {});
    const stateTriggers = new Set(this._info.darts_state_triggers || []);
    const devices = this._info.devices;
    const options = (selected) =>
      `<option value="">— nichts —</option>` +
      effects.map(([id, item]) => `<option value="${id}" ${id === selected ? "selected" : ""}>${item.name}</option>`).join("");
    const rows = (items) =>
      items
        .map(([id, label]) => {
          const rule = d.rules[id] || {};
          const timed = !stateTriggers.has(id);
          return `<div class="darts-row">
            <span>${label}</span>
            <select data-darts-effect="${id}">${options(rule.effect_id)}</select>
            ${
              timed
                ? `<label class="dur"><input type="number" min="0.5" max="60" step="0.5" value="${rule.duration ?? this._info.darts_default_duration}" data-darts-duration="${id}" ${rule.effect_id ? "" : "disabled"}/> s</label>`
                : `<span class="dur muted">bleibt</span>`
            }
            <button data-darts-test="${id}" title="Testen" ${rule.effect_id ? "" : "disabled"}>▶</button>
          </div>`;
        })
        .join("");
    return `<section class="card wide">
      <h2>Darts</h2>
      <p class="hint">Strip Studio hört bei <b>darts-caller</b> auf deinem Autodarts-Rechner mit und spielt je nach Wurf deine gespeicherten Effekte. Kurze Effekte springen nach der eingestellten Zeit zurück auf die Farbe des Spielers am Zug.</p>
      <div class="darts-conn">
        <label>Rechner <input class="text" data-darts="host" placeholder="192.168.1.130" value="${d.host}"/></label>
        <label>Port <input class="text port" type="number" data-darts="port" value="${d.port}"/></label>
        ${
          devices.length > 1
            ? `<label>Streifen <select data-darts="entry_id">${devices
                .map((x) => `<option value="${x.entry_id}" ${x.entry_id === d.entry_id ? "selected" : ""}>${x.title}</option>`)
                .join("")}</select></label>`
            : ""
        }
        <label class="toggle"><input type="checkbox" data-darts="enabled" ${d.enabled ? "checked" : ""}/> Aktiv</label>
        <button class="primary" data-act="darts-save" ${this._dartsDirty ? "" : "disabled"}>Speichern</button>
      </div>
      <div class="status darts-status"></div>
      ${effects.length ? "" : `<p class="hint">Speichere zuerst unter „Meine Effekte“ ein paar Effekte – die kannst du hier den Ereignissen zuordnen.</p>`}
      <div class="darts-groups">${this._info.darts_triggers
        .map(([group, items]) => `<div><h3>${group}</h3>${rows(items)}</div>`)
        .join("")}</div>
    </section>`;
  }

  _changed(rerender = true) {
    this._t0 = performance.now();
    if (rerender) this._render();
    if (this._live) {
      clearTimeout(this._liveTimer);
      // Native uploads are coalesced on the server (newest edit wins), so a short debounce is enough.
      this._liveTimer = setTimeout(() => this._play(true).catch(() => {}), 250);
    }
  }

  // ---------- animation loop for the on-screen preview ----------
  _loop() {
    const tick = () => {
      this._drawPreview();
      this._raf = requestAnimationFrame(tick);
    };
    this._raf = requestAnimationFrame(tick);
  }
  _drawPreview() {
    const root = this.shadowRoot;
    const cells = root.querySelectorAll(".preview .cell");
    if (!cells.length || !this._device()) return;
    const t = (performance.now() - this._t0) / 1000;
    let frame;
    try {
      frame = this._native() ? nativeFrame(this._effect, this._unitGeometry(), t) : render(this._effect, this._segGeometry(), t);
    } catch (e) {
      return;
    }
    cells.forEach((cell) => {
      const seg = Number(cell.dataset.seg);
      const c = frame[seg];
      cell.style.background = c ? css(c) : "transparent";
      cell.style.boxShadow = c && (c[0] + c[1] + c[2]) > 30 ? `0 0 14px 2px ${css(c)}` : "none";
    });
  }

  _renderStatus() {
    const el = this.shadowRoot.querySelector(".status");
    if (!el) return;
    const s = this._status;
    const native = this._device()?.native;
    if (native && !(s && s.running)) {
      el.innerHTML = native.error
        ? `<span class="dot off"></span> <span class="warn">Senden fehlgeschlagen: ${native.error}</span>`
        : `<span class="dot on"></span> Läuft im Streifen${native.name ? `: <b>${native.name}</b>` : ""}`;
      return;
    }
    if (!s || !s.running) {
      el.innerHTML = `<span class="dot off"></span> Streifen: kein Studio-Effekt aktiv`;
      return;
    }
    el.innerHTML = `<span class="dot on"></span> Läuft${s.name ? `: <b>${s.name}</b>` : ""} · ${s.fps} Bilder/s · ${
      s.avg_write_ms ?? "–"
    } ms/Befehl${s.errors ? ` · <span class="warn">${s.errors} Fehler</span>` : ""}`;
  }

  // ---------- UI ----------
  _render() {
    const root = this.shadowRoot;
    if (!this._info) {
      root.innerHTML = `<style>${STYLE}</style><div class="page"><div class="card">${
        this._message ? this._message.text : "Lade Strip Studio …"
      }</div></div>`;
      return;
    }
    const dev = this._device();
    if (!dev) {
      root.innerHTML = `<style>${STYLE}</style><div class="page"><div class="card">Kein unterstützter LED-Streifen gefunden.</div></div>`;
      return;
    }
    const e = this._effect;
    const g = this._geometry;
    const sg = this._segGeometry();
    const ug = this._unitGeometry();
    const visible = positions(sg).length;
    const native = this._native();
    const canNative = NATIVE_TYPES.includes(e.type);
    const effects = Object.entries(this._info.effects || {});
    root.innerHTML = `
      <style>${STYLE}</style>
      <div class="page">
        <header>
          <ha-menu-button></ha-menu-button>
          <div class="title">Strip Studio</div>
          ${
            this._info.devices.length > 1
              ? `<select class="device">${this._info.devices
                  .map((d) => `<option value="${d.entry_id}" ${d.entry_id === this._entryId ? "selected" : ""}>${d.title}</option>`)
                  .join("")}</select>`
              : `<div class="sub">${dev.title}</div>`
          }
        </header>
        ${this._message ? `<div class="toast ${this._message.kind}">${this._message.text}</div>` : ""}

        <section class="card hero">
          <div class="preview-head">
            <span class="ctrl">● Controller</span>
            <span class="status"></span>
          </div>
          <div class="preview ${native ? "fine" : ""}">${this._previewCells(ug)}</div>
          <div class="actions">
            <button class="primary" data-act="play">▶ Auf Streifen abspielen</button>
            <button data-act="stop">■ Stopp</button>
            <label class="toggle"><input type="checkbox" data-act="live" ${this._live ? "checked" : ""}/> Live – Änderungen sofort senden</label>
          </div>
        </section>

        <div class="grid">
          <section class="card">
            <h2>Effekt</h2>
            <div class="types">${TYPES.map(
              (t) => `<button class="type ${e.type === t.id ? "sel" : ""}" data-type="${t.id}"><ha-icon icon="${t.icon}"></ha-icon><span>${t.label}</span></button>`,
            ).join("")}</div>

            ${
              canNative
                ? `<h3>Wiedergabe</h3>
                  <div class="tools">
                    <button class="${native ? "" : "sel"}" data-playback="ha">Präzise (Home Assistant)</button>
                    <button class="${native ? "sel" : ""}" data-playback="native">Flüssig (im Streifen)</button>
                  </div>
                  <p class="hint" style="margin-top:8px">${
                    native
                      ? "Der Streifen spielt den Effekt selbst ab: flüssig und pro Chip fein. Bewegung nur vom oder zum Controller."
                      : "Home Assistant sendet jedes Bild pro Segment: alle Richtungen, aber Bewegungen laufen in Schritten."
                  }</p>`
                : ""
            }

            ${e.type === "segments" ? this._segmentEditor(ug) : this._colorEditor()}

            ${
              ["gradient", "fade", "marquee"].includes(e.type) && !(native && e.type === "gradient")
                ? `<h3>Richtung</h3><div class="dirs">${DIRECTIONS.filter((d) => !native || NATIVE_DIRECTIONS.includes(d.id)).map(
                    (d) => `<button class="dir ${e.direction === d.id ? "sel" : ""}" data-dir="${d.id}" title="${d.label}"><span class="glyph">${d.glyph}</span><span>${d.label}</span></button>`,
                  ).join("")}</div>`
                : ""
            }
            ${this._sliders()}
          </section>

          <section class="card">
            <h2>Streifen</h2>
            <p class="hint">Lege fest, welcher Teil deines Streifens tatsächlich vorhanden ist und wo seine Mitte liegt. Klicke einen Chip an: erst <b>Anfang</b>, dann <b>Ende</b>. Mit „Zentrum setzen“ wählst du die Mitte frei.</p>
            <div class="geo">${this._icCells(dev)}</div>
            <div class="geo-legend">
              <span>Chip ${g.first}–${g.last} sichtbar (${g.last - g.first + 1} von ${dev.ic_count}) · ${visible} Segmente</span>
              <span>Zentrum: ${g.center == null ? `automatisch (${effectiveCenter(g)})` : g.center}</span>
            </div>
            <div class="actions small">
              <button data-act="geo-mode" class="${this._geoMode === "center" ? "sel" : ""}">${this._geoMode === "center" ? "Zentrum wählen …" : "Zentrum setzen"}</button>
              <button data-act="geo-auto">Zentrum automatisch</button>
              <label class="toggle"><input type="checkbox" data-act="geo-reverse" ${g.reverse ? "checked" : ""}/> Richtung umkehren</label>
              <button class="primary" data-act="geo-save" ${this._geoDirty ? "" : "disabled"}>Speichern</button>
            </div>
          </section>

          <section class="card wide">
            <h2>Meine Effekte</h2>
            <div class="save-row">
              <input class="name" placeholder="Name, z. B. Abendwelle" value="${(this._name || "").replace(/"/g, "&quot;")}" maxlength="40"/>
              <button class="primary" data-act="save">${this._editingId ? "Aktualisieren" : "Speichern"}</button>
              ${this._editingId ? `<button data-act="new">Neu</button>` : ""}
            </div>
            <div class="lib">${
              effects.length
                ? effects
                    .map(
                      ([id, item]) => `<div class="item ${id === this._editingId ? "sel" : ""}">
                        <div class="sw">${this._swatch(item.effect)}</div>
                        <div class="meta"><b>${item.name}</b><span>${TYPES.find((t) => t.id === item.effect.type)?.label || ""}${
                          item.effect.direction && ["gradient", "fade", "marquee"].includes(item.effect.type)
                            ? " · " + (DIRECTIONS.find((d) => d.id === item.effect.direction)?.label || "")
                            : ""
                        }${item.effect.playback === "native" ? " · im Streifen" : ""}</span></div>
                        <button data-lib-play="${id}" title="Abspielen">▶</button>
                        <button data-lib-edit="${id}" title="Bearbeiten">✎</button>
                        <button data-lib-del="${id}" title="Löschen">🗑</button>
                      </div>`,
                    )
                    .join("")
                : `<p class="hint">Noch keine Effekte gespeichert.</p>`
            }</div>
          </section>

          ${this._dartsCard()}
        </div>
      </div>`;
    this._bind();
    this._renderStatus();
    this._renderDartsStatus();
    this._drawPreview();
  }

  _swatch(eff) {
    const cols = eff.type === "segments" ? (eff.segments || []).filter(Boolean).slice(0, 6) : eff.colors;
    return (cols.length ? cols : [[40, 40, 40]]).map((c) => `<i style="background:${css(c)}"></i>`).join("");
  }

  _previewCells(g) {
    const vis = new Set(positions(g));
    const unit = this._native() ? "Chip" : "Segment";
    let out = "";
    for (let s = 1; s <= g.units; s++) {
      out += `<div class="cell ${vis.has(s) ? "" : "hidden"}" data-seg="${s}" title="${unit} ${s}"></div>`;
    }
    return out;
  }

  _icCells(dev) {
    const g = this._geometry;
    const c = effectiveCenter(g);
    let out = "";
    for (let i = 1; i <= dev.ic_count; i++) {
      const on = i >= g.first && i <= g.last;
      const isCenter = Math.abs(i - c) < 0.51;
      const edge = Math.abs(i - c) === 0.5 ? (i < c ? "c-right" : "c-left") : "";
      out += `<button class="ic ${on ? "on" : ""} ${i === g.first ? "first" : ""} ${i === g.last ? "last" : ""} ${
        isCenter && Number.isInteger(c) ? "center" : ""
      } ${edge}" data-ic="${i}" title="Chip ${i}">${i === g.first ? "A" : i === g.last ? "E" : ""}</button>`;
    }
    return out;
  }

  _colorEditor() {
    const e = this._effect;
    const max = e.type === "static" ? 1 : 8;
    const cols = e.colors.slice(0, max);
    return `<h3>${e.type === "static" ? "Farbe" : "Farben"}</h3>
      <div class="colors">
        ${cols
          .map(
            (c, i) => `<div class="color">
              <input type="color" value="${rgbToHex(c)}" data-color="${i}"/>
              ${cols.length > 1 ? `<button class="x" data-color-del="${i}" title="Entfernen">×</button>` : ""}
            </div>`,
          )
          .join("")}
        ${cols.length < max ? `<button class="add" data-act="color-add" title="Farbe hinzufügen">＋</button>` : ""}
      </div>
      ${
        e.type === "marquee"
          ? `<label class="row"><span>Hintergrund</span><input type="color" value="${rgbToHex(e.background)}" data-bg/></label>`
          : ""
      }`;
  }

  _segmentEditor(sg) {
    const e = this._effect;
    const pos = positions(sg);
    const tool = this._tool;
    return `<h3>Segmente bemalen</h3>
      <p class="hint">Werkzeug wählen, dann Segmente anklicken oder mit gedrückter Maus darüberziehen.</p>
      <div class="brush">
        <input type="color" value="${rgbToHex(this._paintColor)}" data-brush-color title="Pinselfarbe"/>
        <div class="tools">${TOOLS.map(
          (t) => `<button class="${tool === t.id ? "sel" : ""}" data-tool="${t.id}">${t.label}</button>`,
        ).join("")}</div>
      </div>
      ${
        tool === "off"
          ? ""
          : `<label class="row"><span>Pinsel-Helligkeit</span><input type="range" min="1" max="100" value="${this._brushLevel}" data-brush-level/><em>${this._brushLevel} %</em></label>`
      }
      <div class="paint ${this._native() ? "fine" : ""}">${pos.map((_, i) => this._segButton(i)).join("")}</div>
      <div class="actions small">
        <button data-act="fill-all">Alle wie Pinsel</button>
        <button data-act="clear-all">Alle aus</button>
      </div>`;
  }

  _segButton(i) {
    const c = this._effect.segments[i];
    const level = this._effect.levels[i] ?? 100;
    const bg = c ? css(scale(c, level)) : "transparent";
    return `<button class="seg ${c ? "" : "off"}" data-paint="${i}" style="background:${bg}"><span>${i + 1}</span>${
      c && level < 100 ? `<small>${level}%</small>` : ""
    }</button>`;
  }

  _paintAt(i) {
    const e = this._effect;
    if (this._tool === "off") e.segments[i] = null;
    else if (this._tool === "level") {
      if (!e.segments[i]) return;
      e.levels[i] = this._brushLevel;
    } else {
      e.segments[i] = [...this._paintColor];
      e.levels[i] = this._brushLevel;
    }
    const btn = this.shadowRoot.querySelector(`[data-paint="${i}"]`);
    if (btn) btn.outerHTML = this._segButton(i);
    this._changed(false);
  }

  _sliderText(k, v) {
    const native = this._native();
    if (k === "speed") {
      if (v === 0) return "steht";
      return native ? `≈ ${nativeIcsPerSecond(v).toFixed(1)} Chips/s` : `${speedToUnits(v).toFixed(1)} Seg/s`;
    }
    if (k === "spread" && v === 0) return "ganzer Streifen";
    if (k === "tail" && v === 0) return "aus";
    if (["brightness", "spread", "tail"].includes(k)) return `${v} %`;
    return `${v} ${native ? "Chips" : "Seg"}`;
  }

  _sliders() {
    const e = this._effect;
    const native = this._native();
    const rows = [];
    if (["gradient", "fade", "marquee"].includes(e.type)) rows.push(["speed", "Tempo", 0, 100]);
    if (e.type === "marquee") {
      rows.push(["block", "Blocklänge", 1, native ? 12 : 6]);
      rows.push(["gap", "Lücke", 0, native ? 12 : 6]);
      rows.push(["tail", "Ausklingen", 0, 100]);
    }
    if (e.type === "fade") rows.push(["spread", "Welle", 0, 100]);
    rows.push(["brightness", "Gesamt-Helligkeit", 1, 100]);
    let note = "";
    if (native && e.type === "marquee") {
      const ring = this._device().ic_count;
      const gap = nativePeriod(e.block, e.gap, ring) - e.block;
      if (gap !== e.gap) note = `<p class="hint">Lücke wird auf ${gap} Chips verlängert, damit das Muster über alle ${ring} Chips nahtlos umläuft.</p>`;
    }
    return `<div class="sliders">${rows
      .map(([k, l, min, max]) => {
        const v = e[k] ?? 0;
        return `<label class="row"><span>${l}</span><input type="range" min="${min}" max="${max}" value="${v}" data-slider="${k}"/><em>${this._sliderText(k, v)}</em></label>`;
      })
      .join("")}</div>${note}`;
  }

  _bind() {
    const r = this.shadowRoot;
    const on = (sel, ev, fn) => r.querySelectorAll(sel).forEach((el) => el.addEventListener(ev, fn));
    on(".device", "change", (ev) => {
      this._selectDevice(ev.target.value);
      this._render();
    });
    on("[data-act=play]", "click", () => this._play().then(() => this._toast("ok", "Effekt läuft auf dem Streifen")).catch(() => {}));
    on("[data-act=stop]", "click", () => this._stop().catch(() => {}));
    on("[data-act=live]", "change", (ev) => {
      this._live = ev.target.checked;
      if (this._live) this._play().catch(() => {});
    });
    on("[data-type]", "click", (ev) => {
      const t = ev.currentTarget.dataset.type;
      this._effect.type = t;
      if (!NATIVE_TYPES.includes(t) && this._native()) this._setPlayback("ha");
      if (t === "segments" && !this._effect.segments.some(Boolean)) {
        const pos = positions(this._unitGeometry());
        this._effect.segments = pos.map((_, i) => this._effect.colors[i % this._effect.colors.length]);
      }
      this._changed();
    });
    on("[data-playback]", "click", (ev) => this._setPlayback(ev.currentTarget.dataset.playback));
    on("[data-dir]", "click", (ev) => {
      this._effect.direction = ev.currentTarget.dataset.dir;
      this._changed();
    });
    on("[data-color]", "input", (ev) => {
      this._effect.colors[Number(ev.target.dataset.color)] = hexToRgb(ev.target.value);
      this._changed(false);
    });
    on("[data-color]", "change", () => this._render());
    on("[data-color-del]", "click", (ev) => {
      this._effect.colors.splice(Number(ev.currentTarget.dataset.colorDel), 1);
      this._changed();
    });
    on("[data-act=color-add]", "click", () => {
      const used = new Set(this._effect.colors.map(rgbToHex));
      const next = PRESET_COLORS.find((h) => !used.has(h)) || "#ffffff";
      this._effect.colors.push(hexToRgb(next));
      this._changed();
    });
    on("[data-bg]", "input", (ev) => {
      this._effect.background = hexToRgb(ev.target.value);
      this._changed(false);
    });
    // The gap note depends on block/gap; refresh it once a slider is released.
    on("[data-slider=block], [data-slider=gap]", "change", () => this._native() && this._render());
    on("[data-slider]", "input", (ev) => {
      this._effect[ev.target.dataset.slider] = Number(ev.target.value);
      const em = ev.target.parentElement.querySelector("em");
      if (em) em.textContent = this._sliderText(ev.target.dataset.slider, Number(ev.target.value));
      this._changed(false);
    });
    on("[data-brush-color]", "input", (ev) => {
      this._paintColor = hexToRgb(ev.target.value);
      if (this._tool !== "color") {
        this._tool = "color";
        this._render();
      }
    });
    on("[data-tool]", "click", (ev) => {
      this._tool = ev.currentTarget.dataset.tool;
      this._render();
    });
    on("[data-brush-level]", "input", (ev) => {
      this._brushLevel = Number(ev.target.value);
      ev.target.parentElement.querySelector("em").textContent = `${this._brushLevel} %`;
    });
    // Click-and-drag painting; works for mouse and touch (no pointer capture, so we hit-test).
    const paint = r.querySelector(".paint");
    if (paint) {
      let last = null;
      const hit = (ev) => {
        const el = r.elementFromPoint(ev.clientX, ev.clientY)?.closest("[data-paint]");
        if (!el) return;
        const i = Number(el.dataset.paint);
        if (i !== last) {
          last = i;
          this._paintAt(i);
        }
      };
      paint.addEventListener("pointerdown", (ev) => {
        ev.preventDefault();
        last = null;
        this._painting = true;
        hit(ev);
      });
      paint.addEventListener("pointermove", (ev) => this._painting && hit(ev));
      const end = () => {
        if (!this._painting) return;
        this._painting = false;
        this._changed();
      };
      paint.addEventListener("pointerup", end);
      paint.addEventListener("pointercancel", end);
      paint.addEventListener("pointerleave", end);
    }
    on("[data-act=fill-all]", "click", () => {
      this._effect.segments.forEach((_, i) => this._paintAt(i));
      this._changed();
    });
    on("[data-act=clear-all]", "click", () => {
      this._effect.segments = this._effect.segments.map(() => null);
      this._changed();
    });
    // darts
    const dartsDirty = () => {
      this._dartsDirty = true;
      const btn = r.querySelector("[data-act=darts-save]");
      if (btn) btn.disabled = false;
    };
    on("[data-darts]", "change", (ev) => {
      const k = ev.target.dataset.darts;
      this._dartsDraft[k] = k === "enabled" ? ev.target.checked : k === "port" ? Number(ev.target.value) : ev.target.value.trim();
      dartsDirty();
    });
    on("[data-darts-effect]", "change", (ev) => {
      const id = ev.target.dataset.dartsEffect;
      if (ev.target.value) this._dartsDraft.rules[id] = { ...(this._dartsDraft.rules[id] || {}), effect_id: ev.target.value };
      else delete this._dartsDraft.rules[id];
      dartsDirty();
      this._render();
    });
    on("[data-darts-duration]", "change", (ev) => {
      const rule = this._dartsDraft.rules[ev.target.dataset.dartsDuration];
      if (rule) rule.duration = Number(ev.target.value);
      dartsDirty();
    });
    on("[data-darts-test]", "click", (ev) => this._testDarts(ev.currentTarget.dataset.dartsTest).catch(() => {}));
    on("[data-act=darts-save]", "click", () => this._saveDarts().then(() => this._render()).catch(() => {}));
    // geometry
    on("[data-ic]", "click", (ev) => {
      const i = Number(ev.currentTarget.dataset.ic);
      const g = this._geometry;
      if (this._geoMode === "center") {
        if (i < g.first || i > g.last) return this._toast("error", "Das Zentrum muss im sichtbaren Bereich liegen");
        g.center = g.center === i ? i + 0.5 > g.last ? i : i + 0.5 : i;
        this._geoMode = null;
      } else if (this._geoPick === "last") {
        if (i < g.first) {
          g.last = g.first;
          g.first = i;
        } else g.last = i;
        this._geoPick = null;
      } else {
        g.first = i;
        if (g.last < i) g.last = i;
        this._geoPick = "last";
        this._toast("ok", "Jetzt das Ende anklicken");
      }
      if (g.center != null && (g.center < g.first || g.center > g.last)) g.center = null;
      this._geoDirty = true;
      this._ensureSegments();
      this._changed();
    });
    on("[data-act=geo-mode]", "click", () => {
      this._geoMode = this._geoMode === "center" ? null : "center";
      if (this._geoMode) this._toast("ok", "Klicke den Chip, der die Mitte bildet (zweimal klicken = Grenze zum nächsten)");
      else this._render();
    });
    on("[data-act=geo-auto]", "click", () => {
      this._geometry.center = null;
      this._geoDirty = true;
      this._changed();
    });
    on("[data-act=geo-reverse]", "change", (ev) => {
      this._geometry.reverse = ev.target.checked;
      this._geoDirty = true;
      this._changed();
    });
    on("[data-act=geo-save]", "click", () => this._saveGeometry().catch(() => {}));
    // library
    on(".name", "input", (ev) => (this._name = ev.target.value));
    on("[data-act=save]", "click", () => this._saveEffect().catch(() => {}));
    on("[data-act=new]", "click", () => this._newEffect());
    on("[data-lib-play]", "click", (ev) =>
      this._call({ type: `${WS}/play`, entry_id: this._entryId, effect_id: ev.currentTarget.dataset.libPlay }).catch(() => {}),
    );
    on("[data-lib-edit]", "click", (ev) => this._loadEffect(ev.currentTarget.dataset.libEdit));
    on("[data-lib-del]", "click", (ev) => this._deleteEffect(ev.currentTarget.dataset.libDel));
  }
}

const STYLE = `
:host{display:block;color:var(--primary-text-color);background:var(--primary-background-color);min-height:100vh;font-family:var(--paper-font-body1_-_font-family,Roboto,system-ui,sans-serif)}
.page{max-width:1200px;margin:0 auto;padding:0 16px 32px}
header{display:flex;align-items:center;gap:12px;height:56px;position:sticky;top:0;z-index:2;background:var(--app-header-background-color,var(--primary-background-color));color:var(--app-header-text-color,var(--primary-text-color));margin:0 -16px 16px;padding:0 16px}
.title{font-size:20px;font-weight:500}
.sub{opacity:.7;font-size:14px}
select.device{margin-left:auto;padding:6px 10px;border-radius:8px;background:var(--card-background-color);color:inherit;border:1px solid var(--divider-color)}
.card{background:var(--ha-card-background,var(--card-background-color));border-radius:var(--ha-card-border-radius,16px);padding:16px 18px;box-shadow:var(--ha-card-box-shadow,none);border:1px solid var(--ha-card-border-color,var(--divider-color))}
.grid{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:16px;margin-top:16px}
.grid > .card.wide,.grid > .card:last-child{grid-column:1 / -1}
.darts-conn{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:10px;font-size:14px}
.darts-conn label{display:flex;align-items:center;gap:6px}
.darts-conn .text,.darts-row select,.darts-conn select{padding:7px 10px;border-radius:8px;border:1px solid var(--divider-color);background:var(--secondary-background-color);color:inherit;font:inherit}
.darts-conn .text{width:160px}
.darts-conn .port{width:80px}
.darts-groups{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:4px 24px}
.darts-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr) 76px 36px;gap:8px;align-items:center;font-size:14px;margin-bottom:6px}
.darts-row select{min-width:0}
.darts-row .dur{display:flex;align-items:center;gap:4px;font-size:13px}
.darts-row .dur input{width:52px;padding:6px;border-radius:8px;border:1px solid var(--divider-color);background:var(--secondary-background-color);color:inherit}
.darts-row .muted{opacity:.55}
.darts-row button{padding:6px 0}
@media (max-width:900px){.grid{grid-template-columns:1fr}}
h2{font-size:17px;margin:0 0 12px;font-weight:500}
h3{font-size:13px;text-transform:uppercase;letter-spacing:.06em;opacity:.65;margin:18px 0 8px;font-weight:500}
.hint{font-size:13px;opacity:.7;margin:0 0 10px;line-height:1.4}
button{font:inherit;color:inherit;background:var(--secondary-background-color);border:1px solid var(--divider-color);border-radius:10px;padding:8px 12px;cursor:pointer;transition:all .15s}
button:hover{border-color:var(--primary-color)}
button:disabled{opacity:.4;cursor:default}
button.primary{background:var(--primary-color);color:var(--text-primary-color,#fff);border-color:var(--primary-color)}
button.sel{border-color:var(--primary-color);box-shadow:0 0 0 1px var(--primary-color) inset;background:color-mix(in srgb,var(--primary-color) 16%,transparent)}
.hero{padding:18px}
.preview-head{display:flex;justify-content:space-between;align-items:center;font-size:13px;margin-bottom:10px;gap:12px;flex-wrap:wrap}
.ctrl{opacity:.7}
.status{opacity:.85}
.status .warn{color:var(--error-color)}
.dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:4px;vertical-align:middle}
.dot.on{background:var(--success-color,#34c759);box-shadow:0 0 8px var(--success-color,#34c759)}
.dot.off{background:var(--disabled-text-color,#888)}
.preview{display:flex;gap:4px;padding:18px 14px;background:#0b0b0e;border-radius:12px;overflow-x:auto}
.preview .cell{flex:1 1 0;min-width:18px;height:28px;border-radius:6px;transition:background .12s}
.preview.fine{gap:2px}
.preview.fine .cell{min-width:8px;border-radius:3px}
.preview .cell.hidden{opacity:.18;background:repeating-linear-gradient(45deg,#333 0 4px,#222 4px 8px)!important;box-shadow:none!important}
.actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:14px}
.actions.small{margin-top:10px}
.toggle{display:flex;align-items:center;gap:6px;font-size:14px;cursor:pointer}
.types{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
@media (max-width:520px){.types{grid-template-columns:repeat(3,1fr)}}
.type{display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 4px;font-size:13px}
.dirs{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
@media (max-width:520px){.dirs{grid-template-columns:repeat(2,1fr)}}
.dir{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:12px;padding:10px 4px;text-align:center}
.dir .glyph{font-size:20px;letter-spacing:-2px}
.colors{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.color{position:relative}
input[type=color]{width:44px;height:44px;border:none;border-radius:50%;padding:0;background:none;cursor:pointer}
input[type=color]::-webkit-color-swatch-wrapper{padding:0}
input[type=color]::-webkit-color-swatch{border:2px solid var(--divider-color);border-radius:50%}
input[type=color]::-moz-color-swatch{border:2px solid var(--divider-color);border-radius:50%}
.color .x{position:absolute;top:-6px;right:-6px;width:20px;height:20px;padding:0;border-radius:50%;font-size:13px;line-height:1}
.add{width:44px;height:44px;border-radius:50%;padding:0;font-size:20px}
.sliders{margin-top:14px;display:flex;flex-direction:column;gap:8px}
.row{display:grid;grid-template-columns:96px 1fr 110px;align-items:center;gap:10px;font-size:14px}
.row em{font-style:normal;opacity:.7;font-size:13px;text-align:right}
.row input[type=range]{width:100%;accent-color:var(--primary-color)}
.brush{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:10px}
.tools{display:flex;gap:6px;flex-wrap:wrap}
.paint{display:flex;gap:4px;flex-wrap:wrap;touch-action:none;user-select:none;-webkit-user-select:none;margin-top:10px}
.seg{flex:1 0 34px;height:44px;border-radius:8px;padding:0;font-size:12px;text-shadow:0 0 3px #000;color:#fff;background-image:none;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.1}
.seg.off{background:repeating-linear-gradient(45deg,transparent 0 5px,color-mix(in srgb,var(--divider-color) 60%,transparent) 5px 7px)!important;color:var(--secondary-text-color);text-shadow:none}
.seg small{font-size:10px;opacity:.9}
.paint.fine{gap:3px}
.paint.fine .seg{flex-basis:30px;font-size:11px}
.geo{display:grid;grid-template-columns:repeat(auto-fill,minmax(26px,1fr));gap:3px}
.ic{height:30px;padding:0;border-radius:6px;font-size:11px;font-weight:600;position:relative;background:var(--secondary-background-color);opacity:.45}
.ic.on{opacity:1;background:color-mix(in srgb,var(--primary-color) 30%,var(--secondary-background-color))}
.ic.first,.ic.last{background:var(--primary-color);color:var(--text-primary-color,#fff)}
.ic.center{outline:2px solid var(--warning-color,#ffcc00);outline-offset:1px}
.ic.c-right::after,.ic.c-left::before{content:"";position:absolute;top:-4px;bottom:-4px;width:3px;background:var(--warning-color,#ffcc00);border-radius:2px}
.ic.c-right::after{right:-3px}
.ic.c-left::before{left:-3px}
.geo-legend{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;font-size:13px;opacity:.75;margin-top:10px}
.save-row{display:flex;gap:8px;margin-bottom:12px}
.save-row .name{flex:1;padding:9px 12px;border-radius:10px;border:1px solid var(--divider-color);background:var(--secondary-background-color);color:inherit;font:inherit}
.lib{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:8px}
.item{display:flex;align-items:center;gap:8px;padding:8px;border-radius:12px;border:1px solid var(--divider-color)}
.item.sel{border-color:var(--primary-color)}
.item .sw{display:flex;width:44px;height:28px;border-radius:6px;overflow:hidden;flex:none}
.item .sw i{flex:1}
.item .meta{flex:1;display:flex;flex-direction:column;font-size:14px;min-width:0}
.item .meta span{font-size:12px;opacity:.65}
.item button{padding:6px 9px}
.toast{margin:0 0 12px;padding:10px 14px;border-radius:10px;font-size:14px}
.toast.ok{background:color-mix(in srgb,var(--success-color,#34c759) 18%,transparent)}
.toast.error{background:color-mix(in srgb,var(--error-color,#ff3b30) 20%,transparent)}
`;

customElements.define("govee-strip-studio-panel", GoveeStripStudioPanel);
