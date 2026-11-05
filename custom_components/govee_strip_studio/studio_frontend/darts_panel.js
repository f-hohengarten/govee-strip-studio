// Darts panel for Govee Strip Studio: Autodarts via darts-caller.
// Caller audio in this browser (on an output device of choice, e.g. a Bluetooth
// speaker), caller voice and announcements, board control, live game and LED reactions.
// Vanilla web component, no build step, no external dependencies.

const WS = "govee_strip_studio/darts";
const SOUND_URL = "/api/govee_strip_studio/darts/sound";
const STORE = "govee-darts-audio"; // per-browser audio settings (localStorage)
const SOUND_CACHE = "govee-darts-sounds-v1"; // Cache Storage: sound files survive page reloads

const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const LANGUAGES = ["Alle Sprachen", "Englisch", "Französisch", "Russisch", "Deutsch", "Spanisch", "Niederländisch", "Italienisch"];
const GENDERS = ["Alle", "Weiblich", "Männlich"];
const CALLER_OPTIONS = [
  { key: "every_dart", label: "Jeden Dart ansagen", values: ["Aus", "Punktzahl", "Feldname (z. B. „Triple 20“)", "Effekt-Sound"] },
  { key: "call_player", label: "Spieler ansagen", values: ["Aus", "Beim Wechsel", "Bei jeder Aufnahme"] },
  { key: "bot_actions", label: "Bot-Würfe ansagen", values: ["Aus", "An"], bool: true },
  { key: "checkout_self", label: "Checkout-Hinweis nur für mich", values: ["Aus", "An"], bool: true },
];
const BOARD = [
  ["board-start", "▶ Start", "Board-Erkennung starten"],
  ["board-stop", "■ Stopp", "Board-Erkennung anhalten"],
  ["board-reset", "↺ Reset", "Erkennung zurücksetzen (z. B. nach Fehlwurf)"],
  ["board-calibrate", "◎ Kalibrieren", "Kameras neu kalibrieren"],
  ["next", "⏭ Nächster", "Zum nächsten Spieler wechseln"],
];
const AUTODARTS = {
  authenticated: ["on", "Autodarts angemeldet"],
  pending: ["warn", "Autodarts-Anmeldung wartet auf Bestätigung"],
  failed: ["bad", "Autodarts-Anmeldung fehlgeschlagen"],
  unreachable: ["bad", "Anmeldestatus nicht abrufbar"],
  unknown: ["off", "Anmeldestatus unbekannt"],
};
const EVENT_LABELS = {
  "match-started": "Match gestartet",
  "darts-thrown": "Aufnahme",
  "darts-pulled": "Darts gezogen",
  busted: "Bust!",
  "game-won": "Leg gewonnen",
  "match-won": "Match gewonnen",
};

// ---------------------------------------------------------------------------------
// Checkout suggestions (double out): the cheapest route by darts used, then by how
// comfortable the finishing double and the set-up darts are.
// ---------------------------------------------------------------------------------
const DOUBLE_RANK = { 20: 0, 16: 1, 8: 2, 18: 3, 12: 4, 10: 4, 4: 6, 6: 6, 14: 6, 2: 8, 25: 9 };
const FIELDS = (() => {
  const out = [];
  for (let n = 20; n >= 1; n--) {
    out.push({ name: `T${n}`, score: 3 * n, cost: n >= 17 ? 20 - n : 6 + (20 - n) / 4 });
    out.push({ name: `S${n}`, score: n, cost: 1 + (20 - n) / 10 });
    out.push({ name: `D${n}`, score: 2 * n, cost: 8, double: true, rank: DOUBLE_RANK[n] ?? 10 + (20 - n) / 4 });
  }
  out.push({ name: "S25", score: 25, cost: 5 });
  out.push({ name: "Bull", score: 50, cost: 6, double: true, rank: DOUBLE_RANK[25] });
  return out;
})();
const DOUBLES = FIELDS.filter((f) => f.double);
const _checkouts = new Map();

function checkout(points, dartsLeft = 3) {
  points = Number(points);
  if (!Number.isInteger(points) || points < 2 || points > 170 || dartsLeft < 1) return null;
  const key = `${points}/${dartsLeft}`;
  if (_checkouts.has(key)) return _checkouts.get(key);
  let best = null;
  const consider = (route, cost) => {
    if (!best || cost < best.cost) best = { route, cost };
  };
  for (const d of DOUBLES) {
    if (d.score === points) consider([d], 1000 + d.rank);
  }
  if (!best && dartsLeft >= 2) {
    for (const a of FIELDS)
      for (const d of DOUBLES)
        if (a.score + d.score === points) consider([a, d], 2000 + d.rank + a.cost);
  }
  if (!best && dartsLeft >= 3) {
    for (const a of FIELDS)
      for (const b of FIELDS)
        if (a.score + b.score < points)
          for (const d of DOUBLES)
            if (a.score + b.score + d.score === points) consider([a, b, d], 3000 + d.rank + a.cost + b.cost);
  }
  const result = best ? best.route.map((f) => f.name) : null;
  _checkouts.set(key, result);
  return result;
}

// ---------------------------------------------------------------------------------
// Dartboard (SVG, millimetres, standard tournament dimensions; 20 at the top).
// ---------------------------------------------------------------------------------
const SEGMENTS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
const R = { bull: 6.35, outerBull: 15.9, tripleIn: 99, tripleOut: 107, doubleIn: 162, doubleOut: 170, numbers: 192, rim: 214 };
// Board Manager beds -> ring radii; darts-caller field prefixes as a fallback.
const BEDS = {
  SingleInner: [R.outerBull, R.tripleIn],
  SingleOuter: [R.tripleOut, R.doubleIn],
  Triple: [R.tripleIn, R.tripleOut],
  Double: [R.doubleIn, R.doubleOut],
};
const PREFIX_BEDS = { s: ["SingleInner", "SingleOuter"], t: ["Triple"], d: ["Double"] };

const polar = (r, deg) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [+(r * Math.cos(a)).toFixed(2), +(r * Math.sin(a)).toFixed(2)];
};
// Annular sector between radii r1..r2, centred on the segment index.
function sector(index, r1, r2) {
  const a1 = index * 18 - 9;
  const a2 = a1 + 18;
  const [x1, y1] = polar(r2, a1);
  const [x2, y2] = polar(r2, a2);
  const [x3, y3] = polar(r1, a2);
  const [x4, y4] = polar(r1, a1);
  return `M${x1} ${y1}A${r2} ${r2} 0 0 1 ${x2} ${y2}L${x3} ${y3}A${r1} ${r1} 0 0 0 ${x4} ${y4}Z`;
}

const BOARD_SVG = (() => {
  let parts = `<circle r="${R.rim}" class="b-rim"/>`;
  SEGMENTS.forEach((n, i) => {
    const dark = i % 2 === 0;
    const single = dark ? "b-dark" : "b-light";
    const ring = dark ? "b-red" : "b-green";
    parts += `<path d="${sector(i, R.doubleIn, R.doubleOut)}" class="${ring}"/>`;
    parts += `<path d="${sector(i, R.tripleOut, R.doubleIn)}" class="${single}"/>`;
    parts += `<path d="${sector(i, R.tripleIn, R.tripleOut)}" class="${ring}"/>`;
    parts += `<path d="${sector(i, R.outerBull, R.tripleIn)}" class="${single}"/>`;
    const [x, y] = polar(R.numbers, i * 18);
    parts += `<text x="${x}" y="${y}" class="b-num">${n}</text>`;
  });
  parts += `<circle r="${R.outerBull}" class="b-green"/><circle r="${R.bull}" class="b-red"/>`;
  parts += `<circle r="${R.doubleOut}" class="b-wire"/>`;
  return parts;
})();

