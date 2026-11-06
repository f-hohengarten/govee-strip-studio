#!/usr/bin/env python3
"""Rebuild custom_components/govee_strip_studio from an upstream ha-govee-led-ble release.

Usage:
    python3 tools/sync_upstream.py v7.34.0            # downloads the release zip from GitHub
    python3 tools/sync_upstream.py --zip path/to.zip  # uses a local release zip

The upstream release zip (not the git tree!) is required: it contains
generated_protocol/ (Kaitai output) and the built frontend bundle.

Steps (all asserted, the script fails loudly if an anchor moved upstream):
  1. unpack the release into a temp dir
  2. rename domain/branding strings (REPLACEMENTS)
  3. apply the Strip Studio hook patches to __init__.py and config_flow.py (PATCHES)
  4. rewrite manifest.json
  5. copy the Strip Studio files from the current tree on top
  6. replace custom_components/govee_strip_studio
"""

from __future__ import annotations

import argparse
import json
import shutil
import sys
import tempfile
import urllib.request
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TARGET = ROOT / "custom_components" / "govee_strip_studio"
UPSTREAM_ZIP_URL = "https://github.com/teh-hippo/ha-govee-led-ble/releases/download/{tag}/ha_govee_led_ble.zip"

# Order matters: identical to what was applied to the deployed 0.1.0.
REPLACEMENTS = [
    ("ha_govee_led_ble", "govee_strip_studio"),
    ("ha-govee-led-ble", "govee-strip-studio"),
    ("Govee Effect Studio", "Effect Studio (Experte)"),
    ("Govee LED BLE", "Govee Strip Studio"),
]
BINARY_SUFFIXES = (".png", ".jpg", ".pyc")

PATCHES: dict[str, list[tuple[str, str]]] = {
    "__init__.py": [
        (
            "from .light_services import async_register_light_services\n",
            "from .light_services import async_register_light_services\n"
            "from .strip_studio import async_setup_strip_studio, async_unload_strip_studio_entry\n",
        ),
        (
            "    async_register_light_services(hass)\n    await async_setup_effects(hass)\n",
            "    async_register_light_services(hass)\n    await async_setup_effects(hass)\n"
            "    await async_setup_strip_studio(hass)\n",
        ),
        (
            "async def async_unload_entry(hass: HomeAssistant, entry: GoveeBLEConfigEntry) -> bool:\n",
            "async def async_unload_entry(hass: HomeAssistant, entry: GoveeBLEConfigEntry) -> bool:\n"
            "    await async_unload_strip_studio_entry(hass, entry.entry_id)\n",
        ),
        (
            "connection_mode=entry.options.get(CONF_CONNECTION_MODE, CONNECTION_MODE_RELEASE),",
            "connection_mode=entry.options.get(CONF_CONNECTION_MODE, CONNECTION_MODE_HOLD),",
        ),
    ],
    "editor.py": [
        # Strip Studio is the only sidebar entry; the expert editor stays reachable from device pages.
        ("        show_in_sidebar=True,\n", "        show_in_sidebar=False,\n"),
    ],
    "config_flow.py": [
        (
            "self.config_entry.options.get(CONF_CONNECTION_MODE, CONNECTION_MODE_RELEASE)",
            "self.config_entry.options.get(CONF_CONNECTION_MODE, CONNECTION_MODE_HOLD)",
        ),
    ],
}

# Files owned by this fork (copied over the rebuilt upstream tree).
STUDIO_FILES = [
    "strip_studio.py",
    "studio_render.py",
    "studio_darts.py",
    "darts_feed.py",
    "darts_rules.py",
    "darts_presets.py",
    "darts_caller.py",
    "studio_choreo.py",
    "studio_services.yaml",
    "studio_frontend/panel.js",
    "studio_frontend/darts_panel.js",
]


def _replace_once(text: str, old: str, new: str, where: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{where}: patch anchor found {count}x (expected 1):\n{old}")
    return text.replace(old, new)


def build(release_zip: Path, version: str) -> None:
    with tempfile.TemporaryDirectory() as tmp:
        work = Path(tmp) / "component"
        with zipfile.ZipFile(release_zip) as archive:
            archive.extractall(work)
        if not (work / "manifest.json").is_file() or not (work / "generated_protocol").is_dir():
            raise SystemExit("not an upstream release zip (manifest.json / generated_protocol missing)")

        for path in work.rglob("*"):
            if not path.is_file() or path.suffix in BINARY_SUFFIXES or "__pycache__" in path.parts:
                continue
            text = path.read_text(encoding="utf-8")
            new = text
            for old, repl in REPLACEMENTS:
                new = new.replace(old, repl)
            if new != text:
                path.write_text(new, encoding="utf-8")

        for name, patches in PATCHES.items():
            path = work / name
            text = path.read_text(encoding="utf-8")
            for old, new in patches:
                text = _replace_once(text, old, new, name)
            if name == "__init__.py" and "CONNECTION_MODE_HOLD" not in text.split("connection_mode=entry")[0]:
                text = _replace_once(
                    text, "    CONNECTION_MODE_RELEASE,\n", "    CONNECTION_MODE_HOLD,\n    CONNECTION_MODE_RELEASE,\n", name
                )
            path.write_text(text, encoding="utf-8")

        manifest_path = work / "manifest.json"
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        upstream_version = manifest.get("version")
        manifest.update(
            name="Govee Strip Studio",
            version=version,
            codeowners=[],
            documentation="https://github.com/f-hohengarten/govee-strip-studio",
            issue_tracker="https://github.com/f-hohengarten/govee-strip-studio/issues",
        )
        manifest_path.write_text(json.dumps(manifest, indent=4), encoding="utf-8")

        for rel in STUDIO_FILES:
            src = TARGET / rel
            if not src.is_file():
                raise SystemExit(f"missing studio file in current tree: {src}")
            dst = work / rel
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)

        # Strip Studio's actions are described in their own file, appended to upstream's.
        services = work / "services.yaml"
        studio_services = (work / "studio_services.yaml").read_text(encoding="utf-8")
        services.write_text(services.read_text(encoding="utf-8").rstrip("\n") + "\n\n" + studio_services, encoding="utf-8")

        for cache in work.rglob("__pycache__"):
            shutil.rmtree(cache, ignore_errors=True)
        shutil.rmtree(TARGET)
        shutil.copytree(work, TARGET)
        print(f"rebuilt {TARGET.relative_to(ROOT)} from upstream {upstream_version} as {version}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("tag", nargs="?", help="upstream release tag, e.g. v7.34.0")
    parser.add_argument("--zip", type=Path, help="local upstream release zip instead of downloading")
    parser.add_argument("--version", help="version for manifest.json (default: keep current)")
    args = parser.parse_args()
    if not args.tag and not args.zip:
        parser.error("give an upstream tag or --zip")
    version = args.version or json.loads((TARGET / "manifest.json").read_text(encoding="utf-8"))["version"]
    if args.zip:
        build(args.zip, version)
        return
    with tempfile.TemporaryDirectory() as tmp:
        dest = Path(tmp) / "release.zip"
        url = UPSTREAM_ZIP_URL.format(tag=args.tag)
        print(f"downloading {url}")
        urllib.request.urlretrieve(url, dest)  # noqa: S310 - fixed GitHub URL
        build(dest, version)


if __name__ == "__main__":
    sys.exit(main())
