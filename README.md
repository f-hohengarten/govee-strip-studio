# Govee Strip Studio

Lokale Bluetooth-Steuerung für Govee-LED-Streifen in Home Assistant – mit einem eigenen
Bereich **„Strip Studio“** in der Seitenleiste, in dem du Effekte für deinen Streifen baust.

Basiert auf [ha-govee-led-ble](https://github.com/teh-hippo/ha-govee-led-ble) von teh-hippo
(Version 7.34.0, MIT-Lizenz). Alle Funktionen des Originals bleiben erhalten; dessen
Effekt-Editor heißt hier „Effect Studio (Experte)“.

## Strip Studio

- **Streifen-Geometrie:** Anfang, Ende und Zentrum frei festlegen – ideal für gekürzte Streifen.
  Abgeschnittene Segmente werden automatisch dunkel gehalten.
- **Effekte:** Statisch, Segmente (einzeln bemalen), Verlauf, Fade, Marquee.
- **Richtungen:** vom Controller weg, zum Controller hin, aus der Mitte, von den Seiten.
- **Einstellungen:** Tempo, Blocklänge, Lücke, Welle (Fade), Helligkeit, Hintergrundfarbe.
- **Live-Vorschau** im Browser mit derselben Rechenlogik wie auf dem Streifen.
- **Effekt-Bibliothek:** Effekte speichern, bearbeiten, löschen und abspielen.
- **Choreos** (Ansicht „🎬 Choreos“): gespeicherte Effekte nacheinander reihen, mit eigener
  Dauer pro Schritt, Zeitleiste und Live-Vorschau. Am Ende läuft der letzte Effekt weiter,
  die Choreo wiederholt sich, der Streifen hält an oder das Licht geht aus. Eine Choreo
  endet vorzeitig mit „Stopp“, beim Ausschalten des Lichts oder wenn ein anderer Effekt startet.

Effekte werden von Home Assistant Bild für Bild an den Streifen gesendet. Bewegungen laufen
deshalb in ruhigen Schritten (etwa 2–5 pro Sekunde, abhängig von der Zahl der Farben).

Die Bluetooth-Verbindung wird standardmäßig gehalten („hold“), damit Befehle schnell ankommen.

## Darts (Autodarts)

Die Integration bringt einen zweiten Bereich **„Darts“** in der Seitenleiste mit:

- **Live:** Spieler am Board, Restpunkte, die drei Darts der Aufnahme.
- **Caller in diesem Browser:** spielt die Ansagen von darts-caller im Browser ab – auf einem
  Ausgabegerät deiner Wahl (Chrome/Edge), z. B. einem per Bluetooth gekoppelten Echo Dot.
  Autodarts in einem anderen Tab bleibt auf den normalen Lautsprechern. Der Tab muss offen
  bleiben; „Ton aktivieren“ einmal pro Seitenaufruf (Browser-Regel).
- **Caller:** Stimme, Sprache, Ansage-Optionen (jeder Dart, Spieler, Checkout …). Die Werte werden
  gespeichert und nach einem Neustart von darts-caller automatisch wieder gesetzt.
- **Board:** Start, Stopp, Reset, Kalibrieren, nächster Spieler.
- **LED-Reaktionen:** Würfe, Aufnahmen, Bust, Leg-/Match-Gewinn, Takeout und Spielerwechsel lösen
  gespeicherte Strip-Studio-Effekte aus; kurze Effekte springen danach auf die Farbe des Spielers
  am Zug zurück. „✨ Vorlagen anlegen“ legt eine fertige Belegung an, ohne eigene Zuordnungen zu
  überschreiben. Darts-Effekte selbst baust du im Strip Studio (Haken „🎯 Darts-Effekt“).
- Die Kopfzeile zeigt, ob darts-caller verbunden **und bei Autodarts angemeldet** ist – ohne
  Anmeldung kommen keine Würfe an.

Die Ereignisse liefert [darts-caller](https://github.com/Peschi90/darts-caller), das auf dem
Autodarts-Rechner läuft (Ubuntu, Raspberry Pi, Windows …):

```bash
sudo mkdir -p /opt/darts-caller /opt/darts-media /opt/darts-media-shared && cd /opt/darts-caller
sudo curl -L -o darts-caller https://github.com/Peschi90/darts-caller/releases/latest/download/darts-caller
sudo chmod +x darts-caller
sudo ./darts-caller -B DEINE_BOARD_ID -M /opt/darts-media -MS /opt/darts-media-shared
```

Die Medienordner dürfen nicht im Programmordner liegen. Danach `https://IP-DES-RECHNERS:8079`
im Browser öffnen, Zertifikatswarnung bestätigen und den Autodarts-Login über den angezeigten
Code freigeben (einmalig). Läuft darts-caller als systemd-Dienst, sollte er erst nach dem Netzwerk
starten (`Wants=`/`After=network-online.target`), sonst scheitert die Autodarts-Anmeldung beim Booten.

Im Bereich **Darts** → Karte **Verbindung** die IP des Rechners eintragen und speichern. Jedes
Ereignis wird zusätzlich als Home-Assistant-Ereignis `govee_strip_studio_darts` gemeldet – für
eigene Automationen.

## Automationen

Gespeicherte Effekte (auch Darts-Effekte) und Choreos lassen sich in Automationen und Skripten nutzen:

```yaml
# Effekt oder Choreo per Name abspielen
action: govee_strip_studio.play_studio_effect
target:
  entity_id: light.dart
data:
  effect: Abendwelle

# Studio-Effekt oder Choreo beenden
action: govee_strip_studio.stop_studio_effect
target:
  entity_id: light.dart

# LED-Reaktionen auf Darts an/aus, z. B. wenn der Autodarts-Rechner hoch- oder herunterfährt
action: govee_strip_studio.set_darts_mode
data:
  enabled: true
```

Darts-Ereignisse kommen als Ereignis `govee_strip_studio_darts` an (Felder `event`, `player`,
`player_index`, `game`), z. B. als Auslöser „Ereignis“ mit `event_data: {event: busted}`.

## Installation über HACS

1. HACS → oben rechts ⋮ → **Benutzerdefinierte Repositories**
2. URL dieses Repositories eintragen, Kategorie **Integration**, hinzufügen
3. „Govee Strip Studio“ herunterladen und Home Assistant neu starten
4. Einstellungen → Geräte & Dienste: Der Streifen wird per Bluetooth erkannt → hinzufügen

**Wichtig:** Ein Streifen kann nur mit *einer* Integration gleichzeitig verbunden sein.
Deaktiviere vorher andere Govee-Bluetooth-Integrationen für dasselbe Gerät
(z. B. „Govee LED BLE“ oder „Govee BLE Lights“) und schließe die Govee-App.

## Unterstützte Geräte

Wie im Original (u. a. H617A/C/E/F, H6199, H6102 …). Strip Studio benötigt ein Gerät mit
Segment-Steuerung. Getestet mit H617C (30 Chips, 15 Segmente).

## Lizenz

MIT – siehe [LICENSE](LICENSE) und [NOTICE.md](NOTICE.md).

## Entwicklung

- Projektregeln: [CLAUDE.md](CLAUDE.md)
- Tests (ohne Home Assistant): `python3 -m pytest tests/ -q` – der Darts-Feed-Test braucht
  zusätzlich `aiohttp` und `python-socketio` (sonst übersprungen)
- Upstream-Update übernehmen: `python3 tools/sync_upstream.py vX.Y.Z`
