"""Check that every Home Assistant name imported by Light Studio's own files exists.

Run against the Home Assistant release you target, e.g.:

    uvx --python 3.14 --with homeassistant==2026.11.0 python tests/check_ha_imports.py
"""

from __future__ import annotations

import ast
import importlib
from pathlib import Path
import sys

COMPONENT = Path(__file__).resolve().parent.parent / "custom_components" / "govee_strip_studio"
OWN = [
    "strip_studio.py",
    "studio_darts.py",
    "darts_feed.py",
    "darts_rules.py",
    "darts_presets.py",
    "darts_caller.py",
    "studio_choreo.py",
    "studio_render.py",
]

missing = []
checked = 0
for name in OWN:
    tree = ast.parse((COMPONENT / name).read_text(encoding="utf-8"))
    for node in ast.walk(tree):
        if isinstance(node, ast.ImportFrom) and node.module and node.module.startswith(("homeassistant", "aiohttp")):
            module = importlib.import_module(node.module)
            for alias in node.names:
                checked += 1
                if not hasattr(module, alias.name):
                    try:
                        importlib.import_module(f"{node.module}.{alias.name}")
                    except ImportError:
                        missing.append(f"{name}: from {node.module} import {alias.name}")
import homeassistant.const as const

print(f"Home Assistant {const.__version__}: {checked} imported names checked")
if missing:
    print("MISSING:\n  " + "\n  ".join(missing))
    sys.exit(1)
print("all present")