// Highlight for one dart: from Board Manager data (bed + number) or a field name like "t20".
function hitArea(dart) {
  let number = dart.number;
  let beds = dart.bed ? [dart.bed] : [];
  if (!number && dart.field) {
    const m = /^([sdtm])(\d+)$/i.exec(dart.field);
    if (!m || m[1].toLowerCase() === "m") return "";
    number = Number(m[2]);
    beds = PREFIX_BEDS[m[1].toLowerCase()] || [];
  }
  if (number === 25) {
    // Bullseye (50) is the "double" of 25: d25 from darts-caller, bed Double or name Bull/D25 from the board.
    const inner = dart.field ? /^d/i.test(dart.field) : dart.bed === "Double" || /^(bull|d25)$/i.test(dart.name || "");
    return `<circle r="${inner ? R.bull : R.outerBull}" class="b-hit"/>`;
  }
  const index = SEGMENTS.indexOf(number);
  if (index < 0) return "";
  return beds
    .filter((b) => BEDS[b])
    .map((b) => `<path d="${sector(index, ...BEDS[b])}" class="b-hit"/>`)
    .join("");
}

function boardSvg(throws, darts) {
  // Positions need the Board Manager; without it only the hit fields are shown.
  const source = throws.length ? throws : darts.map((d) => ({ field: d.field }));
  const last = source[source.length - 1];
  const marks = throws
    .map((t, i) => `<circle cx="${(t.x * R.doubleOut).toFixed(1)}" cy="${(-t.y * R.doubleOut).toFixed(1)}" r="5.5" class="b-dart ${i === throws.length - 1 ? "last" : ""}"/>`)
    .join("");
  return `<svg viewBox="-220 -220 440 440" class="board-svg" role="img" aria-label="Dartscheibe">
    ${BOARD_SVG}${last ? hitArea(last) : ""}${marks}
  </svg>`;
}

// ---------------------------------------------------------------------------------
// Caller audio: lives as long as the browser tab, not just while the panel is shown,
// so the caller keeps talking while you use other Home Assistant pages.
// ---------------------------------------------------------------------------------
class CallerAudio {
  constructor() {
    let saved = {};
    try {
      saved = JSON.parse(localStorage.getItem(STORE) || "{}");
    } catch (_) {}
    this.enabled = Boolean(saved.enabled);
    this.sinkId = saved.sinkId || "";
    this.sinkLabel = saved.sinkLabel || "";
    this.volume = saved.volume ?? 100;
    this.ctx = null;
    this.gain = null;
    this.buffers = new Map(); // path -> Promise<AudioBuffer>
    this.queue = Promise.resolve();
    this.previousWait = false;
    this.playing = 0;
    this.lastCall = null;
    this.error = null;
    this.hass = null;
    this._unsub = null;
    this.onchange = null;
  }

  get supportsSink() {
    return typeof AudioContext !== "undefined" && "setSinkId" in AudioContext.prototype;
  }
  get suspended() {
    return this.enabled && (!this.ctx || this.ctx.state !== "running");
  }

  _save() {
    try {
      localStorage.setItem(
        STORE,
        JSON.stringify({ enabled: this.enabled, sinkId: this.sinkId, sinkLabel: this.sinkLabel, volume: this.volume }),
      );
    } catch (_) {}
  }
  _changed() {
    this.onchange?.();
  }

  attach(hass) {
    this.hass = hass;
    if (this.enabled && !this._unsub) this._subscribe();
  }

  _subscribe() {
    this._unsub = this.hass.connection.subscribeMessage(
      (ev) => {
        if (ev.type === "play") this.play(ev.files);
      },
      { type: `${WS}/subscribe` },
    );
    this._unsub.catch(() => (this._unsub = null));
  }

  // Must run inside a click: browsers only start audio after a user gesture.
  async start() {
    if (!this.ctx) {
      this.ctx = new AudioContext({ latencyHint: "balanced" });
      this.gain = this.ctx.createGain();
      this.gain.connect(this.ctx.destination);
      this.ctx.onstatechange = () => this._changed();
    }
    this.gain.gain.value = this.volume / 100;
    if (this.sinkId) await this._applySink();
    await this.ctx.resume();
    this._changed();
  }

  async setEnabled(on) {
    this.enabled = on;
    this._save();
    if (on) {
      await this.start();
      if (!this._unsub && this.hass) this._subscribe();
    } else {
      this._unsub?.then((u) => u()).catch(() => {});
      this._unsub = null;
      await this.ctx?.suspend();
    }
    this._changed();
  }

  setVolume(v) {
    this.volume = v;
    if (this.gain) this.gain.gain.value = v / 100;
    this._save();
  }

  async setSink(id, label) {
    this.sinkId = id;
    this.sinkLabel = label || "";
    this._save();
    if (this.ctx) await this._applySink();
    this._changed();
  }

  async _applySink() {
    if (!this.supportsSink) return;
    try {
      await this.ctx.setSinkId(this.sinkId || "");
      this.error = null;
    } catch (err) {
      // The device is gone (e.g. Bluetooth speaker disconnected): fall back to the default output.
      this.error = `Ausgabegerät nicht verfügbar (${err.name || err}) – spiele auf dem Standardgerät`;
      try {
        await this.ctx.setSinkId("");
      } catch (_) {}
    }
  }

  async outputs() {
    if (!navigator.mediaDevices?.enumerateDevices) return [];
    const all = await navigator.mediaDevices.enumerateDevices();
    return all.filter((d) => d.kind === "audiooutput");
  }

