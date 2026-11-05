// Darts panel for Govee Strip Studio: Autodarts via darts-caller.
// Caller audio in this browser (on an output device of choice, e.g. a Bluetooth
// speaker), caller voice and announcements, board control, live game and LED reactions.
// Vanilla web component, no build step, no external dependencies.

const WS = "govee_strip_studio/darts";
const SOUND_URL = "/api/govee_strip_studio/darts/sound";
const STORE = "govee-darts-audio"; // per-browser audio settings (localStorage)

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
      this.ctx = new AudioContext({ latencyHint: "interactive" });
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

  _load(path) {
    if (!this.buffers.has(path)) {
      const job = this.hass
        .fetchWithAuth(`${SOUND_URL}?path=${encodeURIComponent(path)}`)
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.arrayBuffer();
        })
        .then((data) => this.ctx.decodeAudioData(data));
      job.catch(() => this.buffers.delete(path)); // retry next time
      this.buffers.set(path, job);
      if (this.buffers.size > 400) this.buffers.delete(this.buffers.keys().next().value);
    }
    return this.buffers.get(path);
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

  // Same ordering as darts-caller's own web caller: files flagged "wait" (and the one
  // after them) are chained, everything else starts at once.
  play(files) {
    if (!this.enabled || !this.ctx) return;
    if (this.ctx.state !== "running") this.ctx.resume().catch(() => {});
    for (const file of files) {
      // Fetch everything in parallel right away; only the playback is sequenced.
      this._load(file.path).catch(() => {});
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
  _pill(kind, text, title = "") {
    return `<span class="pill ${kind}" title="${esc(title)}"><i></i>${text}</span>`;
  }

  _statusPills() {
    const s = this._info.status;
    const feed = s.feed;
    const out = [];
    if (!s.host) out.push(this._pill("off", "darts-caller nicht eingerichtet"));
    else if (feed?.connected) out.push(this._pill("on", "darts-caller verbunden"));
    else out.push(this._pill("bad", "darts-caller getrennt", feed?.error || ""));
    if (s.host && feed?.connected) {
      const [kind, text] = AUTODARTS[s.autodarts?.state] || AUTODARTS.unknown;
      out.push(this._pill(kind, text, s.autodarts?.error || ""));
    }
    out.push(this._pill(s.enabled ? "on" : "off", s.enabled ? "LED-Reaktionen an" : "LED-Reaktionen aus"));
    return out.join("");
  }

  _alerts() {
    const s = this._info.status;
    const state = s.autodarts?.state;
    if (s.feed?.connected && (state === "failed" || state === "unreachable")) {
      return `<div class="alert">
        <b>darts-caller ist nicht bei Autodarts angemeldet</b> – ohne Anmeldung kommen keine Würfe an.
        ${s.autodarts?.error ? `<code>${esc(s.autodarts.error).slice(0, 220)}</code>` : ""}
        Starte darts-caller neu: <code>sudo systemctl restart darts-caller</code>
      </div>`;
    }
    if (state === "pending") {
      return `<div class="alert warn">darts-caller wartet auf deine Autodarts-Bestätigung. Öffne
        <a href="https://${esc(s.host)}:${esc(s.port)}/" target="_blank" rel="noopener">die darts-caller-Seite</a> und folge dem Code.</div>`;
    }
    return "";
  }

  _liveCard() {
    const g = this._info.status.game || {};
    const has = Object.keys(g).length > 0;
    const darts = g.darts || [];
    const slots = [0, 1, 2]
      .map((i) => {
        const d = darts[i];
        return `<div class="dart ${d ? "hit" : ""}">${d ? `<b>${esc((d.field || "").toUpperCase() || d.value)}</b><span>${esc(d.value ?? "")}</span>` : "–"}</div>`;
      })
      .join("");
    const label = EVENT_LABELS[g.event] || "";
    const call = AUDIO.enabled && AUDIO.lastCall ? `🔊 ${esc(AUDIO.lastCall)}` : "";
    return `<div class="live-main">
        <div class="who">
          <span class="caption">${has ? "Am Board" : "Kein laufendes Spiel"}</span>
          <span class="player">${has && g.player ? esc(g.player) : "—"}</span>
          <span class="caption">${esc(label)}${g.visit != null && g.event !== "match-started" ? ` · ${esc(g.visit)} Punkte` : ""}</span>
        </div>
        <div class="score"><span class="caption">Rest</span><span class="points">${has && g.points_left != null ? esc(g.points_left) : "—"}</span></div>
      </div>
      <div class="darts">${slots}</div>
      <div class="lastcall">${call}</div>`;
  }

  _audioCard() {
    const supported = AUDIO.supportsSink;
    const named = this._outputs.some((d) => d.label);
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
    return `<h2>🔊 Caller in diesem Browser</h2>
      <p class="hint">Spielt die Ansagen von darts-caller hier ab – auf dem Ausgabegerät deiner Wahl, z. B. deinem per Bluetooth gekoppelten Echo Dot. Autodarts im anderen Tab bleibt auf den Laptop-Lautsprechern.</p>
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
            ? `<select data-audio="sink">${missing}${options || `<option value="">Standard</option>`}</select>`
            : `<span class="hint">Dieser Browser kann kein Ausgabegerät wählen – nutze Chrome oder Edge, oder stelle das Gerät im System ein.</span>`
        }
      </div>
      ${
        supported && !named
          ? `<button data-audio="unlock" class="wide-btn">Gerätenamen anzeigen</button><p class="hint">Chrome zeigt die Namen erst nach einer einmaligen Mikrofon-Freigabe. Das Mikrofon wird dabei nicht genutzt.</p>`
          : ""
      }
      <div class="field"><span>Lautstärke</span><input type="range" min="0" max="150" step="5" value="${AUDIO.volume}" data-audio="volume"/><b class="vol">${AUDIO.volume} %</b></div>
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
    return `<h2>🗣 Caller</h2>
      <div class="voice">
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
    return `<h2>🎯 Board</h2>
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
    return `<div class="card-head">
        <h2>💡 LED-Reaktionen</h2>
        <label class="switch"><input type="checkbox" data-led="enabled" ${d.enabled ? "checked" : ""} ${d.host ? "" : "disabled"}/><span></span> ${d.enabled ? "An" : "Aus"}</label>
      </div>
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
    return `<h2>🔌 Verbindung</h2>
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
    root.innerHTML = `<style>${STYLE}</style>
      <div class="page">
        <header>
          <ha-menu-button></ha-menu-button>
          <div class="title">Darts</div>
          <div class="pills">${this._statusPills()}</div>
        </header>
        <div class="toast-slot"></div>
        ${this._alerts()}
        <section class="card hero live">${this._liveCard()}</section>
        <div class="grid">
          <section class="card audio">${this._audioCard()}</section>
          <section class="card">${this._callerCard()}</section>
          <section class="card">${this._boardCard()}</section>
          <section class="card">${this._connCard()}</section>
          <section class="card wide">${this._ledCard()}</section>
        </div>
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
    if (el && this._info) el.innerHTML = this._liveCard();
  }
  _renderAudio() {
    const el = this.shadowRoot.querySelector(".audio");
    if (!el || !this._info) return;
    const active = this.shadowRoot.activeElement;
    if (active && el.contains(active) && active.type === "range") return; // dragging the volume
    el.innerHTML = this._audioCard();
    this._bind(el);
  }

  _bind(scope = this.shadowRoot) {
    const on = (sel, ev, fn) => scope.querySelectorAll(sel).forEach((el) => el.addEventListener(ev, fn));
    const ignore = () => {};
    // audio (per browser)
    on("[data-audio=enabled]", "change", (ev) =>
      AUDIO.setEnabled(ev.target.checked).catch((err) => this._toast("error", `Ton konnte nicht starten: ${err.message || err}`)),
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
      const label = scope.querySelector(".vol") || this.shadowRoot.querySelector(".vol");
      if (label) label.textContent = `${ev.target.value} %`;
    });
    on("[data-audio=tone]", "click", () => AUDIO.testTone().catch((err) => this._toast("error", err.message || String(err))));
    // caller + board commands
    on("[data-cmd]", "click", (ev) => this._command(ev.currentTarget.dataset.cmd, ev.currentTarget.dataset.done).catch(ignore));
    if (scope !== this.shadowRoot) return;
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
    on("[data-led=enabled]", "change", (ev) => {
      this._draft.enabled = ev.target.checked;
      this._saveConfig()
        .then(() => this._toast("ok", ev.target.checked ? "LED-Reaktionen an" : "LED-Reaktionen aus"))
        .catch(() => this._render());
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
.page{max-width:1200px;margin:0 auto;padding:0 16px 40px}
header{display:flex;align-items:center;gap:12px;min-height:56px;flex-wrap:wrap;position:sticky;top:0;z-index:2;background:var(--app-header-background-color,var(--primary-background-color));color:var(--app-header-text-color,var(--primary-text-color));margin:0 -16px;padding:6px 16px}
.title{font-size:20px;font-weight:500}
.pills{display:flex;gap:8px;flex-wrap:wrap;margin-left:auto}
.pill{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;padding:4px 10px;border-radius:999px;background:var(--secondary-background-color);border:1px solid var(--divider-color);white-space:nowrap}
.pill i{width:8px;height:8px;border-radius:50%;background:var(--disabled-text-color,#888)}
.pill.on i{background:var(--success-color,#2e7d32);box-shadow:0 0 0 3px color-mix(in srgb,var(--success-color,#2e7d32) 25%,transparent)}
.pill.warn i{background:var(--warning-color,#f9a825)}
.pill.bad i{background:var(--error-color,#c62828)}
.card{background:var(--ha-card-background,var(--card-background-color));border-radius:var(--ha-card-border-radius,16px);padding:18px 20px;box-shadow:var(--ha-card-box-shadow,none);border:1px solid var(--divider-color);min-width:0}
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:16px}
.card.wide{grid-column:1 / -1}
@media (max-width:900px){.grid{grid-template-columns:1fr}}
h2{font-size:17px;margin:0 0 10px;font-weight:500}
h3{font-size:12px;text-transform:uppercase;letter-spacing:.07em;opacity:.6;margin:16px 0 8px;font-weight:500}
.hint{font-size:13px;opacity:.7;margin:0 0 12px;line-height:1.45}
.hint.small{font-size:12px;margin:10px 0 0}
.warn{color:var(--warning-color,#f9a825);font-size:13px}
a{color:var(--primary-color)}
code{font-size:12px;background:var(--secondary-background-color);padding:1px 6px;border-radius:6px;word-break:break-word}
button{font:inherit;font-size:14px;color:inherit;background:var(--secondary-background-color);border:1px solid var(--divider-color);border-radius:10px;padding:8px 12px;cursor:pointer;transition:border-color .15s,background .15s}
button:hover:not(:disabled){border-color:var(--primary-color)}
button:disabled{opacity:.4;cursor:default}
button.primary{background:var(--primary-color);color:var(--text-primary-color,#fff);border-color:var(--primary-color)}
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
/* live */
.hero{margin-top:16px;background:linear-gradient(135deg,color-mix(in srgb,var(--primary-color) 22%,var(--card-background-color)),var(--card-background-color) 70%)}
.live-main{display:flex;justify-content:space-between;align-items:flex-end;gap:16px}
.who{display:flex;flex-direction:column;gap:4px;min-width:0}
.caption{font-size:12px;text-transform:uppercase;letter-spacing:.08em;opacity:.65;min-height:15px}
.player{font-size:28px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.score{text-align:right;display:flex;flex-direction:column}
.points{font-size:64px;line-height:1;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.darts{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px}
.dart{height:58px;border-radius:14px;border:1px dashed var(--divider-color);display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:.55;font-size:18px}
.dart.hit{opacity:1;border:1px solid color-mix(in srgb,var(--primary-color) 50%,transparent);background:color-mix(in srgb,var(--primary-color) 12%,transparent)}
.dart b{font-size:20px}.dart span{font-size:12px;opacity:.7}
.lastcall{margin-top:10px;font-size:13px;opacity:.75;min-height:18px}
@media (max-width:600px){.points{font-size:48px}.player{font-size:22px}}
/* switches */
.switch{display:inline-flex;align-items:center;gap:10px;cursor:pointer;font-size:14px;user-select:none}
.switch input{position:absolute;opacity:0;pointer-events:none}
.switch span{width:40px;height:22px;border-radius:999px;background:var(--divider-color);position:relative;transition:background .2s;flex:none}
.switch span::after{content:"";position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 2px rgba(0,0,0,.3)}
.switch input:checked + span{background:var(--primary-color)}
.switch input:checked + span::after{transform:translateX(18px)}
.switch input:disabled + span{opacity:.4}
.switch input:focus-visible + span{outline:2px solid var(--primary-color);outline-offset:2px}
.switch.big{font-size:15px;font-weight:500;margin:4px 0}
.vol{font-size:12px;font-weight:500;opacity:.8}
input[type=range]{width:100%;accent-color:var(--primary-color)}
/* caller */
.voice{display:flex;gap:8px}
.voice select{flex:1;font-size:15px}
.star{font-size:18px;padding:4px 12px}
.star.on{color:var(--warning-color,#f9a825)}
.opts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 14px}
@media (max-width:600px){.opts{grid-template-columns:1fr}}
.board{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px}
.board button{padding:12px}
/* LED */
.card-head{display:flex;justify-content:space-between;align-items:center;gap:12px}
.card-head h2{margin:0}
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
