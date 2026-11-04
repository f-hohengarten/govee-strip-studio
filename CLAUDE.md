# CLAUDE.md – Govee Strip Studio

Home-Assistant-Custom-Integration (HACS). Fork von teh-hippo/ha-govee-led-ble (MIT) plus
„Strip Studio“: geometrie-bewusster Effekt-Editor für Govee-RGBIC-Streifen per Bluetooth.

**Aktueller Projektstand, Messergebnisse und offene Aufgaben: siehe `HANDOFF.md` – zuerst lesen.**

## Sprache

- Mit dem Nutzer (Frederic) **auf Deutsch** kommunizieren.
- UI-Texte im Panel sind Deutsch. Code, Kommentare, Logs und Commit-Messages auf Englisch.

## Repo-Aufbau

```
custom_components/govee_strip_studio/   die Integration (Domain: govee_strip_studio)
  strip_studio.py          EIGEN: Player, Speicher, WebSocket-API, Panel-Registrierung
  studio_render.py         EIGEN: reine Render-Engine (kein HA-Import!)
  studio_frontend/panel.js EIGEN: Seitenleisten-Panel, Vanilla-Web-Component ohne Build
  studio_darts.py          EIGEN: Autodarts-Steuerung (Ereignis → gespeicherter Effekt, Rücksprung)
  darts_feed.py            EIGEN: Socket.IO-Client für darts-caller (nur aiohttp, kein HA-Import)
  darts_rules.py           EIGEN: reine Ereignis-Klassifikation (kein HA-Import)
  darts_presets.py         EIGEN: fertige Darts-Effekte + Standard-Zuordnung (kein HA-Import)
  alles andere             UPSTREAM (umbenannt) – nicht direkt bearbeiten, siehe unten
tools/sync_upstream.py     erzeugt den Fork aus einem Upstream-Release neu
tests/test_studio_render.py  Tests ohne Home Assistant (pytest), inkl. Python/JS-Parität
tests/test_darts.py          Darts-Regeln + Feed gegen echten python-socketio-Server
```

## Regeln

1. **Upstream-Dateien nicht von Hand ändern.** Änderungen an Upstream-Code nur als Patch in
   `tools/sync_upstream.py` (`PATCHES`, mit eindeutigem Anker). Sonst gehen sie beim nächsten
   Sync verloren. Eigene Logik gehört in `strip_studio.py` / `studio_render.py`.
2. **Upstream-Update:** `python3 tools/sync_upstream.py vX.Y.Z` (nutzt das Release-ZIP, nicht den
   Git-Tree – nur das ZIP enthält `generated_protocol/` und das gebaute Experten-Frontend).
   Danach Tests, Version in `manifest.json` erhöhen.
3. **Render-Engine existiert doppelt:** `studio_render.py` (Player) und der Abschnitt
   „render engine“ oben in `panel.js` (Live-Vorschau). Jede Änderung an beiden machen;
   `test_panel_preview_matches_python_renderer` prüft die Gleichheit.
4. `studio_render.py` bleibt frei von Home-Assistant-Imports (Tests laden die Datei direkt).
5. `panel.js` ohne Build-Schritt und ohne externe Abhängigkeiten halten (wird als statische
   Datei ausgeliefert). Theme-Farben über HA-CSS-Variablen.
6. Vor jedem Commit: `python3 -m pytest tests/ -q` und `node --check custom_components/govee_strip_studio/studio_frontend/panel.js`.
7. Upstream-Code nutzt Python-3.14-Syntax (`except A, B:`); `py_compile` mit älterem Python
   schlägt dort fehl – das ist kein Fehler im Fork.

## Release

- `manifest.json` → `version` erhöhen (SemVer, z. B. 0.2.0), außerdem `STUDIO_VERSION` in
  `strip_studio.py` (steuert Cache-Busting von `panel.js`).
- Commit, Tag `v0.2.0`, GitHub-Release anlegen → HACS zeigt das Update an.
- Nach Installation braucht Home Assistant einen Neustart.

## Umgang mit dem echten System

- Home Assistant läuft produktiv im Haushalt des Nutzers. **Neustarts von Home Assistant,
  Deaktivieren/Löschen von Integrationen und Schalten von Lichtern nur nach Rückfrage.**
- Ein Govee-Streifen erlaubt nur **eine** Bluetooth-Verbindung: nie zwei Integrationen
  gleichzeitig für dasselbe Gerät aktiv lassen; Govee-App muss geschlossen sein.
- Keine Zugangsdaten/Tokens in Dateien oder Commits.