  // Chrome only reveals device names after a media permission was granted once.
  async unlockNames() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
  }

  // Sound bytes: memory, then the persistent Cache Storage, then Home Assistant's proxy.
  async _bytes(path) {
    const url = `${SOUND_URL}?path=${encodeURIComponent(path)}`;
    let cache = null;
    try {
      cache = await caches.open(SOUND_CACHE);
      const hit = await cache.match(url);
      if (hit) return hit.arrayBuffer();
    } catch (_) {} // Cache Storage needs a secure context; fall through to the network
    const r = await this.hass.fetchWithAuth(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.arrayBuffer();
    cache?.put(url, new Response(data.slice(0), { headers: { "Content-Type": r.headers.get("Content-Type") || "audio/mpeg" } })).catch(() => {});
    return data;
  }

  // Keys are decoded paths: darts-caller and the prefetch may encode the same path differently.
  _load(path) {
    const key = decodeURIComponent(path);
    if (!this.buffers.has(key)) {
      const job = this._bytes(path).then((data) => this.ctx.decodeAudioData(data));
      job.catch(() => this.buffers.delete(key)); // retry next time
      this.buffers.set(key, job);
      if (this.buffers.size > 600) this.buffers.delete(this.buffers.keys().next().value);
    }
    return this.buffers.get(key);
  }

  // After the first call of a voice, fetch its score calls (0–180) in the background,
  // so the next announcements start without a network round trip.
  _prefetch(file) {
    const full = decodeURIComponent(file.path);
    const cut = full.lastIndexOf("/");
    const ext = (/\.[a-z0-9]+$/i.exec(full) || [".mp3"])[0];
    const folder = full.slice(0, cut + 1);
    if (cut < 0 || (this._prefetched ||= new Set()).has(folder)) return;
    this._prefetched.add(folder);
    const queue = Array.from({ length: 181 }, (_, n) => encodeURIComponent(`${folder}${n}${ext}`));
    const worker = async () => {
      while (queue.length && this.enabled) {
        await this._load(queue.shift()).catch(() => {}); // missing numbers are fine
      }
    };
    for (let i = 0; i < 3; i++) worker();
  }

  async _playOne(file) {
    if (file.skip_if_busy && this.playing) return;
    const buffer = await this._load(file.path);
    await new Promise((resolve) => {
      const src = this.ctx.createBufferSource();
      const gain = this.ctx.createGain();
      gain.gain.value = file.volume ?? 1;
      src.buffer = buffer;
      src.connect(gain).connect(this.gain);
      this.playing += 1;
      src.onended = () => {
        this.playing -= 1;
        resolve();
      };
      src.start();
    });
  }

  // Same ordering as darts-caller's own web caller: every announcement waits until the
  // previous one has finished (its first file is chained), files flagged "wait" and the
  // one after them are chained too, the rest start together with their predecessor.
  play(files) {
    if (!this.enabled || !this.ctx) return;
    if (this.ctx.state !== "running") this.ctx.resume().catch(() => {});
    this.previousWait = true;
    for (const file of files) {
      // Fetch everything in parallel right away; only the playback is sequenced.
      this._load(file.path).catch(() => {});
      this._prefetch(file);
      const run = () =>
        this._playOne(file).catch((err) => {
          this.error = `Ton „${file.name}“ nicht abspielbar: ${err.message || err}`;
          this._changed();
        });
      if (file.wait || this.previousWait) this.queue = this.queue.then(run);
      else run();
      this.previousWait = file.wait;
      this.lastCall = file.name.replace(/\.[a-z0-9]+$/i, "").replace(/\+/g, " ");
    }
    this._changed();
  }

  // A short two-tone chime, generated locally: checks the output device without darts-caller.
  async testTone() {
    await this.start();
    const t = this.ctx.currentTime;
    [660, 880].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.frequency.value = f;
      g.gain.setValueAtTime(0, t + i * 0.18);
      g.gain.linearRampToValueAtTime(0.4, t + i * 0.18 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.18 + 0.35);
      osc.connect(g).connect(this.gain);
      osc.start(t + i * 0.18);
      osc.stop(t + i * 0.18 + 0.4);
    });
  }
}

const AUDIO = (window.__goveeDartsAudio ||= new CallerAudio());

