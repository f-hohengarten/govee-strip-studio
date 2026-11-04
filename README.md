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

Effekte werden von Home Assistant Bild für Bild an den Streifen gesendet. Bewegungen laufen
deshalb in ruhigen Schritten (etwa 2–5 pro Sekunde, abhängig von der Zahl der Farben).

Die Bluetooth-Verbindung wird standardmäßig gehalten („hold“), damit Befehle schnell ankommen.

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
- Tests (ohne Home Assistant): `python3 -m pytest tests/ -q`
- Upstream-Update übernehmen: `python3 tools/sync_upstream.py vX.Y.Z`
