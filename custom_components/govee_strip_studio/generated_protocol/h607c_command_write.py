# This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild
# type: ignore

import kaitaistruct
from kaitaistruct import ReadWriteKaitaiStruct, KaitaiStream, BytesIO
from custom_components.govee_strip_studio.generated_protocol import command_write
from custom_components.govee_strip_studio.generated_protocol import h607c_music_write
from enum import IntEnum


if getattr(kaitaistruct, 'API_VERSION', (0, 9)) < (0, 11):
    raise Exception("Incompatible Kaitai Struct Python API: 0.11 or later is required, but you have %s" % (kaitaistruct.__version__))

class H607cCommandWrite(ReadWriteKaitaiStruct):
    """H607C.
    Compatibility hypothesis: common power, percentage brightness, scene and
    DIY selectors use the ordinary 33 envelope. Static selector 15 carries
    two-byte masks and thirteen brightness values. Independent native zone
    and power-on settings use h607c_control.
    Unused bytes, rendering, replies and revision timing need qualification.
    """

    class CommandOp(IntEnum):
        power = 1
        brightness = 4
        multi = 5

    class MultiSub(IntEnum):
        scene = 4
        diy = 10
        music = 19
        static = 21
    def __init__(self, _io=None, _parent=None, _root=None):
        super(H607cCommandWrite, self).__init__(_io)
        self._parent = _parent
        self._root = _root or self

    def _read(self):
        self.header = self._io.read_bytes(1)
        if not self.header == b"\x33":
            raise kaitaistruct.ValidationNotEqualError(b"\x33", self.header, self._io, u"/seq/0")
        self.opcode = KaitaiStream.resolve_enum(H607cCommandWrite.CommandOp, self._io.read_u1())
        _on = self.opcode
        if _on == H607cCommandWrite.CommandOp.brightness:
            pass
            self._raw_body = self._io.read_bytes(17)
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = command_write.CommandWrite.BrightnessCmd(_io__raw_body)
            self.body._read()
        elif _on == H607cCommandWrite.CommandOp.multi:
            pass
            self._raw_body = self._io.read_bytes(17)
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = H607cCommandWrite.MultiCmd(_io__raw_body, self, self._root)
            self.body._read()
        elif _on == H607cCommandWrite.CommandOp.power:
            pass
            self._raw_body = self._io.read_bytes(17)
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = command_write.CommandWrite.PowerCmd(_io__raw_body)
            self.body._read()
        else:
            pass
            self.body = self._io.read_bytes(17)
        self.checksum = self._io.read_u1()
        self._dirty = False


    def _fetch_instances(self):
        pass
        _on = self.opcode
        if _on == H607cCommandWrite.CommandOp.brightness:
            pass
            self.body._fetch_instances()
        elif _on == H607cCommandWrite.CommandOp.multi:
            pass
            self.body._fetch_instances()
        elif _on == H607cCommandWrite.CommandOp.power:
            pass
            self.body._fetch_instances()
        else:
            pass


    def _write__seq(self, io=None):
        super(H607cCommandWrite, self)._write__seq(io)
        self._io.write_bytes(self.header)
        self._io.write_u1(int(self.opcode))
        _on = self.opcode
        if _on == H607cCommandWrite.CommandOp.brightness:
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
        elif _on == H607cCommandWrite.CommandOp.multi:
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
        elif _on == H607cCommandWrite.CommandOp.power:
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
        if _on == H607cCommandWrite.CommandOp.brightness:
            pass
        elif _on == H607cCommandWrite.CommandOp.multi:
            pass
            if self.body._root != self._root:
                raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
            if self.body._parent != self:
                raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
        elif _on == H607cCommandWrite.CommandOp.power:
            pass
        else:
            pass
            if len(self.body) != 17:
                raise kaitaistruct.ConsistencyError(u"body", 17, len(self.body))
        self._dirty = False

    class DiySelector(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cCommandWrite.DiySelector, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.code = self._io.read_u2le()
            self.companion = self._io.read_u2le()
            self.unknown_tail = self._io.read_bytes_full()
            self._dirty = False


        def _fetch_instances(self):
            pass


        def _write__seq(self, io=None):
            super(H607cCommandWrite.DiySelector, self)._write__seq(io)
            self._io.write_u2le(self.code)
            self._io.write_u2le(self.companion)
            self._io.write_bytes(self.unknown_tail)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"unknown_tail", 0, self._io.size() - self._io.pos())


        def _check(self):
            self._dirty = False


    class MultiCmd(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cCommandWrite.MultiCmd, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.sub = KaitaiStream.resolve_enum(H607cCommandWrite.MultiSub, self._io.read_u1())
            _on = self.sub
            if _on == H607cCommandWrite.MultiSub.diy:
                pass
                self._raw_sub_body = self._io.read_bytes(16)
                _io__raw_sub_body = KaitaiStream(BytesIO(self._raw_sub_body))
                self.sub_body = H607cCommandWrite.DiySelector(_io__raw_sub_body, self, self._root)
                self.sub_body._read()
            elif _on == H607cCommandWrite.MultiSub.music:
                pass
                self._raw_sub_body = self._io.read_bytes(16)
                _io__raw_sub_body = KaitaiStream(BytesIO(self._raw_sub_body))
                self.sub_body = h607c_music_write.H607cMusicWrite.MusicSelector(_io__raw_sub_body)
                self.sub_body._read()
            elif _on == H607cCommandWrite.MultiSub.scene:
                pass
                self._raw_sub_body = self._io.read_bytes(16)
                _io__raw_sub_body = KaitaiStream(BytesIO(self._raw_sub_body))
                self.sub_body = command_write.CommandWrite.SceneActivate(_io__raw_sub_body)
                self.sub_body._read()
            elif _on == H607cCommandWrite.MultiSub.static:
                pass
                self._raw_sub_body = self._io.read_bytes(16)
                _io__raw_sub_body = KaitaiStream(BytesIO(self._raw_sub_body))
                self.sub_body = H607cCommandWrite.StaticCmd(_io__raw_sub_body, self, self._root)
                self.sub_body._read()
            else:
                pass
                self.sub_body = self._io.read_bytes(16)
            self._dirty = False


        def _fetch_instances(self):
            pass
            _on = self.sub
            if _on == H607cCommandWrite.MultiSub.diy:
                pass
                self.sub_body._fetch_instances()
            elif _on == H607cCommandWrite.MultiSub.music:
                pass
                self.sub_body._fetch_instances()
            elif _on == H607cCommandWrite.MultiSub.scene:
                pass
                self.sub_body._fetch_instances()
            elif _on == H607cCommandWrite.MultiSub.static:
                pass
                self.sub_body._fetch_instances()
            else:
                pass


        def _write__seq(self, io=None):
            super(H607cCommandWrite.MultiCmd, self)._write__seq(io)
            self._io.write_u1(int(self.sub))
            _on = self.sub
            if _on == H607cCommandWrite.MultiSub.diy:
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
            elif _on == H607cCommandWrite.MultiSub.music:
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
            elif _on == H607cCommandWrite.MultiSub.scene:
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
            elif _on == H607cCommandWrite.MultiSub.static:
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
            if _on == H607cCommandWrite.MultiSub.diy:
                pass
                if self.sub_body._root != self._root:
                    raise kaitaistruct.ConsistencyError(u"sub_body", self._root, self.sub_body._root)
                if self.sub_body._parent != self:
                    raise kaitaistruct.ConsistencyError(u"sub_body", self, self.sub_body._parent)
            elif _on == H607cCommandWrite.MultiSub.music:
                pass
            elif _on == H607cCommandWrite.MultiSub.scene:
                pass
            elif _on == H607cCommandWrite.MultiSub.static:
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


    class StaticBrightnessAll(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cCommandWrite.StaticBrightnessAll, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.segment_percent = []
            for i in range(13):
                self.segment_percent.append(self._io.read_u1())
                if not self.segment_percent[i] <= 100:
                    raise kaitaistruct.ValidationGreaterThanError(100, self.segment_percent[i], self._io, u"/types/static_brightness_all/seq/0")

            self.unknown_tail = self._io.read_bytes_full()
            self._dirty = False


        def _fetch_instances(self):
            pass
            for i in range(len(self.segment_percent)):
                pass



        def _write__seq(self, io=None):
            super(H607cCommandWrite.StaticBrightnessAll, self)._write__seq(io)
            for i in range(len(self.segment_percent)):
                pass
                self._io.write_u1(self.segment_percent[i])

            self._io.write_bytes(self.unknown_tail)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"unknown_tail", 0, self._io.size() - self._io.pos())


        def _check(self):
            if len(self.segment_percent) != 13:
                raise kaitaistruct.ConsistencyError(u"segment_percent", 13, len(self.segment_percent))
            for i in range(len(self.segment_percent)):
                pass
                if not self.segment_percent[i] <= 100:
                    raise kaitaistruct.ValidationGreaterThanError(100, self.segment_percent[i], None, u"/types/static_brightness_all/seq/0")

            self._dirty = False


    class StaticCmd(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cCommandWrite.StaticCmd, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.static_sub = self._io.read_u1()
            _on = self.static_sub
            if _on == 1:
                pass
                self._raw_static_body = self._io.read_bytes(15)
                _io__raw_static_body = KaitaiStream(BytesIO(self._raw_static_body))
                self.static_body = command_write.CommandWrite.StaticColor(_io__raw_static_body)
                self.static_body._read()
            elif _on == 2:
                pass
                self._raw_static_body = self._io.read_bytes(15)
                _io__raw_static_body = KaitaiStream(BytesIO(self._raw_static_body))
                self.static_body = command_write.CommandWrite.StaticBrightness(_io__raw_static_body)
                self.static_body._read()
            elif _on == 3:
                pass
                self._raw_static_body = self._io.read_bytes(15)
                _io__raw_static_body = KaitaiStream(BytesIO(self._raw_static_body))
                self.static_body = H607cCommandWrite.StaticBrightnessAll(_io__raw_static_body, self, self._root)
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
            super(H607cCommandWrite.StaticCmd, self)._write__seq(io)
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
            elif _on == 2:
                pass
            elif _on == 3:
                pass
                if self.static_body._root != self._root:
                    raise kaitaistruct.ConsistencyError(u"static_body", self._root, self.static_body._root)
                if self.static_body._parent != self:
                    raise kaitaistruct.ConsistencyError(u"static_body", self, self.static_body._parent)
            else:
                pass
                if len(self.static_body) != 15:
                    raise kaitaistruct.ConsistencyError(u"static_body", 15, len(self.static_body))
            self._dirty = False


    @property
    def is_static(self):
        if hasattr(self, '_m_is_static'):
            return self._m_is_static

        self._m_is_static =  ((self.opcode == H607cCommandWrite.CommandOp.multi) and (self.body.sub == H607cCommandWrite.MultiSub.static) and ( ((self.body.sub_body.static_sub == 1) or (self.body.sub_body.static_sub == 2) or (self.body.sub_body.static_sub == 3)) )) 
        return getattr(self, '_m_is_static', None)

    def _invalidate_is_static(self):
        del self._m_is_static