// ---------------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------------
class GoveeDartsPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._info = null;
    this._draft = null;
    this._dirty = false;
    this._outputs = [];
    this._message = null;
    this._pendingRender = false;
    this._view = "play"; // play | settings
    this._tab = "audio";
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    AUDIO.attach(hass);
    if (first) this._init();
  }
  set narrow(v) {
    this._narrow = v;
  }

  connectedCallback() {
    AUDIO.onchange = () => this._renderAudio();
    this._tick = setInterval(() => this._renderLive(), 1000);
    navigator.mediaDevices?.addEventListener?.("devicechange", this._onDevices);
    if (this._info && !this._unsub) this._subscribe();
  }
  disconnectedCallback() {
    AUDIO.onchange = null;
    clearInterval(this._tick);
    navigator.mediaDevices?.removeEventListener?.("devicechange", this._onDevices);
    this._unsub?.then((u) => u()).catch(() => {});
    this._unsub = null;
  }
  _onDevices = () => this._loadOutputs().then(() => this._renderAudio());

  async _init() {
    try {
      this._info = await this._hass.callWS({ type: `${WS}/info` });
    } catch (err) {
      this._message = { kind: "error", text: `Darts nicht erreichbar: ${err.message || err}` };
      this._render();
      return;
    }
    this._resetDraft();
    await this._loadOutputs();
    this._subscribe();
    this._render();
  }

  _subscribe() {
    this._unsub = this._hass.connection.subscribeMessage((ev) => this._onEvent(ev), { type: `${WS}/subscribe` });
  }

  _onEvent(ev) {
    if (ev.type === "status") {
      this._info.status = ev.status;
      if (!this._dirty) this._resetDraft();
      this._scheduleRender();
    } else if (ev.type === "game") {
      this._info.status.game = ev.game;
      this._gameAt = Date.now();
      this._renderLive();
    } else if (ev.type === "throws") {
      this._info.status.throws = ev.throws;
      this._renderLive();
    } else if (ev.type === "play") {
      this._renderLive();
    }
  }

  // Never re-render under the user's fingers: wait until no field has focus.
  _scheduleRender() {
    const active = this.shadowRoot.activeElement;
    if (active && /^(INPUT|SELECT)$/.test(active.tagName)) {
      if (!this._pendingRender) {
        this._pendingRender = true;
        active.addEventListener(
          "blur",
          () => {
            this._pendingRender = false;
            this._render();
          },
          { once: true },
        );
      }
      return;
    }
    this._render();
  }

  _resetDraft() {
    const s = this._info.status;
    this._draft = {
      enabled: Boolean(s.enabled),
      host: s.host || "",
      port: s.port || 8079,
      entry_id: s.entry_id || this._info.devices[0]?.entry_id || null,
      rules: JSON.parse(JSON.stringify(s.rules || {})),
    };
    this._dirty = false;
  }

  async _loadOutputs() {
    try {
      this._outputs = await AUDIO.outputs();
    } catch (_) {
      this._outputs = [];
    }
  }

  _toast(kind, text) {
    this._message = { kind, text };
    this._renderToast();
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      this._message = null;
      this._renderToast();
    }, 4500);
  }

  async _call(msg) {
    try {
      return await this._hass.callWS(msg);
    } catch (err) {
      this._toast("error", err.message || String(err));
      throw err;
    }
  }

  // ---------- actions ----------
  async _saveConfig(extra = {}) {
    const status = await this._call({ type: `${WS}/set`, config: { ...this._draft, ...extra } });
    this._info.status = status;
    this._resetDraft();
    this._render();
  }

  async _setOption(key, value) {
    const status = await this._call({ type: `${WS}/caller`, options: { [key]: value } });
    this._info.status = status;
    this._render();
  }

  async _command(cmd, done) {
    await this._call({ type: `${WS}/command`, command: cmd });
    if (done) this._toast("ok", done);
  }

  async _presets() {
    const ok = confirm(
      "Fertige Darts-Effekte anlegen (z. B. Regenbogen bei 180, rotes Pulsieren bei Bust, Farbe pro Spieler)?\n\n" +
        "Sie werden nur Ereignissen zugeordnet, die noch leer sind. Deine eigenen Zuordnungen bleiben unverändert.",
    );
    if (!ok) return;
    if (this._dirty) await this._saveConfig();
    const res = await this._call({ type: `${WS}/presets` });
    Object.assign(this._info, { status: res.status, effects: res.effects });
    this._resetDraft();
    this._render();
    this._toast(
      "ok",
      res.added.length || res.assigned.length
        ? `${res.added.length} Effekte angelegt, ${res.assigned.length} Ereignisse belegt – teste sie mit ▶`
        : "Alle Vorlagen sind schon vorhanden",
    );
  }

  async _test(trigger) {
    if (this._dirty) await this._saveConfig();
    await this._call({ type: `${WS}/simulate`, trigger });
  }

  _go(path) {
    history.pushState(null, "", path);
    window.dispatchEvent(new CustomEvent("location-changed"));
  }

  // ---------- rendering ----------
  _dot(kind, text, title = "") {
    return `<span class="dot ${kind}" title="${esc(title || text)}"><i></i><span>${text}</span></span>`;
  }

  // Compact status: three dots; the words only show where something needs attention.
  _statusDots() {
    const s = this._info.status;
    const feed = s.feed;
    const out = [];
    if (!s.host) out.push(this._dot("bad", "darts-caller einrichten"));
    else if (feed?.connected) out.push(this._dot("on", "darts-caller", "darts-caller verbunden"));
    else out.push(this._dot("bad", "darts-caller getrennt", feed?.error || ""));
    if (s.host && feed?.connected) {
      const [kind, text] = AUTODARTS[s.autodarts?.state] || AUTODARTS.unknown;
      out.push(this._dot(kind, kind === "on" ? "Autodarts" : text, [text, s.autodarts?.error].filter(Boolean).join(": ")));
    }
    return out.join("");
  }

  _alerts() {
    const s = this._info.status;
    const state = s.autodarts?.state;
    if (s.feed?.connected && (state === "failed" || state === "unreachable")) {
      return `<div class="alert">
        <b>darts-caller ist nicht bei Autodarts angemeldet</b> – ohne Anmeldung kommen keine Würfe an.
        Starte darts-caller neu: <code>sudo systemctl restart darts-caller</code>
        ${s.autodarts?.error ? `<details><summary>Details</summary><code>${esc(s.autodarts.error).slice(0, 300)}</code></details>` : ""}
      </div>`;
    }
    if (state === "pending") {
      return `<div class="alert warn">darts-caller wartet auf deine Autodarts-Bestätigung. Öffne
        <a href="https://${esc(s.host)}:${esc(s.port)}/" target="_blank" rel="noopener">die darts-caller-Seite</a> und folge dem Code.</div>`;
    }
    if (!s.host) {
      return `<div class="alert warn">Noch keine Verbindung eingerichtet. <button data-open="board">Jetzt einrichten</button></div>`;
    }
    return "";
  }

  // The game view: the visit on top, the player in the middle (like Autodarts' own screen).
  _stage() {
    const g = this._info.status.game || {};
    const has = Object.keys(g).length > 0;
    const darts = g.darts || [];
    const sum = darts.reduce((t, d) => t + (Number(d.value) || 0), 0);
    const total = g.event === "darts-thrown" && g.visit != null ? g.visit : darts.length ? sum : "";
    const slots = [0, 1, 2]
      .map((i) => `<div class="slot ${darts[i] ? "hit" : ""}">${darts[i] ? esc((darts[i].field || "").toUpperCase() || darts[i].value) : ""}</div>`)
      .join("");
    const label = EVENT_LABELS[g.event] || "";
    // Darts still to throw in this visit: after dart 1 or 2 of a visit, the rest of it.
    const thrown = /^dart([12])-thrown$/.exec(g.event || "");
    const left = thrown ? 3 - Number(thrown[1]) : 3;
    const route = has && g.points_left != null ? checkout(g.points_left, left) : null;
    const finish =
      has && Number(g.points_left) <= 170 && Number(g.points_left) > 1
        ? route
          ? `<div class="finish">${route.map((f) => `<span>${f}</span>`).join("")}</div>`
          : `<div class="finish none">${left < 3 ? `Kein Finish mit ${left} ${left === 1 ? "Dart" : "Darts"}` : "Kein Finish möglich"}</div>`
        : "";
    const bad = g.event === "busted";
    const won = g.event === "game-won" || g.event === "match-won";
    const throws = this._info.status.throws || [];
    return `<div class="visit">${slots}<div class="slot total">${esc(total)}</div></div>
      <div class="arena">
      <div class="playercard ${bad ? "bust" : ""} ${won ? "won" : ""} ${has ? "" : "idle"}">
        <div class="tag">${has && g.player ? `<i></i>${esc(g.player)}` : "Kein laufendes Spiel"}</div>
        <div class="points">${has && g.points_left != null ? esc(g.points_left) : "–"}</div>
        ${finish}
        <div class="sub">${esc(label)}${g.mode ? `<span class="mode">${esc(g.mode)}</span>` : ""}</div>
      </div>
      <div class="board-wrap">${boardSvg(throws, has ? darts : [])}</div>
      </div>
      <div class="lastcall">${AUDIO.enabled && AUDIO.lastCall ? `🔊 ${esc(AUDIO.lastCall)}` : ""}</div>`;
  }

  _sinkOptions() {
    const options = this._outputs
      .map((d) => {
        const isDefault = !d.deviceId || d.deviceId === "default";
        const label = d.label || (isDefault ? "Standard" : `Gerät ${d.deviceId.slice(0, 6)}`);
        const id = isDefault ? "" : d.deviceId;
        return `<option value="${esc(id)}" data-label="${esc(label)}" ${id === AUDIO.sinkId ? "selected" : ""}>${esc(label)}</option>`;
      })
      .join("");
    const missing =
      AUDIO.sinkId && !this._outputs.some((d) => d.deviceId === AUDIO.sinkId)
        ? `<option value="${esc(AUDIO.sinkId)}" selected>${esc(AUDIO.sinkLabel || "Gespeichertes Gerät")} (nicht verbunden)</option>`
        : "";
    return missing + (options || `<option value="">Standard</option>`);
  }

  // The bar under the game: only what you touch while playing.
  _controls() {
    const s = this._info.status;
    const on = AUDIO.enabled;
    const disabled = this._connected() ? "" : "disabled";
    return `<button class="round ${on ? "on" : ""}" data-audio="toggle" title="${on ? "Caller in diesem Browser aus" : "Caller in diesem Browser an"}">${on ? "🔊" : "🔇"}</button>
      ${
        on && AUDIO.suspended
          ? `<button class="primary" data-audio="resume">Ton aktivieren</button>`
          : on
            ? `${AUDIO.supportsSink ? `<select class="sink" data-audio="sink" title="Ausgabegerät">${this._sinkOptions()}</select>` : ""}
               <label class="volbox" title="Lautstärke"><input type="range" min="0" max="150" step="5" value="${AUDIO.volume}" data-audio="volume"/><b class="vol">${AUDIO.volume} %</b></label>`
            : `<span class="muted small">Caller aus</span>`
      }
      <span class="spacer"></span>
      <label class="switch" title="LED-Reaktionen auf Würfe"><input type="checkbox" data-led="enabled" ${s.enabled ? "checked" : ""} ${s.host ? "" : "disabled"}/><span></span> 💡</label>
      <button data-cmd="board-reset" title="Erkennung zurücksetzen" ${disabled}>↺</button>
      <button class="primary" data-cmd="next" title="Zum nächsten Spieler" ${disabled}>Weiter</button>
      ${AUDIO.error && on ? `<p class="warn full">${esc(AUDIO.error)}</p>` : ""}`;
  }

  _audioCard() {
    const supported = AUDIO.supportsSink;
    const named = this._outputs.some((d) => d.label);
    return `<p class="hint">Spielt die Ansagen von darts-caller hier ab – auf dem Ausgabegerät deiner Wahl, z. B. deinem per Bluetooth gekoppelten Echo Dot. Autodarts im anderen Tab bleibt auf den Laptop-Lautsprechern.</p>
      <label class="switch big"><input type="checkbox" data-audio="enabled" ${AUDIO.enabled ? "checked" : ""}/><span></span> Caller hier abspielen</label>
      ${
        AUDIO.suspended
          ? `<button class="primary wide-btn" data-audio="resume">🔈 Ton aktivieren</button><p class="hint">Der Browser startet Ton erst nach einem Klick – einmal pro Seitenaufruf.</p>`
          : ""
      }
      <div class="field">
        <span>Ausgabegerät</span>
        ${
          supported
            ? `<select data-audio="sink">${this._sinkOptions()}</select>`
            : `<span class="hint">Dieser Browser kann kein Ausgabegerät wählen – nutze Chrome oder Edge, oder stelle das Gerät im System ein.</span>`
        }
      </div>
      ${
        supported && !named
          ? `<button data-audio="unlock" class="wide-btn">Gerätenamen anzeigen</button><p class="hint">Chrome zeigt die Namen erst nach einer einmaligen Mikrofon-Freigabe. Das Mikrofon wird dabei nicht genutzt.</p>`
          : ""
      }
      <label class="field volbox"><span>Lautstärke</span><input type="range" min="0" max="150" step="5" value="${AUDIO.volume}" data-audio="volume"/><b class="vol">${AUDIO.volume} %</b></label>
      <div class="actions">
        <button data-audio="tone">♪ Testton</button>
        <button data-cmd="call:hi" data-done="Probe-Ansage angefordert" ${this._connected() ? "" : "disabled"}>🗣 Probe-Ansage</button>
      </div>
      ${AUDIO.error ? `<p class="warn">${esc(AUDIO.error)}</p>` : ""}
      <p class="hint small">Der Tab muss geöffnet bleiben. Andere Seiten in Home Assistant kannst du dabei nutzen.</p>`;
  }

  _connected() {
    return Boolean(this._info.status.feed?.connected);
  }

  _callerCard() {
    const s = this._info.status;
    const opts = s.caller || {};
    const callers = s.callers || {};
    const fav = new Set(callers.favoured || []);
    const available = [...(callers.available || [])].sort((a, b) => fav.has(b) - fav.has(a));
    const current = callers.current || opts.voice || "";
    if (current && !available.includes(current)) available.unshift(current);
    const disabled = this._connected() ? "" : "disabled";
    const voiceLabel = (v) =>
      v
        .split("-")
        .map((p, i) => (i < 2 ? p.toUpperCase() : p.charAt(0).toUpperCase() + p.slice(1)))
        .join(" · ")
        .replace(/^(\w+) · (\w+) · /, "$1-$2 · ");
    const sel = (key, labels, bool = false) => {
      const value = opts[key];
      const cur = value == null ? "" : bool ? (value ? "1" : "0") : String(value);
      return `<select data-opt="${key}" ${bool ? 'data-bool="1"' : ""} ${disabled}>
        <option value="" ${cur === "" ? "selected" : ""}>Wie darts-caller</option>
        ${labels.map((l, i) => `<option value="${i}" ${cur === String(i) ? "selected" : ""}>${esc(l)}</option>`).join("")}
      </select>`;
    };
    return `<div class="voice">
        <select data-opt="voice" ${disabled}>
          ${available.length ? "" : `<option value="">Keine Stimmen gemeldet</option>`}
          ${available.map((c) => `<option value="${esc(c)}" ${c === current ? "selected" : ""}>${fav.has(c) ? "★ " : ""}${esc(voiceLabel(c))}</option>`).join("")}
        </select>
        <button class="star ${fav.has(current) ? "on" : ""}" data-cmd="${fav.has(current) ? "fav:0" : "fav:1"}" title="Favorit" ${disabled || current ? disabled : "disabled"}>${fav.has(current) ? "★" : "☆"}</button>
      </div>
      <div class="opts">
        <label class="field"><span>Sprache</span>${sel("language", LANGUAGES)}</label>
        <label class="field"><span>Stimme</span>${sel("gender", GENDERS)}</label>
        ${CALLER_OPTIONS.map((o) => `<label class="field"><span>${o.label}</span>${sel(o.key, o.values, o.bool)}</label>`).join("")}
        <label class="field"><span>Mögliches Checkout ansagen</span>
          <input type="number" min="0" max="100" placeholder="wie darts-caller" value="${opts.checkout_calls ?? ""}" data-opt="checkout_calls" ${disabled} title="Wie oft pro Leg (0 = nie)"/></label>
      </div>
      <p class="hint small">Einstellungen gelten sofort und werden nach einem Neustart von darts-caller automatisch wieder gesetzt. Die Auswahl hängt von den Sprachpaketen auf dem darts-caller-Rechner ab.</p>`;
  }

  _boardCard() {
    const disabled = this._connected() ? "" : "disabled";
    return `<h3>Board</h3>
      <div class="board">${BOARD.map(([cmd, label, title]) => `<button data-cmd="${cmd}" title="${title}" ${disabled}>${label}</button>`).join("")}</div>`;
  }

  _ledCard() {
    const d = this._draft;
    const info = this._info;
    const all = Object.entries(info.effects || {});
    const darts = all.filter(([, e]) => e.group === info.darts_group);
    const own = all.filter(([, e]) => e.group !== info.darts_group);
    const stateTriggers = new Set(info.state_triggers || []);
    const opts = (list, selected) =>
      list
        .map(([id, e]) => `<option value="${esc(id)}" ${id === selected ? "selected" : ""}>${esc((e.name || id).replace(/^Darts · /, ""))}</option>`)
        .join("");
    const options = (selected) =>
      `<option value="">— nichts —</option>` +
      (darts.length ? `<optgroup label="Darts-Effekte">${opts(darts, selected)}</optgroup>` : "") +
      (own.length ? `<optgroup label="Meine Effekte">${opts(own, selected)}</optgroup>` : "");
    const rows = (items) =>
      items
        .map(([id, label]) => {
          const rule = d.rules[id] || {};
          const timed = !stateTriggers.has(id);
          const active = info.status.active === id && d.enabled;
          return `<div class="row ${active ? "active" : ""}">
            <span>${esc(label)}</span>
            <select data-rule="${id}">${options(rule.effect_id)}</select>
            ${
              timed
                ? `<label class="dur"><input type="number" min="0.5" max="60" step="0.5" value="${rule.duration ?? info.default_duration}" data-dur="${id}" ${rule.effect_id ? "" : "disabled"}/> s</label>`
                : `<span class="dur muted" title="Bleibt, bis das nächste Ereignis kommt">bleibt</span>`
            }
            <button data-test="${id}" title="Auf dem Streifen testen" ${rule.effect_id ? "" : "disabled"}>▶</button>
            <button data-edit="${esc(rule.effect_id || "")}" title="Effekt im Strip Studio bearbeiten" ${rule.effect_id ? "" : "disabled"}>✎</button>
          </div>`;
        })
        .join("");
    return `<label class="switch big"><input type="checkbox" data-led="enabled" ${d.enabled ? "checked" : ""} ${d.host ? "" : "disabled"}/><span></span> LED-Reaktionen ${d.enabled ? "an" : "aus"}</label>
      <p class="hint">Spielt bei Würfen und Spielereignissen gespeicherte Strip-Studio-Effekte. Kurze Effekte kehren danach zur Farbe des Spielers zurück, der dran ist.</p>
      <div class="inline">
        ${
          info.devices.length
            ? `<label class="field"><span>Streifen</span><select data-led="entry_id">${info.devices
                .map((x) => `<option value="${esc(x.entry_id)}" ${x.entry_id === d.entry_id ? "selected" : ""}>${esc(x.title)}</option>`)
                .join("")}</select></label>`
            : `<span class="warn">Kein LED-Streifen geladen.</span>`
        }
        <div class="actions">
          <button data-act="presets" title="Fertige Effekte anlegen und leeren Ereignissen zuordnen">✨ Vorlagen anlegen</button>
          <button data-act="studio">Effekte im Strip Studio</button>
          <button class="primary" data-act="save" ${this._dirty ? "" : "disabled"}>Speichern</button>
        </div>
      </div>
      <div class="groups ${d.enabled ? "" : "dim"}">${info.triggers
        .map(([group, items]) => `<div><h3>${esc(group)}</h3>${rows(items)}</div>`)
        .join("")}</div>`;
  }

  _connCard() {
    const d = this._draft;
    const feed = this._info.status.feed;
    return `<h3>Verbindung</h3>
      <p class="hint">Adresse des Rechners, auf dem darts-caller läuft.</p>
      <div class="inline">
        <label class="field"><span>darts-caller</span><input class="text" data-conn="host" placeholder="192.168.1.130" value="${esc(d.host)}"/></label>
        <label class="field"><span>Port</span><input class="text port" type="number" data-conn="port" value="${esc(d.port)}"/></label>
        <button class="primary" data-act="save" ${this._dirty ? "" : "disabled"}>Speichern</button>
      </div>
      ${feed && !feed.connected && feed.error ? `<p class="warn">Nicht verbunden: ${esc(feed.error)} – neuer Versuch läuft</p>` : ""}
      ${d.host ? `<p class="hint small"><a href="https://${esc(d.host)}:${esc(d.port)}/" target="_blank" rel="noopener">Original-Oberfläche von darts-caller öffnen ↗</a></p>` : ""}`;
  }

  _render() {
    const root = this.shadowRoot;
    if (!this._info) {
      root.innerHTML = `<style>${STYLE}</style><div class="page"><header><ha-menu-button></ha-menu-button><div class="title">Darts</div></header>${
        this._message ? `<div class="toast error">${esc(this._message.text)}</div>` : `<div class="card">Lade …</div>`
      }</div>`;
      this._menu();
      return;
    }
    const settings = this._view === "settings";
    const tabs = [
      ["audio", "🔊 Ton", () => this._audioCard()],
      ["caller", "🗣 Caller", () => this._callerCard()],
      ["led", "💡 LED", () => this._ledCard()],
      ["board", "🎯 Board & Verbindung", () => this._boardCard() + this._connCard()],
    ];
    const tab = tabs.find(([id]) => id === this._tab) || tabs[0];
    root.innerHTML = `<style>${STYLE}</style>
      <div class="page ${settings ? "settings" : "play"}">
        <header>
          <ha-menu-button></ha-menu-button>
          ${settings ? `<button class="ghost" data-act="back" title="Zurück zum Spiel">←</button>` : ""}
          <div class="title">${settings ? "Einstellungen" : "Darts"}</div>
          <div class="dots">${this._statusDots()}</div>
          ${settings ? "" : `<button class="ghost gear" data-act="settings" title="Einstellungen">⚙</button>`}
        </header>
        <div class="toast-slot"></div>
        ${
          settings
            ? `<nav class="tabs">${tabs.map(([id, label]) => `<button class="${id === tab[0] ? "sel" : ""}" data-tab="${id}">${label}</button>`).join("")}</nav>
               <section class="card sheet ${tab[0] === "audio" ? "audio" : ""}">${tab[2]()}</section>`
            : `${this._alerts()}
               <main class="stage live">${this._stage()}</main>
               <div class="controls">${this._controls()}</div>`
        }
      </div>`;
    this._menu();
    this._renderToast();
    this._bind();
  }

  _menu() {
    const menu = this.shadowRoot.querySelector("ha-menu-button");
    if (menu) {
      menu.hass = this._hass;
      menu.narrow = this._narrow;
    }
  }

  _renderToast() {
    const slot = this.shadowRoot.querySelector(".toast-slot");
    if (slot) slot.innerHTML = this._message ? `<div class="toast ${this._message.kind}">${esc(this._message.text)}</div>` : "";
  }
  _renderLive() {
    const el = this.shadowRoot.querySelector(".live");
    if (el && this._info) el.innerHTML = this._stage();
  }
  _renderAudio() {
    if (!this._info) return;
    const active = this.shadowRoot.activeElement;
    for (const [sel, html] of [
      [".controls", () => this._controls()],
      [".audio", () => this._audioCard()],
    ]) {
      const el = this.shadowRoot.querySelector(sel);
      if (!el || (active && el.contains(active) && /^(INPUT|SELECT)$/.test(active.tagName))) continue; // in use
      el.innerHTML = html();
      this._bind(el);
    }
  }

  _bind(scope = this.shadowRoot) {
    const on = (sel, ev, fn) => scope.querySelectorAll(sel).forEach((el) => el.addEventListener(ev, fn));
    const ignore = () => {};
    // audio (per browser)
    on("[data-audio=enabled]", "change", (ev) =>
      AUDIO.setEnabled(ev.target.checked).catch((err) => this._toast("error", `Ton konnte nicht starten: ${err.message || err}`)),
    );
    on("[data-audio=toggle]", "click", () =>
      AUDIO.setEnabled(!AUDIO.enabled).catch((err) => this._toast("error", `Ton konnte nicht starten: ${err.message || err}`)),
    );
    on("[data-audio=resume]", "click", () => AUDIO.start().catch(ignore));
    on("[data-audio=sink]", "change", (ev) => {
      const opt = ev.target.selectedOptions[0];
      AUDIO.setSink(ev.target.value, opt?.dataset.label).then(() => AUDIO.testTone()).catch(ignore);
    });
    on("[data-audio=unlock]", "click", () =>
      AUDIO.unlockNames()
        .then(() => this._loadOutputs())
        .then(() => this._renderAudio())
        .catch((err) => this._toast("error", `Freigabe abgelehnt: ${err.message || err}`)),
    );
    on("[data-audio=volume]", "input", (ev) => {
      AUDIO.setVolume(Number(ev.target.value));
      const label = ev.target.closest(".volbox")?.querySelector(".vol");
      if (label) label.textContent = `${ev.target.value} %`;
    });
    on("[data-audio=tone]", "click", () => AUDIO.testTone().catch((err) => this._toast("error", err.message || String(err))));
    // caller + board commands
    on("[data-cmd]", "click", (ev) => this._command(ev.currentTarget.dataset.cmd, ev.currentTarget.dataset.done).catch(ignore));
    on("[data-led=enabled]", "change", (ev) => {
      this._draft.enabled = ev.target.checked;
      this._saveConfig()
        .then(() => this._toast("ok", ev.target.checked ? "LED-Reaktionen an" : "LED-Reaktionen aus"))
        .catch(() => this._render());
    });
    if (scope !== this.shadowRoot) return;
    // navigation
    on("[data-act=settings]", "click", () => {
      this._view = "settings";
      this._render();
    });
    on("[data-act=back]", "click", () => {
      this._view = "play";
      this._render();
    });
    on("[data-tab]", "click", (ev) => {
      this._tab = ev.currentTarget.dataset.tab;
      this._render();
    });
    on("[data-open]", "click", (ev) => {
      this._view = "settings";
      this._tab = ev.currentTarget.dataset.open;
      this._render();
    });
    on("[data-opt]", "change", (ev) => {
      const t = ev.target;
      let value = t.value === "" ? null : t.dataset.opt === "voice" ? t.value : Number(t.value);
      if (t.dataset.bool && value != null) value = value === 1;
      this._setOption(t.dataset.opt, value).catch(ignore);
    });
    // connection + LED settings
    const dirty = () => {
      this._dirty = true;
      this.shadowRoot.querySelectorAll("[data-act=save]").forEach((b) => (b.disabled = false));
    };
    on("[data-conn]", "input", (ev) => {
      const k = ev.target.dataset.conn;
      this._draft[k] = k === "port" ? Number(ev.target.value) : ev.target.value.trim();
      dirty();
    });
    on("[data-led=entry_id]", "change", (ev) => {
      this._draft.entry_id = ev.target.value;
      dirty();
    });
    on("[data-rule]", "change", (ev) => {
      const id = ev.target.dataset.rule;
      if (ev.target.value) this._draft.rules[id] = { ...(this._draft.rules[id] || {}), effect_id: ev.target.value };
      else delete this._draft.rules[id];
      dirty();
      this._render();
    });
    on("[data-dur]", "change", (ev) => {
      const rule = this._draft.rules[ev.target.dataset.dur];
      if (rule) rule.duration = Number(ev.target.value);
      dirty();
    });
    on("[data-test]", "click", (ev) => this._test(ev.currentTarget.dataset.test).catch(ignore));
    on("[data-edit]", "click", (ev) => this._go(`/strip-studio?edit=${encodeURIComponent(ev.currentTarget.dataset.edit)}`));
    on("[data-act=save]", "click", () => this._saveConfig().then(() => this._toast("ok", "Gespeichert")).catch(ignore));
    on("[data-act=presets]", "click", () => this._presets().catch(ignore));
    on("[data-act=studio]", "click", () => this._go("/strip-studio"));
  }
}

