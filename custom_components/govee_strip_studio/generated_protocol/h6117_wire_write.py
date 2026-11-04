# This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild
# type: ignore

import kaitaistruct
from kaitaistruct import ReadWriteKaitaiStruct, KaitaiStream, BytesIO
from custom_components.govee_strip_studio.generated_protocol import command_write
from custom_components.govee_strip_studio.generated_protocol import govee_common
from custom_components.govee_strip_studio.generated_protocol import govee_shared
from custom_components.govee_strip_studio.generated_protocol import h6125_wire_write
from enum import IntEnum


if getattr(kaitaistruct, 'API_VERSION', (0, 9)) < (0, 11):
    raise Exception("Incompatible Kaitai Struct Python API: 0.11 or later is required, but you have %s" % (kaitaistruct.__version__))

class H6117WireWrite(ReadWriteKaitaiStruct):
    """H6117 compatibility hypothesis; no identified device captures are available.
    Earlier controllers use whole-device 0x02 RGB or masked 0x0b RGB, while
    qualified newer controllers use the shared 0x15 static-colour body.
    Legacy 0x11 music uses a separate codebook from shared 0x13 music.
    Telink master brightness is a 6..254 register; other qualified families
    use 1..100. Register scaling and music eligibility are independent.
    Imported structures describe compatible fields, not sibling capabilities.
    Revision admission, masks and scaling belong to the effective profile.
    Unresolved assumptions: device acceptance, echoes, unused bytes and physical
    rendering. Unknown bodies and tails stay opaque. The last byte is XOR.
    """

    class CommandOp(IntEnum):
        power = 1
        brightness = 4
        mode = 5
        gradual = 163

    class LegacyMusicMode(IntEnum):
        energetic = 16
        rhythm = 17
        rolling = 18
        spectrum = 19
        bloom = 48
        shiny = 49
        separation = 50
        hopping = 51
        piano_keys = 52
        fountain = 53
        day_and_night = 55

    class ModeSub(IntEnum):
        whole_device_colour = 2
        scene = 4
        diy = 10
        legacy_colour = 11
        legacy_music = 17
        music = 19
        static = 21
    def __init__(self, _io=None, _parent=None, _root=None):
        super(H6117WireWrite, self).__init__(_io)
        self._parent = _parent
        self._root = _root or self

    def _read(self):
        self.header = self._io.read_bytes(1)
        if not self.header == b"\x33":
            raise kaitaistruct.ValidationNotEqualError(b"\x33", self.header, self._io, u"/seq/0")
        self.opcode = KaitaiStream.resolve_enum(H6117WireWrite.CommandOp, self._io.read_u1())
        _on = self.opcode
        if _on == H6117WireWrite.CommandOp.brightness:
            pass
            self._raw_body = self._io.read_bytes(17)
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = H6117WireWrite.BrightnessBody(_io__raw_body, self, self._root)
            self.body._read()
        elif _on == H6117WireWrite.CommandOp.gradual:
            pass
            self._raw_body = self._io.read_bytes(17)
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = H6117WireWrite.FlagBody(_io__raw_body, self, self._root)
            self.body._read()
        elif _on == H6117WireWrite.CommandOp.mode:
            pass
            self._raw_body = self._io.read_bytes(17)
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = H6117WireWrite.ModeBody(_io__raw_body, self, self._root)
            self.body._read()
        elif _on == H6117WireWrite.CommandOp.power:
            pass
            self._raw_body = self._io.read_bytes(17)
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = H6117WireWrite.FlagBody(_io__raw_body, self, self._root)
            self.body._read()
        else:
            pass
            self.body = self._io.read_bytes(17)
        self.checksum = self._io.read_u1()
        self._dirty = False


    def _fetch_instances(self):
        pass
        _on = self.opcode
        if _on == H6117WireWrite.CommandOp.brightness:
            pass
            self.body._fetch_instances()
        elif _on == H6117WireWrite.CommandOp.gradual:
            pass
            self.body._fetch_instances()
        elif _on == H6117WireWrite.CommandOp.mode:
            pass
            self.body._fetch_instances()
        elif _on == H6117WireWrite.CommandOp.power:
            pass
            self.body._fetch_instances()
        else:
            pass


    def _write__seq(self, io=None):
        super(H6117WireWrite, self)._write__seq(io)
        self._io.write_bytes(self.header)
        self._io.write_u1(int(self.opcode))
        _on = self.opcode
        if _on == H6117WireWrite.CommandOp.brightness:
            pass
            _io__raw_body = KaitaiStream(BytesIO(bytearray(17)))
            self._io.add_child_stream(_io__raw_body)
            _pos2 = self._io.pos()
            self._io.seek(self._io.pos() + (17))
            def handler(parent, _io__raw_body=_io__raw_body):
                self._raw_body = _io__raw_body.to_byte_array()
                if len(self._raw_body) != 17:
                    raise kaitaistruct.ConsistencyError(u"raw(body)", 17, len(self._raw_body))
                parent.write_bytes(self._raw_body)
            _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
            self.body._write__seq(_io__raw_body)
        elif _on == H6117WireWrite.CommandOp.gradual:
            pass
            _io__raw_body = KaitaiStream(BytesIO(bytearray(17)))
            self._io.add_child_stream(_io__raw_body)
            _pos2 = self._io.pos()
            self._io.seek(self._io.pos() + (17))
            def handler(parent, _io__raw_body=_io__raw_body):
                self._raw_body = _io__raw_body.to_byte_array()
                if len(self._raw_body) != 17:
                    raise kaitaistruct.ConsistencyError(u"raw(body)", 17, len(self._raw_body))
                parent.write_bytes(self._raw_body)
            _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
            self.body._write__seq(_io__raw_body)
        elif _on == H6117WireWrite.CommandOp.mode:
            pass
            _io__raw_body = KaitaiStream(BytesIO(bytearray(17)))
            self._io.add_child_stream(_io__raw_body)
            _pos2 = self._io.pos()
            self._io.seek(self._io.pos() + (17))
            def handler(parent, _io__raw_body=_io__raw_body):
                self._raw_body = _io__raw_body.to_byte_array()
                if len(self._raw_body) != 17:
                    raise kaitaistruct.ConsistencyError(u"raw(body)", 17, len(self._raw_body))
                parent.write_bytes(self._raw_body)
            _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
            self.body._write__seq(_io__raw_body)
        elif _on == H6117WireWrite.CommandOp.power:
            pass
            _io__raw_body = KaitaiStream(BytesIO(bytearray(17)))
            self._io.add_child_stream(_io__raw_body)
            _pos2 = self._io.pos()
            self._io.seek(self._io.pos() + (17))
            def handler(parent, _io__raw_body=_io__raw_body):
                self._raw_body = _io__raw_body.to_byte_array()
                if len(self._raw_body) != 17:
                    raise kaitaistruct.ConsistencyError(u"raw(body)", 17, len(self._raw_body))
                parent.write_bytes(self._raw_body)
            _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
            self.body._write__seq(_io__raw_body)
        else:
            pass
            self._io.write_bytes(self.body)
        self._io.write_u1(self.checksum)


    def _check(self):
        if len(self.header) != 1:
            raise kaitaistruct.ConsistencyError(u"header", 1, len(self.header))
        if not self.header == b"\x33":
            raise kaitaistruct.ValidationNotEqualError(b"\x33", self.header, None, u"/seq/0")
        _on = self.opcode
        if _on == H6117WireWrite.CommandOp.brightness:
            pass
            if self.body._root != self._root:
                raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
            if self.body._parent != self:
                raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
        elif _on == H6117WireWrite.CommandOp.gradual:
            pass
            if self.body._root != self._root:
                raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
            if self.body._parent != self:
                raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
        elif _on == H6117WireWrite.CommandOp.mode:
            pass
            if self.body._root != self._root:
                raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
            if self.body._parent != self:
                raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
        elif _on == H6117WireWrite.CommandOp.power:
            pass
            if self.body._root != self._root:
                raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
            if self.body._parent != self:
                raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
        else:
            pass
            if len(self.body) != 17:
                raise kaitaistruct.ConsistencyError(u"body", 17, len(self.body))
        self._dirty = False

    class BrightnessBody(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H6117WireWrite.BrightnessBody, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.register = self._io.read_u1()
            self.padding = self._io.read_bytes_full()
            self._dirty = False


        def _fetch_instances(self):
            pass


        def _write__seq(self, io=None):
            super(H6117WireWrite.BrightnessBody, self)._write__seq(io)
            self._io.write_u1(self.register)
            self._io.write_bytes(self.padding)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"padding", 0, self._io.size() - self._io.pos())


        def _check(self):
            self._dirty = False


    class DiySelector(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H6117WireWrite.DiySelector, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.code = self._io.read_u2le()
            self.unknown_tail = self._io.read_bytes_full()
            self._dirty = False


        def _fetch_instances(self):
            pass


        def _write__seq(self, io=None):
            super(H6117WireWrite.DiySelector, self)._write__seq(io)
            self._io.write_u2le(self.code)
            self._io.write_bytes(self.unknown_tail)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"unknown_tail", 0, self._io.size() - self._io.pos())


        def _check(self):
            self._dirty = False


    class FlagBody(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H6117WireWrite.FlagBody, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.flag = self._io.read_u1()
            self.unknown_tail = self._io.read_bytes_full()
            self._dirty = False


        def _fetch_instances(self):
            pass


        def _write__seq(self, io=None):
            super(H6117WireWrite.FlagBody, self)._write__seq(io)
            self._io.write_u1(self.flag)
            self._io.write_bytes(self.unknown_tail)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"unknown_tail", 0, self._io.size() - self._io.pos())


        def _check(self):
            self._dirty = False


    class LegacyMusicSelector(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H6117WireWrite.LegacyMusicSelector, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.mode_id = KaitaiStream.resolve_enum(H6117WireWrite.LegacyMusicMode, self._io.read_u1())
            self.sensitivity = self._io.read_u1()
            _on = self.mode_id
            if _on == H6117WireWrite.LegacyMusicMode.rhythm:
                pass
                self._raw_settings = self._io.read_bytes(14)
                _io__raw_settings = KaitaiStream(BytesIO(self._raw_settings))
                self.settings = h6125_wire_write.H6125WireWrite.RhythmSettings(_io__raw_settings)
                self.settings._read()
            elif _on == H6117WireWrite.LegacyMusicMode.rolling:
                pass
                self._raw_settings = self._io.read_bytes(14)
                _io__raw_settings = KaitaiStream(BytesIO(self._raw_settings))
                self.settings = h6125_wire_write.H6125WireWrite.ColourSettings(_io__raw_settings)
                self.settings._read()
            elif _on == H6117WireWrite.LegacyMusicMode.spectrum:
                pass
                self._raw_settings = self._io.read_bytes(14)
                _io__raw_settings = KaitaiStream(BytesIO(self._raw_settings))
                self.settings = h6125_wire_write.H6125WireWrite.ColourSettings(_io__raw_settings)
                self.settings._read()
            else:
                pass
                self._raw_settings = self._io.read_bytes(14)
                _io__raw_settings = KaitaiStream(BytesIO(self._raw_settings))
                self.settings = h6125_wire_write.H6125WireWrite.OpaqueSettings(_io__raw_settings)
                self.settings._read()
            self._dirty = False


        def _fetch_instances(self):
            pass
            _on = self.mode_id
            if _on == H6117WireWrite.LegacyMusicMode.rhythm:
                pass
                self.settings._fetch_instances()
            elif _on == H6117WireWrite.LegacyMusicMode.rolling:
                pass
                self.settings._fetch_instances()
            elif _on == H6117WireWrite.LegacyMusicMode.spectrum:
                pass
                self.settings._fetch_instances()
            else:
                pass
                self.settings._fetch_instances()


        def _write__seq(self, io=None):
            super(H6117WireWrite.LegacyMusicSelector, self)._write__seq(io)
            self._io.write_u1(int(self.mode_id))
            self._io.write_u1(self.sensitivity)
            _on = self.mode_id
            if _on == H6117WireWrite.LegacyMusicMode.rhythm:
                pass
                _io__raw_settings = KaitaiStream(BytesIO(bytearray(14)))
                self._io.add_child_stream(_io__raw_settings)
                _pos2 = self._io.pos()
                self._io.seek(self._io.pos() + (14))
                def handler(parent, _io__raw_settings=_io__raw_settings):
                    self._raw_settings = _io__raw_settings.to_byte_array()
                    if len(self._raw_settings) != 14:
                        raise kaitaistruct.ConsistencyError(u"raw(settings)", 14, len(self._raw_settings))
                    parent.write_bytes(self._raw_settings)
                _io__raw_settings.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
                self.settings._write__seq(_io__raw_settings)
            elif _on == H6117WireWrite.LegacyMusicMode.rolling:
                pass
                _io__raw_settings = KaitaiStream(BytesIO(bytearray(14)))
                self._io.add_child_stream(_io__raw_settings)
                _pos2 = self._io.pos()
                self._io.seek(self._io.pos() + (14))
                def handler(parent, _io__raw_settings=_io__raw_settings):
                    self._raw_settings = _io__raw_settings.to_byte_array()
                    if len(self._raw_settings) != 14:
                        raise kaitaistruct.ConsistencyError(u"raw(settings)", 14, len(self._raw_settings))
                    parent.write_bytes(self._raw_settings)
                _io__raw_settings.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
                self.settings._write__seq(_io__raw_settings)
            elif _on == H6117WireWrite.LegacyMusicMode.spectrum:
                pass
                _io__raw_settings = KaitaiStream(BytesIO(bytearray(14)))
                self._io.add_child_stream(_io__raw_settings)
                _pos2 = self._io.pos()
                self._io.seek(self._io.pos() + (14))
                def handler(parent, _io__raw_settings=_io__raw_settings):
                    self._raw_settings = _io__raw_settings.to_byte_array()
                    if len(self._raw_settings) != 14:
                        raise kaitaistruct.ConsistencyError(u"raw(settings)", 14, len(self._raw_settings))
                    parent.write_bytes(self._raw_settings)
                _io__raw_settings.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
                self.settings._write__seq(_io__raw_settings)
            else:
                pass
                _io__raw_settings = KaitaiStream(BytesIO(bytearray(14)))
                self._io.add_child_stream(_io__raw_settings)
                _pos2 = self._io.pos()
                self._io.seek(self._io.pos() + (14))
                def handler(parent, _io__raw_settings=_io__raw_settings):
                    self._raw_settings = _io__raw_settings.to_byte_array()
                    if len(self._raw_settings) != 14:
                        raise kaitaistruct.ConsistencyError(u"raw(settings)", 14, len(self._raw_settings))
                    parent.write_bytes(self._raw_settings)
                _io__raw_settings.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
                self.settings._write__seq(_io__raw_settings)


        def _check(self):
            _on = self.mode_id
            if _on == H6117WireWrite.LegacyMusicMode.rhythm:
                pass
            elif _on == H6117WireWrite.LegacyMusicMode.rolling:
                pass
            elif _on == H6117WireWrite.LegacyMusicMode.spectrum:
                pass
            else:
                pass
            self._dirty = False


    class ModeBody(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H6117WireWrite.ModeBody, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.sub = KaitaiStream.resolve_enum(H6117WireWrite.ModeSub, self._io.read_u1())
            _on = self.sub
            if _on == H6117WireWrite.ModeSub.diy:
                pass
                self._raw_sub_body = self._io.read_bytes(16)
                _io__raw_sub_body = KaitaiStream(BytesIO(self._raw_sub_body))
                self.sub_body = H6117WireWrite.DiySelector(_io__raw_sub_body, self, self._root)
                self.sub_body._read()
            elif _on == H6117WireWrite.ModeSub.legacy_colour:
                pass
                self._raw_sub_body = self._io.read_bytes(16)
                _io__raw_sub_body = KaitaiStream(BytesIO(self._raw_sub_body))
                self.sub_body = h6125_wire_write.H6125WireWrite.LegacyColour(_io__raw_sub_body)
                self.sub_body._read()
            elif _on == H6117WireWrite.ModeSub.legacy_music:
                pass
                self._raw_sub_body = self._io.read_bytes(16)
                _io__raw_sub_body = KaitaiStream(BytesIO(self._raw_sub_body))
                self.sub_body = H6117WireWrite.LegacyMusicSelector(_io__raw_sub_body, self, self._root)
                self.sub_body._read()
            elif _on == H6117WireWrite.ModeSub.music:
                pass
                self._raw_sub_body = self._io.read_bytes(16)
                _io__raw_sub_body = KaitaiStream(BytesIO(self._raw_sub_body))
                self.sub_body = H6117WireWrite.MusicSelector(_io__raw_sub_body, self, self._root)
                self.sub_body._read()
            elif _on == H6117WireWrite.ModeSub.scene:
                pass
                self._raw_sub_body = self._io.read_bytes(16)
                _io__raw_sub_body = KaitaiStream(BytesIO(self._raw_sub_body))
                self.sub_body = H6117WireWrite.SceneActivate(_io__raw_sub_body, self, self._root)
                self.sub_body._read()
            elif _on == H6117WireWrite.ModeSub.static:
                pass
                self._raw_sub_body = self._io.read_bytes(16)
                _io__raw_sub_body = KaitaiStream(BytesIO(self._raw_sub_body))
                self.sub_body = H6117WireWrite.StaticCmd(_io__raw_sub_body, self, self._root)
                self.sub_body._read()
            elif _on == H6117WireWrite.ModeSub.whole_device_colour:
                pass
                self._raw_sub_body = self._io.read_bytes(16)
                _io__raw_sub_body = KaitaiStream(BytesIO(self._raw_sub_body))
                self.sub_body = H6117WireWrite.WholeDeviceColour(_io__raw_sub_body, self, self._root)
                self.sub_body._read()
            else:
                pass
                self.sub_body = self._io.read_bytes(16)
            self._dirty = False


        def _fetch_instances(self):
            pass
            _on = self.sub
            if _on == H6117WireWrite.ModeSub.diy:
                pass
                self.sub_body._fetch_instances()
            elif _on == H6117WireWrite.ModeSub.legacy_colour:
                pass
                self.sub_body._fetch_instances()
            elif _on == H6117WireWrite.ModeSub.legacy_music:
                pass
                self.sub_body._fetch_instances()
            elif _on == H6117WireWrite.ModeSub.music:
                pass
                self.sub_body._fetch_instances()
            elif _on == H6117WireWrite.ModeSub.scene:
                pass
                self.sub_body._fetch_instances()
            elif _on == H6117WireWrite.ModeSub.static:
                pass
                self.sub_body._fetch_instances()
            elif _on == H6117WireWrite.ModeSub.whole_device_colour:
                pass
                self.sub_body._fetch_instances()
            else:
                pass


        def _write__seq(self, io=None):
            super(H6117WireWrite.ModeBody, self)._write__seq(io)
            self._io.write_u1(int(self.sub))
            _on = self.sub
            if _on == H6117WireWrite.ModeSub.diy:
                pass
                _io__raw_sub_body = KaitaiStream(BytesIO(bytearray(16)))
                self._io.add_child_stream(_io__raw_sub_body)
                _pos2 = self._io.pos()
                self._io.seek(self._io.pos() + (16))
                def handler(parent, _io__raw_sub_body=_io__raw_sub_body):
                    self._raw_sub_body = _io__raw_sub_body.to_byte_array()
                    if len(self._raw_sub_body) != 16:
                        raise kaitaistruct.ConsistencyError(u"raw(sub_body)", 16, len(self._raw_sub_body))
                    parent.write_bytes(self._raw_sub_body)
                _io__raw_sub_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
                self.sub_body._write__seq(_io__raw_sub_body)
            elif _on == H6117WireWrite.ModeSub.legacy_colour:
                pass
                _io__raw_sub_body = KaitaiStream(BytesIO(bytearray(16)))
                self._io.add_child_stream(_io__raw_sub_body)
                _pos2 = self._io.pos()
                self._io.seek(self._io.pos() + (16))
                def handler(parent, _io__raw_sub_body=_io__raw_sub_body):
                    self._raw_sub_body = _io__raw_sub_body.to_byte_array()
                    if len(self._raw_sub_body) != 16:
                        raise kaitaistruct.ConsistencyError(u"raw(sub_body)", 16, len(self._raw_sub_body))
                    parent.write_bytes(self._raw_sub_body)
                _io__raw_sub_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
                self.sub_body._write__seq(_io__raw_sub_body)
            elif _on == H6117WireWrite.ModeSub.legacy_music:
                pass
                _io__raw_sub_body = KaitaiStream(BytesIO(bytearray(16)))
                self._io.add_child_stream(_io__raw_sub_body)
                _pos2 = self._io.pos()
                self._io.seek(self._io.pos() + (16))
                def handler(parent, _io__raw_sub_body=_io__raw_sub_body):
                    self._raw_sub_body = _io__raw_sub_body.to_byte_array()
                    if len(self._raw_sub_body) != 16:
                        raise kaitaistruct.ConsistencyError(u"raw(sub_body)", 16, len(self._raw_sub_body))
                    parent.write_bytes(self._raw_sub_body)
                _io__raw_sub_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
                self.sub_body._write__seq(_io__raw_sub_body)
            elif _on == H6117WireWrite.ModeSub.music:
                pass
                _io__raw_sub_body = KaitaiStream(BytesIO(bytearray(16)))
                self._io.add_child_stream(_io__raw_sub_body)
                _pos2 = self._io.pos()
                self._io.seek(self._io.pos() + (16))
                def handler(parent, _io__raw_sub_body=_io__raw_sub_body):
                    self._raw_sub_body = _io__raw_sub_body.to_byte_array()
                    if len(self._raw_sub_body) != 16:
                        raise kaitaistruct.ConsistencyError(u"raw(sub_body)", 16, len(self._raw_sub_body))
                    parent.write_bytes(self._raw_sub_body)
                _io__raw_sub_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
                self.sub_body._write__seq(_io__raw_sub_body)
            elif _on == H6117WireWrite.ModeSub.scene:
                pass
                _io__raw_sub_body = KaitaiStream(BytesIO(bytearray(16)))
                self._io.add_child_stream(_io__raw_sub_body)
                _pos2 = self._io.pos()
                self._io.seek(self._io.pos() + (16))
                def handler(parent, _io__raw_sub_body=_io__raw_sub_body):
                    self._raw_sub_body = _io__raw_sub_body.to_byte_array()
                    if len(self._raw_sub_body) != 16:
                        raise kaitaistruct.ConsistencyError(u"raw(sub_body)", 16, len(self._raw_sub_body))
                    parent.write_bytes(self._raw_sub_body)
                _io__raw_sub_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
                self.sub_body._write__seq(_io__raw_sub_body)
            elif _on == H6117WireWrite.ModeSub.static:
                pass
                _io__raw_sub_body = KaitaiStream(BytesIO(bytearray(16)))
                self._io.add_child_stream(_io__raw_sub_body)
                _pos2 = self._io.pos()
                self._io.seek(self._io.pos() + (16))
                def handler(parent, _io__raw_sub_body=_io__raw_sub_body):
                    self._raw_sub_body = _io__raw_sub_body.to_byte_array()
                    if len(self._raw_sub_body) != 16:
                        raise kaitaistruct.ConsistencyError(u"raw(sub_body)", 16, len(self._raw_sub_body))
                    parent.write_bytes(self._raw_sub_body)
                _io__raw_sub_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
                self.sub_body._write__seq(_io__raw_sub_body)
            elif _on == H6117WireWrite.ModeSub.whole_device_colour:
                pass
                _io__raw_sub_body = KaitaiStream(BytesIO(bytearray(16)))
                self._io.add_child_stream(_io__raw_sub_body)
                _pos2 = self._io.pos()
                self._io.seek(self._io.pos() + (16))
                def handler(parent, _io__raw_sub_body=_io__raw_sub_body):
                    self._raw_sub_body = _io__raw_sub_body.to_byte_array()
                    if len(self._raw_sub_body) != 16:
                        raise kaitaistruct.ConsistencyError(u"raw(sub_body)", 16, len(self._raw_sub_body))
                    parent.write_bytes(self._raw_sub_body)
                _io__raw_sub_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
                self.sub_body._write__seq(_io__raw_sub_body)
            else:
                pass
                self._io.write_bytes(self.sub_body)


        def _check(self):
            _on = self.sub
            if _on == H6117WireWrite.ModeSub.diy:
                pass
                if self.sub_body._root != self._root:
                    raise kaitaistruct.ConsistencyError(u"sub_body", self._root, self.sub_body._root)
                if self.sub_body._parent != self:
                    raise kaitaistruct.ConsistencyError(u"sub_body", self, self.sub_body._parent)
            elif _on == H6117WireWrite.ModeSub.legacy_colour:
                pass
            elif _on == H6117WireWrite.ModeSub.legacy_music:
                pass
                if self.sub_body._root != self._root:
                    raise kaitaistruct.ConsistencyError(u"sub_body", self._root, self.sub_body._root)
                if self.sub_body._parent != self:
                    raise kaitaistruct.ConsistencyError(u"sub_body", self, self.sub_body._parent)
            elif _on == H6117WireWrite.ModeSub.music:
                pass
                if self.sub_body._root != self._root:
                    raise kaitaistruct.ConsistencyError(u"sub_body", self._root, self.sub_body._root)
                if self.sub_body._parent != self:
                    raise kaitaistruct.ConsistencyError(u"sub_body", self, self.sub_body._parent)
            elif _on == H6117WireWrite.ModeSub.scene:
                pass
                if self.sub_body._root != self._root:
                    raise kaitaistruct.ConsistencyError(u"sub_body", self._root, self.sub_body._root)
                if self.sub_body._parent != self:
                    raise kaitaistruct.ConsistencyError(u"sub_body", self, self.sub_body._parent)
            elif _on == H6117WireWrite.ModeSub.static:
                pass
                if self.sub_body._root != self._root:
                    raise kaitaistruct.ConsistencyError(u"sub_body", self._root, self.sub_body._root)
                if self.sub_body._parent != self:
                    raise kaitaistruct.ConsistencyError(u"sub_body", self, self.sub_body._parent)
            elif _on == H6117WireWrite.ModeSub.whole_device_colour:
                pass
                if self.sub_body._root != self._root:
                    raise kaitaistruct.ConsistencyError(u"sub_body", self._root, self.sub_body._root)
                if self.sub_body._parent != self:
                    raise kaitaistruct.ConsistencyError(u"sub_body", self, self.sub_body._parent)
            else:
                pass
                if len(self.sub_body) != 16:
                    raise kaitaistruct.ConsistencyError(u"sub_body", 16, len(self.sub_body))
            self._dirty = False


    class MusicSelector(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H6117WireWrite.MusicSelector, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.selector = govee_common.GoveeCommon.MusicSelector(self._io)
            self.selector._read()
            self.unknown_tail = self._io.read_bytes_full()
            self._dirty = False


        def _fetch_instances(self):
            pass
            self.selector._fetch_instances()


        def _write__seq(self, io=None):
            super(H6117WireWrite.MusicSelector, self)._write__seq(io)
            self.selector._write__seq(self._io)
            self._io.write_bytes(self.unknown_tail)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"unknown_tail", 0, self._io.size() - self._io.pos())


        def _check(self):
            self._dirty = False


    class SceneActivate(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H6117WireWrite.SceneActivate, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.code = self._io.read_u2le()
            self.scene_type = self._io.read_u1()
            self.unknown_tail = self._io.read_bytes_full()
            self._dirty = False


        def _fetch_instances(self):
            pass


        def _write__seq(self, io=None):
            super(H6117WireWrite.SceneActivate, self)._write__seq(io)
            self._io.write_u2le(self.code)
            self._io.write_u1(self.scene_type)
            self._io.write_bytes(self.unknown_tail)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"unknown_tail", 0, self._io.size() - self._io.pos())


        def _check(self):
            self._dirty = False


    class StaticBrightness(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H6117WireWrite.StaticBrightness, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.percent = self._io.read_u1()
            self.mask = command_write.CommandWrite.SegmentMask(self._io)
            self.mask._read()
            self.unknown_tail = self._io.read_bytes_full()
            self._dirty = False


        def _fetch_instances(self):
            pass
            self.mask._fetch_instances()


        def _write__seq(self, io=None):
            super(H6117WireWrite.StaticBrightness, self)._write__seq(io)
            self._io.write_u1(self.percent)
            self.mask._write__seq(self._io)
            self._io.write_bytes(self.unknown_tail)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"unknown_tail", 0, self._io.size() - self._io.pos())


        def _check(self):
            self._dirty = False


    class StaticCmd(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H6117WireWrite.StaticCmd, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.static_sub = self._io.read_u1()
            _on = self.static_sub
            if _on == 1:
                pass
                self._raw_static_body = self._io.read_bytes(15)
                _io__raw_static_body = KaitaiStream(BytesIO(self._raw_static_body))
                self.static_body = H6117WireWrite.StaticColour(_io__raw_static_body, self, self._root)
                self.static_body._read()
            elif _on == 2:
                pass
                self._raw_static_body = self._io.read_bytes(15)
                _io__raw_static_body = KaitaiStream(BytesIO(self._raw_static_body))
                self.static_body = H6117WireWrite.StaticBrightness(_io__raw_static_body, self, self._root)
                self.static_body._read()
            elif _on == 3:
                pass
                self._raw_static_body = self._io.read_bytes(15)
                _io__raw_static_body = KaitaiStream(BytesIO(self._raw_static_body))
                self.static_body = command_write.CommandWrite.StaticBrightnessAll(_io__raw_static_body)
                self.static_body._read()
            else:
                pass
                self.static_body = self._io.read_bytes(15)
            self._dirty = False


        def _fetch_instances(self):
            pass
            _on = self.static_sub
            if _on == 1:
                pass
                self.static_body._fetch_instances()
            elif _on == 2:
                pass
                self.static_body._fetch_instances()
            elif _on == 3:
                pass
                self.static_body._fetch_instances()
            else:
                pass


        def _write__seq(self, io=None):
            super(H6117WireWrite.StaticCmd, self)._write__seq(io)
            self._io.write_u1(self.static_sub)
            _on = self.static_sub
            if _on == 1:
                pass
                _io__raw_static_body = KaitaiStream(BytesIO(bytearray(15)))
                self._io.add_child_stream(_io__raw_static_body)
                _pos2 = self._io.pos()
                self._io.seek(self._io.pos() + (15))
                def handler(parent, _io__raw_static_body=_io__raw_static_body):
                    self._raw_static_body = _io__raw_static_body.to_byte_array()
                    if len(self._raw_static_body) != 15:
                        raise kaitaistruct.ConsistencyError(u"raw(static_body)", 15, len(self._raw_static_body))
                    parent.write_bytes(self._raw_static_body)
                _io__raw_static_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
                self.static_body._write__seq(_io__raw_static_body)
            elif _on == 2:
                pass
                _io__raw_static_body = KaitaiStream(BytesIO(bytearray(15)))
                self._io.add_child_stream(_io__raw_static_body)
                _pos2 = self._io.pos()
                self._io.seek(self._io.pos() + (15))
                def handler(parent, _io__raw_static_body=_io__raw_static_body):
                    self._raw_static_body = _io__raw_static_body.to_byte_array()
                    if len(self._raw_static_body) != 15:
                        raise kaitaistruct.ConsistencyError(u"raw(static_body)", 15, len(self._raw_static_body))
                    parent.write_bytes(self._raw_static_body)
                _io__raw_static_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
                self.static_body._write__seq(_io__raw_static_body)
            elif _on == 3:
                pass
                _io__raw_static_body = KaitaiStream(BytesIO(bytearray(15)))
                self._io.add_child_stream(_io__raw_static_body)
                _pos2 = self._io.pos()
                self._io.seek(self._io.pos() + (15))
                def handler(parent, _io__raw_static_body=_io__raw_static_body):
                    self._raw_static_body = _io__raw_static_body.to_byte_array()
                    if len(self._raw_static_body) != 15:
                        raise kaitaistruct.ConsistencyError(u"raw(static_body)", 15, len(self._raw_static_body))
                    parent.write_bytes(self._raw_static_body)
                _io__raw_static_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
                self.static_body._write__seq(_io__raw_static_body)
            else:
                pass
                self._io.write_bytes(self.static_body)


        def _check(self):
            _on = self.static_sub
            if _on == 1:
                pass
                if self.static_body._root != self._root:
                    raise kaitaistruct.ConsistencyError(u"static_body", self._root, self.static_body._root)
                if self.static_body._parent != self:
                    raise kaitaistruct.ConsistencyError(u"static_body", self, self.static_body._parent)
            elif _on == 2:
                pass
                if self.static_body._root != self._root:
                    raise kaitaistruct.ConsistencyError(u"static_body", self._root, self.static_body._root)
                if self.static_body._parent != self:
                    raise kaitaistruct.ConsistencyError(u"static_body", self, self.static_body._parent)
            elif _on == 3:
                pass
            else:
                pass
                if len(self.static_body) != 15:
                    raise kaitaistruct.ConsistencyError(u"static_body", 15, len(self.static_body))
            self._dirty = False


    class StaticColour(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H6117WireWrite.StaticColour, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.rgb_direct = govee_shared.GoveeShared.Rgb(self._io)
            self.rgb_direct._read()
            self.kelvin = self._io.read_u2be()
            self.rgb_preview = govee_shared.GoveeShared.Rgb(self._io)
            self.rgb_preview._read()
            self.mask = command_write.CommandWrite.SegmentMask(self._io)
            self.mask._read()
            self.unknown_tail = self._io.read_bytes_full()
            self._dirty = False


        def _fetch_instances(self):
            pass
            self.rgb_direct._fetch_instances()
            self.rgb_preview._fetch_instances()
            self.mask._fetch_instances()


        def _write__seq(self, io=None):
            super(H6117WireWrite.StaticColour, self)._write__seq(io)
            self.rgb_direct._write__seq(self._io)
            self._io.write_u2be(self.kelvin)
            self.rgb_preview._write__seq(self._io)
            self.mask._write__seq(self._io)
            self._io.write_bytes(self.unknown_tail)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"unknown_tail", 0, self._io.size() - self._io.pos())


        def _check(self):
            self._dirty = False


    class WholeDeviceColour(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H6117WireWrite.WholeDeviceColour, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.rgb = govee_shared.GoveeShared.Rgb(self._io)
            self.rgb._read()
            self.unknown_tail = self._io.read_bytes_full()
            self._dirty = False


        def _fetch_instances(self):
            pass
            self.rgb._fetch_instances()


        def _write__seq(self, io=None):
            super(H6117WireWrite.WholeDeviceColour, self)._write__seq(io)
            self.rgb._write__seq(self._io)
            self._io.write_bytes(self.unknown_tail)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"unknown_tail", 0, self._io.size() - self._io.pos())


        def _check(self):
            self._dirty = False



