"""Minimal Socket.IO client for darts-caller's event feed.

darts-caller (Flask-SocketIO 5, i.e. Socket.IO protocol 5 over Engine.IO 4) broadcasts
every game event as ``emit("message", payload)`` on ``wss://host:8079`` with a
self-signed certificate (plain ``ws://`` when started with ``-WEBDH 1``).  This client
speaks just enough of that protocol over aiohttp, which Home Assistant already ships,
instead of adding a Socket.IO dependency:

    server: 0{"sid":..,"pingInterval":..,"pingTimeout":..}   (Engine.IO open)
    client: 40                                              (join namespace "/")
    server: 40{"sid":..}                                    (joined)
    server: 2  -> client: 3                                 (ping / pong)
    server: 42["message",{...}]                             (event)

Part of Govee Strip Studio, built on teh-hippo/ha-govee-led-ble (MIT).
"""

from __future__ import annotations

import asyncio
from collections.abc import Callable
import json
import logging
import time
from typing import Any

import aiohttp

_LOGGER = logging.getLogger(__name__)

RECONNECT_DELAYS = (2, 5, 10, 30)  # seconds; the last value repeats


class DartsFeed:
    """Keeps a connection to darts-caller open and hands each event to ``on_event``."""

    def __init__(
        self,
        session: aiohttp.ClientSession,
        host: str,
        port: int,
        on_event: Callable[[dict[str, Any]], None],
        on_status: Callable[[], None] | None = None,
    ) -> None:
        self._session = session
        self.host = host
        self.port = port
        self._on_event = on_event
        self._on_status = on_status
        self.connected = False
        self.scheme: str | None = None
        self.error: str | None = None
        self.last_event: str | None = None
        self.last_event_at: float | None = None
        self._joined = False
        self._task: asyncio.Task | None = None

    def status(self) -> dict[str, Any]:
        return {
            "host": self.host,
            "port": self.port,
            "connected": self.connected,
            "scheme": self.scheme,
            "error": self.error,
            "last_event": self.last_event,
            "last_event_age": None if self.last_event_at is None else round(time.monotonic() - self.last_event_at, 1),
        }

    def start(self, create_task: Callable[[Any], asyncio.Task]) -> None:
        self._task = create_task(self._run())

    async def stop(self) -> None:
        if self._task is not None:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
            self._task = None
        self.connected = False

    def _set(self, *, connected: bool, error: str | None = None) -> None:
        self.connected = connected
        self.error = error
        if self._on_status is not None:
            self._on_status()

    async def _run(self) -> None:
        failures = 0
        while True:
            error: str | None = None
            joined = False
            # darts-caller serves wss by default and ws only with -WEBDH 1.
            for scheme in ("wss", "ws"):
                self._joined = False
                try:
                    await self._session_loop(scheme)
                except asyncio.CancelledError:
                    raise
                except Exception as err:  # noqa: BLE001 - reported in the panel, then retried
                    error = str(err) or type(err).__name__
                    _LOGGER.debug("darts-caller %s://%s:%s: %s", scheme, self.host, self.port, error)
                if self._joined:
                    joined = True  # the link worked and then dropped: no need to try the other scheme
                    break
            failures = 0 if joined else failures + 1
            self._set(connected=False, error=error)
            await asyncio.sleep(RECONNECT_DELAYS[min(failures, len(RECONNECT_DELAYS) - 1)])

    async def _session_loop(self, scheme: str) -> None:
        url = f"{scheme}://{self.host}:{self.port}/socket.io/?EIO=4&transport=websocket"
        async with self._session.ws_connect(url, ssl=False, timeout=aiohttp.ClientWSTimeout(ws_close=5), heartbeat=None) as ws:
            opened = await ws.receive_str(timeout=10)
            if not opened.startswith("0"):
                raise ConnectionError(f"unexpected Engine.IO handshake {opened[:40]!r}")
            info = json.loads(opened[1:])
            # The server pings every pingInterval; silence beyond interval + timeout means a dead link.
            silence = (info.get("pingInterval", 25000) + info.get("pingTimeout", 20000)) / 1000
            await ws.send_str("40")
            self.scheme = scheme
            while True:
                msg = await ws.receive(timeout=silence)
                if msg.type in (aiohttp.WSMsgType.CLOSE, aiohttp.WSMsgType.CLOSED, aiohttp.WSMsgType.CLOSING):
                    raise ConnectionError("darts-caller closed the connection")
                if msg.type is aiohttp.WSMsgType.ERROR:
                    raise ConnectionError(str(ws.exception()) or "websocket error")
                if msg.type is not aiohttp.WSMsgType.TEXT:
                    continue
                data: str = msg.data
                if data == "2":
                    await ws.send_str("3")
                elif data.startswith("40"):
                    self._joined = True
                    self._set(connected=True)
                elif data.startswith("44"):
                    raise ConnectionError(f"darts-caller refused the connection: {data[2:200]}")
                elif data.startswith("41"):
                    raise ConnectionError("darts-caller ended the session")
                elif data.startswith("42"):
                    self._dispatch(data[2:])

    def _dispatch(self, raw: str) -> None:
        try:
            packet = json.loads(raw)
        except ValueError:
            return
        if not (isinstance(packet, list) and len(packet) >= 2 and packet[0] == "message"):
            return
        payload = packet[1]
        if isinstance(payload, str):  # some versions emit pre-encoded JSON
            try:
                payload = json.loads(payload)
            except ValueError:
                return
        if not isinstance(payload, dict):
            return
        self.last_event = str(payload.get("event") or "")
        self.last_event_at = time.monotonic()
        try:
            self._on_event(payload)
        except Exception:  # noqa: BLE001 - a bad event must not drop the connection
            _LOGGER.exception("Strip Studio could not handle darts event %s", self.last_event)