const STYLE = `
:host{display:block;color:var(--primary-text-color);background:var(--primary-background-color);min-height:100vh;font-family:var(--paper-font-body1_-_font-family,Roboto,system-ui,sans-serif)}
.page{max-width:1100px;margin:0 auto;padding:0 16px 32px}
.page.play{display:flex;flex-direction:column;min-height:100vh;box-sizing:border-box;padding-bottom:0}
header{display:flex;align-items:center;gap:10px;min-height:56px;position:sticky;top:0;z-index:2;background:var(--app-header-background-color,var(--primary-background-color));color:var(--app-header-text-color,var(--primary-text-color));margin:0 -16px;padding:4px 16px}
.title{font-size:20px;font-weight:500}
.dots{display:flex;gap:14px;margin-left:auto;font-size:13px}
.dot{display:inline-flex;align-items:center;gap:6px;opacity:.8}
.dot i{width:9px;height:9px;border-radius:50%;background:var(--disabled-text-color,#888)}
.dot.on i{background:var(--success-color,#2e7d32)}
.dot.warn i{background:var(--warning-color,#f9a825)}
.dot.bad i{background:var(--error-color,#c62828)}
.dot.bad,.dot.warn{opacity:1}
.ghost{background:none;border:none;font-size:20px;padding:6px 10px}
.gear{margin-left:4px}
@media (max-width:600px){.dot.on span{display:none}}
.card{background:var(--ha-card-background,var(--card-background-color));border-radius:var(--ha-card-border-radius,16px);padding:18px 20px;border:1px solid var(--divider-color);min-width:0}
h3{font-size:12px;text-transform:uppercase;letter-spacing:.07em;opacity:.6;margin:18px 0 8px;font-weight:500}
h3:first-child{margin-top:0}
.hint{font-size:13px;opacity:.7;margin:0 0 12px;line-height:1.45}
.hint.small{font-size:12px;margin:10px 0 0}
.small{font-size:13px}
.warn{color:var(--warning-color,#f9a825);font-size:13px}
a{color:var(--primary-color)}
code{font-size:12px;background:var(--secondary-background-color);padding:1px 6px;border-radius:6px;word-break:break-word}
button{font:inherit;font-size:14px;color:inherit;background:var(--secondary-background-color);border:1px solid var(--divider-color);border-radius:10px;padding:8px 14px;cursor:pointer;transition:border-color .15s,background .15s}
button:hover:not(:disabled){border-color:var(--primary-color)}
button:disabled{opacity:.4;cursor:default}
button.primary{background:var(--primary-color);color:var(--text-primary-color,#fff);border-color:var(--primary-color)}
button.ghost{background:none;border:none}
.wide-btn{width:100%;margin-top:10px}
select,input.text,input[type=number]{font:inherit;font-size:14px;padding:8px 10px;border-radius:10px;border:1px solid var(--divider-color);background:var(--secondary-background-color);color:inherit;min-width:0}
.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.inline{display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end}
.inline .actions{margin-top:0;margin-left:auto}
.field{display:flex;flex-direction:column;gap:5px;font-size:13px;margin-top:12px;min-width:0}
.field > span:first-child{opacity:.7}
.inline .field{margin-top:0}
.text{width:170px}.port{width:90px}
.toast{margin-top:12px;padding:10px 14px;border-radius:12px;font-size:14px}
.toast.ok{background:color-mix(in srgb,var(--success-color,#2e7d32) 18%,transparent)}
.toast.error{background:color-mix(in srgb,var(--error-color,#c62828) 18%,transparent)}
.alert{margin-top:12px;padding:12px 16px;border-radius:14px;font-size:14px;line-height:1.6;background:color-mix(in srgb,var(--error-color,#c62828) 14%,transparent);border:1px solid color-mix(in srgb,var(--error-color,#c62828) 40%,transparent)}
.alert.warn{color:inherit;background:color-mix(in srgb,var(--warning-color,#f9a825) 14%,transparent);border-color:color-mix(in srgb,var(--warning-color,#f9a825) 40%,transparent)}
.alert button{margin-left:8px;padding:4px 10px}
details{margin-top:4px;font-size:12px}
/* game view */
.stage{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;padding:24px 0}
.visit{display:grid;grid-template-columns:repeat(3,1fr) auto;width:min(760px,100%);border-radius:16px;overflow:hidden;background:var(--ha-card-background,var(--card-background-color));border:1px solid var(--divider-color)}
.slot{height:76px;display:flex;align-items:center;justify-content:center;font-size:clamp(24px,5vw,40px);font-weight:700;letter-spacing:.02em;font-variant-numeric:tabular-nums;color:var(--secondary-text-color)}
.slot.hit{color:var(--primary-text-color)}
.slot.total{min-width:110px;padding:0 20px;border-left:1px solid var(--divider-color);color:var(--primary-text-color)}
.arena{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:32px;align-items:center;width:100%}
.arena .playercard{justify-self:end}
@media (max-width:800px){.arena{grid-template-columns:1fr}.arena .playercard{justify-self:center}}
.board-wrap{width:min(520px,100%);justify-self:start}
@media (max-width:800px){.board-wrap{justify-self:center}}
.board-svg{width:100%;height:auto;display:block;filter:drop-shadow(0 0 24px color-mix(in srgb,var(--success-color,#2e7d32) 25%,transparent))}
.b-rim{fill:#141414;stroke:color-mix(in srgb,var(--success-color,#43a047) 70%,#fff);stroke-width:2.5}
.b-dark{fill:#1b1b1b;stroke:#8a8a8a;stroke-width:.6}
.b-light{fill:#eadcc2;stroke:#8a8a8a;stroke-width:.6}
.b-red{fill:#d23a3f;stroke:#8a8a8a;stroke-width:.6}
.b-green{fill:#2f8f4e;stroke:#8a8a8a;stroke-width:.6}
.b-wire{fill:none;stroke:#9a9a9a;stroke-width:1}
.b-num{fill:#f2f2f2;font:700 19px system-ui,sans-serif;text-anchor:middle;dominant-baseline:central}
.b-hit{fill:var(--primary-color);fill-opacity:.55;stroke:#fff;stroke-width:1.2}
.b-dart{fill:#fff;stroke:var(--primary-color);stroke-width:3}
.b-dart.last{fill:var(--primary-color);stroke:#fff}
.playercard{width:min(440px,100%);box-sizing:border-box;padding:22px 24px 26px;border-radius:22px;text-align:center;color:#fff;background:linear-gradient(135deg,#6a1b9a,#c2185b 60%,#e53935);box-shadow:0 18px 50px -20px rgba(194,24,91,.6);transition:background .3s}
.playercard.idle{background:linear-gradient(135deg,color-mix(in srgb,var(--primary-color) 45%,#222),#333);box-shadow:none}
.playercard.bust{background:linear-gradient(135deg,#b71c1c,#4a0000)}
.playercard.won{background:linear-gradient(135deg,#f9a825,#2e7d32)}
.tag{display:inline-flex;align-items:center;gap:8px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;font-size:15px;background:rgba(0,0,0,.35);padding:6px 14px;border-radius:999px}
.tag i{width:8px;height:8px;border-radius:50%;background:#fff}
.points{font-size:clamp(80px,16vw,132px);line-height:1;font-weight:800;letter-spacing:-.03em;font-variant-numeric:tabular-nums;margin:12px 0 6px}
.sub{font-size:16px;min-height:22px;opacity:.9;display:flex;gap:10px;justify-content:center;align-items:center}
.finish{display:flex;gap:8px;justify-content:center;margin:2px 0 12px}
.finish span{font-size:20px;font-weight:700;padding:6px 14px;border-radius:12px;background:rgba(255,255,255,.18);font-variant-numeric:tabular-nums}
.finish span:last-child{background:#fff;color:#7b1f4a}
.finish.none{font-size:14px;opacity:.85}
.mode{font-size:12px;padding:2px 8px;border-radius:999px;background:rgba(0,0,0,.3)}
.lastcall{font-size:14px;opacity:.7;min-height:20px}
/* bottom bar */
.controls{position:sticky;bottom:0;display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:12px 16px;margin:0 -16px;background:var(--ha-card-background,var(--card-background-color));border-top:1px solid var(--divider-color)}
.controls .spacer{flex:1}
.controls .full{flex-basis:100%;margin:0}
.round{width:44px;height:44px;border-radius:50%;padding:0;font-size:20px}
.round.on{border-color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 20%,transparent)}
.sink{max-width:220px}
.volbox{display:flex;align-items:center;gap:8px}
.controls .volbox input{width:120px}
.vol{font-size:12px;font-weight:500;opacity:.8;min-width:38px}
.field.volbox{align-items:stretch}
@media (max-width:600px){.controls .volbox{display:none}.sink{max-width:150px}}
/* settings */
.tabs{display:flex;gap:6px;margin:12px 0;overflow-x:auto}
.tabs button{border-radius:999px;white-space:nowrap}
.tabs button.sel{background:var(--primary-color);color:var(--text-primary-color,#fff);border-color:var(--primary-color)}
.sheet{max-width:900px}
/* switches */
.switch{display:inline-flex;align-items:center;gap:10px;cursor:pointer;font-size:14px;user-select:none}
.switch input{position:absolute;opacity:0;pointer-events:none}
.switch span{width:40px;height:22px;border-radius:999px;background:var(--divider-color);position:relative;transition:background .2s;flex:none}
.switch span::after{content:"";position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 2px rgba(0,0,0,.3)}
.switch input:checked + span{background:var(--primary-color)}
.switch input:checked + span::after{transform:translateX(18px)}
.switch input:disabled + span{opacity:.4}
.switch input:focus-visible + span{outline:2px solid var(--primary-color);outline-offset:2px}
.switch.big{font-size:15px;font-weight:500;margin:4px 0 10px}
input[type=range]{width:100%;accent-color:var(--primary-color)}
/* caller */
.voice{display:flex;gap:8px}
.voice select{flex:1;font-size:15px}
.star{font-size:18px;padding:4px 12px}
.star.on{color:var(--warning-color,#f9a825)}
.opts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 14px}
@media (max-width:600px){.opts{grid-template-columns:1fr}}
.board{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;margin-bottom:8px}
.board button{padding:12px}
/* LED */
.groups{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:4px 28px;transition:opacity .2s}
.groups.dim{opacity:.55}
.row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr) 72px 34px 34px;gap:6px;align-items:center;font-size:14px;margin-bottom:6px;padding:2px 4px;border-radius:10px}
.row.active{background:color-mix(in srgb,var(--primary-color) 16%,transparent)}
.row select{padding:6px 8px}
.row button{padding:6px 0}
.dur{display:flex;align-items:center;gap:4px;font-size:13px}
.dur input{width:50px;padding:6px}
.muted{opacity:.55}
@media (max-width:600px){.groups{grid-template-columns:1fr}.row{grid-template-columns:minmax(0,1fr) minmax(0,1.2fr) 34px}.row .dur,.row [data-edit]{display:none}}
`;

customElements.get("govee-darts-panel") || customElements.define("govee-darts-panel", GoveeDartsPanel);
