# This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild
# type: ignore

import kaitaistruct
from kaitaistruct import ReadWriteKaitaiStruct, KaitaiStream, BytesIO
from custom_components.govee_strip_studio.generated_protocol import govee_shared
from enum import IntEnum


if getattr(kaitaistruct, 'API_VERSION', (0, 9)) < (0, 11):
    raise Exception("Incompatible Kaitai Struct Python API: 0.11 or later is required, but you have %s" % (kaitaistruct.__version__))

class H607cDiyBody(ReadWriteKaitaiStruct):
    """H607C.
    Compatibility hypothesis: native bodies begin with 0b and a family byte.
    Composite 153 stores two effect/length/parameter sections, without
    repeating each section's native marker or family. A zero effect and
    zero length disable that effect section, independently of lamp power.
    Transport command 56 and activation selector 254 are separate namespaces.
    Variant-specific eligibility, rendering and persistent slot behaviour
    require qualification; opaque suffixes are preserved.
    """

    class ActivationSelector(IntEnum):
        temporary = 254

    class Family(IntEnum):
        gradual = 106
        breathe = 107
        stream = 108
        colour_wall = 109
        shimmer = 110
        chase = 111
        shock = 112
        drip = 113
        lava = 114
        paired = 153

    class UploadSubtype(IntEnum):
        native_diy = 86

    class Variant(IntEnum):
        primary = 0
        native_13 = 13
        native_14 = 14
        native_88 = 88
        native_89 = 89
    def __init__(self, _io=None, _parent=None, _root=None):
        super(H607cDiyBody, self).__init__(_io)
        self._parent = _parent
        self._root = _root or self

    def _read(self):
        self.marker = self._io.read_bytes(1)
        if not self.marker == b"\x0B":
            raise kaitaistruct.ValidationNotEqualError(b"\x0B", self.marker, self._io, u"/seq/0")
        self.family = KaitaiStream.resolve_enum(H607cDiyBody.Family, self._io.read_u1())
        _on = self.family
        if _on == H607cDiyBody.Family.breathe:
            pass
            self._raw_body = self._io.read_bytes_full()
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = H607cDiyBody.Parameters(self.family, _io__raw_body, self, self._root)
            self.body._read()
        elif _on == H607cDiyBody.Family.chase:
            pass
            self._raw_body = self._io.read_bytes_full()
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = H607cDiyBody.Parameters(self.family, _io__raw_body, self, self._root)
            self.body._read()
        elif _on == H607cDiyBody.Family.colour_wall:
            pass
            self._raw_body = self._io.read_bytes_full()
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = H607cDiyBody.Parameters(self.family, _io__raw_body, self, self._root)
            self.body._read()
        elif _on == H607cDiyBody.Family.drip:
            pass
            self._raw_body = self._io.read_bytes_full()
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = H607cDiyBody.Parameters(self.family, _io__raw_body, self, self._root)
            self.body._read()
        elif _on == H607cDiyBody.Family.gradual:
            pass
            self._raw_body = self._io.read_bytes_full()
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = H607cDiyBody.Parameters(self.family, _io__raw_body, self, self._root)
            self.body._read()
        elif _on == H607cDiyBody.Family.lava:
            pass
            self._raw_body = self._io.read_bytes_full()
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = H607cDiyBody.Parameters(self.family, _io__raw_body, self, self._root)
            self.body._read()
        elif _on == H607cDiyBody.Family.paired:
            pass
            self._raw_body = self._io.read_bytes_full()
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = H607cDiyBody.PairedParameters(_io__raw_body, self, self._root)
            self.body._read()
        elif _on == H607cDiyBody.Family.shimmer:
            pass
            self._raw_body = self._io.read_bytes_full()
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = H607cDiyBody.Parameters(self.family, _io__raw_body, self, self._root)
            self.body._read()
        elif _on == H607cDiyBody.Family.shock:
            pass
            self._raw_body = self._io.read_bytes_full()
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = H607cDiyBody.Parameters(self.family, _io__raw_body, self, self._root)
            self.body._read()
        elif _on == H607cDiyBody.Family.stream:
            pass
            self._raw_body = self._io.read_bytes_full()
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = H607cDiyBody.Parameters(self.family, _io__raw_body, self, self._root)
            self.body._read()
        else:
            pass
            self.body = self._io.read_bytes_full()
        self.unknown_tail = self._io.read_bytes_full()
        self._dirty = False


    def _fetch_instances(self):
        pass
        _on = self.family
        if _on == H607cDiyBody.Family.breathe:
            pass
            self.body._fetch_instances()
        elif _on == H607cDiyBody.Family.chase:
            pass
            self.body._fetch_instances()
        elif _on == H607cDiyBody.Family.colour_wall:
            pass
            self.body._fetch_instances()
        elif _on == H607cDiyBody.Family.drip:
            pass
            self.body._fetch_instances()
        elif _on == H607cDiyBody.Family.gradual:
            pass
            self.body._fetch_instances()
        elif _on == H607cDiyBody.Family.lava:
            pass
            self.body._fetch_instances()
        elif _on == H607cDiyBody.Family.paired:
            pass
            self.body._fetch_instances()
        elif _on == H607cDiyBody.Family.shimmer:
            pass
            self.body._fetch_instances()
        elif _on == H607cDiyBody.Family.shock:
            pass
            self.body._fetch_instances()
        elif _on == H607cDiyBody.Family.stream:
            pass
            self.body._fetch_instances()
        else:
            pass


    def _write__seq(self, io=None):
        super(H607cDiyBody, self)._write__seq(io)
        self._io.write_bytes(self.marker)
        self._io.write_u1(int(self.family))
        _on = self.family
        if _on == H607cDiyBody.Family.breathe:
            pass
            _io__raw_body = KaitaiStream(BytesIO(bytearray(self._io.size() - self._io.pos())))
            self._io.add_child_stream(_io__raw_body)
            _pos2 = self._io.pos()
            self._io.seek(self._io.pos() + (self._io.size() - self._io.pos()))
            def handler(parent, _io__raw_body=_io__raw_body):
                self._raw_body = _io__raw_body.to_byte_array()
                parent.write_bytes(self._raw_body)
                if not parent.is_eof():
                    raise kaitaistruct.ConsistencyError(u"raw(body)", 0, parent.size() - parent.pos())
            _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
            self.body._write__seq(_io__raw_body)
        elif _on == H607cDiyBody.Family.chase:
            pass
            _io__raw_body = KaitaiStream(BytesIO(bytearray(self._io.size() - self._io.pos())))
            self._io.add_child_stream(_io__raw_body)
            _pos2 = self._io.pos()
            self._io.seek(self._io.pos() + (self._io.size() - self._io.pos()))
            def handler(parent, _io__raw_body=_io__raw_body):
                self._raw_body = _io__raw_body.to_byte_array()
                parent.write_bytes(self._raw_body)
                if not parent.is_eof():
                    raise kaitaistruct.ConsistencyError(u"raw(body)", 0, parent.size() - parent.pos())
            _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
            self.body._write__seq(_io__raw_body)
        elif _on == H607cDiyBody.Family.colour_wall:
            pass
            _io__raw_body = KaitaiStream(BytesIO(bytearray(self._io.size() - self._io.pos())))
            self._io.add_child_stream(_io__raw_body)
            _pos2 = self._io.pos()
            self._io.seek(self._io.pos() + (self._io.size() - self._io.pos()))
            def handler(parent, _io__raw_body=_io__raw_body):
                self._raw_body = _io__raw_body.to_byte_array()
                parent.write_bytes(self._raw_body)
                if not parent.is_eof():
                    raise kaitaistruct.ConsistencyError(u"raw(body)", 0, parent.size() - parent.pos())
            _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
            self.body._write__seq(_io__raw_body)
        elif _on == H607cDiyBody.Family.drip:
            pass
            _io__raw_body = KaitaiStream(BytesIO(bytearray(self._io.size() - self._io.pos())))
            self._io.add_child_stream(_io__raw_body)
            _pos2 = self._io.pos()
            self._io.seek(self._io.pos() + (self._io.size() - self._io.pos()))
            def handler(parent, _io__raw_body=_io__raw_body):
                self._raw_body = _io__raw_body.to_byte_array()
                parent.write_bytes(self._raw_body)
                if not parent.is_eof():
                    raise kaitaistruct.ConsistencyError(u"raw(body)", 0, parent.size() - parent.pos())
            _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
            self.body._write__seq(_io__raw_body)
        elif _on == H607cDiyBody.Family.gradual:
            pass
            _io__raw_body = KaitaiStream(BytesIO(bytearray(self._io.size() - self._io.pos())))
            self._io.add_child_stream(_io__raw_body)
            _pos2 = self._io.pos()
            self._io.seek(self._io.pos() + (self._io.size() - self._io.pos()))
            def handler(parent, _io__raw_body=_io__raw_body):
                self._raw_body = _io__raw_body.to_byte_array()
                parent.write_bytes(self._raw_body)
                if not parent.is_eof():
                    raise kaitaistruct.ConsistencyError(u"raw(body)", 0, parent.size() - parent.pos())
            _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
            self.body._write__seq(_io__raw_body)
        elif _on == H607cDiyBody.Family.lava:
            pass
            _io__raw_body = KaitaiStream(BytesIO(bytearray(self._io.size() - self._io.pos())))
            self._io.add_child_stream(_io__raw_body)
            _pos2 = self._io.pos()
            self._io.seek(self._io.pos() + (self._io.size() - self._io.pos()))
            def handler(parent, _io__raw_body=_io__raw_body):
                self._raw_body = _io__raw_body.to_byte_array()
                parent.write_bytes(self._raw_body)
                if not parent.is_eof():
                    raise kaitaistruct.ConsistencyError(u"raw(body)", 0, parent.size() - parent.pos())
            _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
            self.body._write__seq(_io__raw_body)
        elif _on == H607cDiyBody.Family.paired:
            pass
            _io__raw_body = KaitaiStream(BytesIO(bytearray(self._io.size() - self._io.pos())))
            self._io.add_child_stream(_io__raw_body)
            _pos2 = self._io.pos()
            self._io.seek(self._io.pos() + (self._io.size() - self._io.pos()))
            def handler(parent, _io__raw_body=_io__raw_body):
                self._raw_body = _io__raw_body.to_byte_array()
                parent.write_bytes(self._raw_body)
                if not parent.is_eof():
                    raise kaitaistruct.ConsistencyError(u"raw(body)", 0, parent.size() - parent.pos())
            _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
            self.body._write__seq(_io__raw_body)
        elif _on == H607cDiyBody.Family.shimmer:
            pass
            _io__raw_body = KaitaiStream(BytesIO(bytearray(self._io.size() - self._io.pos())))
            self._io.add_child_stream(_io__raw_body)
            _pos2 = self._io.pos()
            self._io.seek(self._io.pos() + (self._io.size() - self._io.pos()))
            def handler(parent, _io__raw_body=_io__raw_body):
                self._raw_body = _io__raw_body.to_byte_array()
                parent.write_bytes(self._raw_body)
                if not parent.is_eof():
                    raise kaitaistruct.ConsistencyError(u"raw(body)", 0, parent.size() - parent.pos())
            _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
            self.body._write__seq(_io__raw_body)
        elif _on == H607cDiyBody.Family.shock:
            pass
            _io__raw_body = KaitaiStream(BytesIO(bytearray(self._io.size() - self._io.pos())))
            self._io.add_child_stream(_io__raw_body)
            _pos2 = self._io.pos()
            self._io.seek(self._io.pos() + (self._io.size() - self._io.pos()))
            def handler(parent, _io__raw_body=_io__raw_body):
                self._raw_body = _io__raw_body.to_byte_array()
                parent.write_bytes(self._raw_body)
                if not parent.is_eof():
                    raise kaitaistruct.ConsistencyError(u"raw(body)", 0, parent.size() - parent.pos())
            _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
            self.body._write__seq(_io__raw_body)
        elif _on == H607cDiyBody.Family.stream:
            pass
            _io__raw_body = KaitaiStream(BytesIO(bytearray(self._io.size() - self._io.pos())))
            self._io.add_child_stream(_io__raw_body)
            _pos2 = self._io.pos()
            self._io.seek(self._io.pos() + (self._io.size() - self._io.pos()))
            def handler(parent, _io__raw_body=_io__raw_body):
                self._raw_body = _io__raw_body.to_byte_array()
                parent.write_bytes(self._raw_body)
                if not parent.is_eof():
                    raise kaitaistruct.ConsistencyError(u"raw(body)", 0, parent.size() - parent.pos())
            _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
            self.body._write__seq(_io__raw_body)
        else:
            pass
            self._io.write_bytes(self.body)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"body", 0, self._io.size() - self._io.pos())
        self._io.write_bytes(self.unknown_tail)
        if not self._io.is_eof():
            raise kaitaistruct.ConsistencyError(u"unknown_tail", 0, self._io.size() - self._io.pos())


    def _check(self):
        if len(self.marker) != 1:
            raise kaitaistruct.ConsistencyError(u"marker", 1, len(self.marker))
        if not self.marker == b"\x0B":
            raise kaitaistruct.ValidationNotEqualError(b"\x0B", self.marker, None, u"/seq/0")
        _on = self.family
        if _on == H607cDiyBody.Family.breathe:
            pass
            if self.body._root != self._root:
                raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
            if self.body._parent != self:
                raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
            if self.body.family != self.family:
                raise kaitaistruct.ConsistencyError(u"body", self.family, self.body.family)
        elif _on == H607cDiyBody.Family.chase:
            pass
            if self.body._root != self._root:
                raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
            if self.body._parent != self:
                raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
            if self.body.family != self.family:
                raise kaitaistruct.ConsistencyError(u"body", self.family, self.body.family)
        elif _on == H607cDiyBody.Family.colour_wall:
            pass
            if self.body._root != self._root:
                raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
            if self.body._parent != self:
                raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
            if self.body.family != self.family:
                raise kaitaistruct.ConsistencyError(u"body", self.family, self.body.family)
        elif _on == H607cDiyBody.Family.drip:
            pass
            if self.body._root != self._root:
                raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
            if self.body._parent != self:
                raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
            if self.body.family != self.family:
                raise kaitaistruct.ConsistencyError(u"body", self.family, self.body.family)
        elif _on == H607cDiyBody.Family.gradual:
            pass
            if self.body._root != self._root:
                raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
            if self.body._parent != self:
                raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
            if self.body.family != self.family:
                raise kaitaistruct.ConsistencyError(u"body", self.family, self.body.family)
        elif _on == H607cDiyBody.Family.lava:
            pass
            if self.body._root != self._root:
                raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
            if self.body._parent != self:
                raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
            if self.body.family != self.family:
                raise kaitaistruct.ConsistencyError(u"body", self.family, self.body.family)
        elif _on == H607cDiyBody.Family.paired:
            pass
            if self.body._root != self._root:
                raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
            if self.body._parent != self:
                raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
        elif _on == H607cDiyBody.Family.shimmer:
            pass
            if self.body._root != self._root:
                raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
            if self.body._parent != self:
                raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
            if self.body.family != self.family:
                raise kaitaistruct.ConsistencyError(u"body", self.family, self.body.family)
        elif _on == H607cDiyBody.Family.shock:
            pass
            if self.body._root != self._root:
                raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
            if self.body._parent != self:
                raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
            if self.body.family != self.family:
                raise kaitaistruct.ConsistencyError(u"body", self.family, self.body.family)
        elif _on == H607cDiyBody.Family.stream:
            pass
            if self.body._root != self._root:
                raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
            if self.body._parent != self:
                raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
            if self.body.family != self.family:
                raise kaitaistruct.ConsistencyError(u"body", self.family, self.body.family)
        else:
            pass
        self._dirty = False

    class PairedParameters(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cDiyBody.PairedParameters, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.pole = H607cDiyBody.Zone(self._io, self, self._root)
            self.pole._read()
            self.base = H607cDiyBody.Zone(self._io, self, self._root)
            self.base._read()
            self.unknown_tail = self._io.read_bytes_full()
            self._dirty = False


        def _fetch_instances(self):
            pass
            self.pole._fetch_instances()
            self.base._fetch_instances()


        def _write__seq(self, io=None):
            super(H607cDiyBody.PairedParameters, self)._write__seq(io)
            self.pole._write__seq(self._io)
            self.base._write__seq(self._io)
            self._io.write_bytes(self.unknown_tail)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"unknown_tail", 0, self._io.size() - self._io.pos())


        def _check(self):
            if self.pole._root != self._root:
                raise kaitaistruct.ConsistencyError(u"pole", self._root, self.pole._root)
            if self.pole._parent != self:
                raise kaitaistruct.ConsistencyError(u"pole", self, self.pole._parent)
            if self.base._root != self._root:
                raise kaitaistruct.ConsistencyError(u"base", self._root, self.base._root)
            if self.base._parent != self:
                raise kaitaistruct.ConsistencyError(u"base", self, self.base._parent)
            self._dirty = False


    class Palette(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cDiyBody.Palette, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.num_colours = self._io.read_u1()
            self.colours = []
            for i in range(self.num_colours):
                _t_colours = govee_shared.GoveeShared.Rgb(self._io)
                try:
                    _t_colours._read()
                finally:
                    self.colours.append(_t_colours)

            self._dirty = False


        def _fetch_instances(self):
            pass
            for i in range(len(self.colours)):
                pass
                self.colours[i]._fetch_instances()



        def _write__seq(self, io=None):
            super(H607cDiyBody.Palette, self)._write__seq(io)
            self._io.write_u1(self.num_colours)
            for i in range(len(self.colours)):
                pass
                self.colours[i]._write__seq(self._io)



        def _check(self):
            if len(self.colours) != self.num_colours:
                raise kaitaistruct.ConsistencyError(u"colours", self.num_colours, len(self.colours))
            for i in range(len(self.colours)):
                pass

            self._dirty = False


    class Parameters(ReadWriteKaitaiStruct):
        def __init__(self, family, _io=None, _parent=None, _root=None):
            super(H607cDiyBody.Parameters, self).__init__(_io)
            self._parent = _parent
            self._root = _root
            self.family = family

        def _read(self):
            self.variant = KaitaiStream.resolve_enum(H607cDiyBody.Variant, self._io.read_u1())
            self.speed = self._io.read_u1()
            self.first_palette = H607cDiyBody.Palette(self._io, self, self._root)
            self.first_palette._read()
            if  ((self.family == H607cDiyBody.Family.shimmer) or (self.family == H607cDiyBody.Family.drip)) :
                pass
                self.second_palette = H607cDiyBody.Palette(self._io, self, self._root)
                self.second_palette._read()

            self.unknown_tail = self._io.read_bytes_full()
            self._dirty = False


        def _fetch_instances(self):
            pass
            self.first_palette._fetch_instances()
            if  ((self.family == H607cDiyBody.Family.shimmer) or (self.family == H607cDiyBody.Family.drip)) :
                pass
                self.second_palette._fetch_instances()



        def _write__seq(self, io=None):
            super(H607cDiyBody.Parameters, self)._write__seq(io)
            self._io.write_u1(int(self.variant))
            self._io.write_u1(self.speed)
            self.first_palette._write__seq(self._io)
            if  ((self.family == H607cDiyBody.Family.shimmer) or (self.family == H607cDiyBody.Family.drip)) :
                pass
                self.second_palette._write__seq(self._io)

            self._io.write_bytes(self.unknown_tail)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"unknown_tail", 0, self._io.size() - self._io.pos())


        def _check(self):
            if self.first_palette._root != self._root:
                raise kaitaistruct.ConsistencyError(u"first_palette", self._root, self.first_palette._root)
            if self.first_palette._parent != self:
                raise kaitaistruct.ConsistencyError(u"first_palette", self, self.first_palette._parent)
            if  ((self.family == H607cDiyBody.Family.shimmer) or (self.family == H607cDiyBody.Family.drip)) :
                pass
                if self.second_palette._root != self._root:
                    raise kaitaistruct.ConsistencyError(u"second_palette", self._root, self.second_palette._root)
                if self.second_palette._parent != self:
                    raise kaitaistruct.ConsistencyError(u"second_palette", self, self.second_palette._parent)

            self._dirty = False


    class Zone(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cDiyBody.Zone, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.family = KaitaiStream.resolve_enum(H607cDiyBody.Family, self._io.read_u1())
            self.len_body = self._io.read_u1()
            if self.len_body != 0:
                pass
                _on = self.family
                if _on == H607cDiyBody.Family.breathe:
                    pass
                    self._raw_body = self._io.read_bytes(self.len_body)
                    _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
                    self.body = H607cDiyBody.Parameters(self.family, _io__raw_body, self, self._root)
                    self.body._read()
                elif _on == H607cDiyBody.Family.chase:
                    pass
                    self._raw_body = self._io.read_bytes(self.len_body)
                    _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
                    self.body = H607cDiyBody.Parameters(self.family, _io__raw_body, self, self._root)
                    self.body._read()
                elif _on == H607cDiyBody.Family.colour_wall:
                    pass
                    self._raw_body = self._io.read_bytes(self.len_body)
                    _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
                    self.body = H607cDiyBody.Parameters(self.family, _io__raw_body, self, self._root)
                    self.body._read()
                elif _on == H607cDiyBody.Family.drip:
                    pass
                    self._raw_body = self._io.read_bytes(self.len_body)
                    _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
                    self.body = H607cDiyBody.Parameters(self.family, _io__raw_body, self, self._root)
                    self.body._read()
                elif _on == H607cDiyBody.Family.gradual:
                    pass
                    self._raw_body = self._io.read_bytes(self.len_body)
                    _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
                    self.body = H607cDiyBody.Parameters(self.family, _io__raw_body, self, self._root)
                    self.body._read()
                elif _on == H607cDiyBody.Family.lava:
                    pass
                    self._raw_body = self._io.read_bytes(self.len_body)
                    _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
                    self.body = H607cDiyBody.Parameters(self.family, _io__raw_body, self, self._root)
                    self.body._read()
                elif _on == H607cDiyBody.Family.shimmer:
                    pass
                    self._raw_body = self._io.read_bytes(self.len_body)
                    _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
                    self.body = H607cDiyBody.Parameters(self.family, _io__raw_body, self, self._root)
                    self.body._read()
                elif _on == H607cDiyBody.Family.shock:
                    pass
                    self._raw_body = self._io.read_bytes(self.len_body)
                    _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
                    self.body = H607cDiyBody.Parameters(self.family, _io__raw_body, self, self._root)
                    self.body._read()
                elif _on == H607cDiyBody.Family.stream:
                    pass
                    self._raw_body = self._io.read_bytes(self.len_body)
                    _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
                    self.body = H607cDiyBody.Parameters(self.family, _io__raw_body, self, self._root)
                    self.body._read()
                else:
                    pass
                    self.body = self._io.read_bytes(self.len_body)

            self._dirty = False


        def _fetch_instances(self):
            pass
            if self.len_body != 0:
                pass
                _on = self.family
                if _on == H607cDiyBody.Family.breathe:
                    pass
                    self.body._fetch_instances()
                elif _on == H607cDiyBody.Family.chase:
                    pass
                    self.body._fetch_instances()
                elif _on == H607cDiyBody.Family.colour_wall:
                    pass
                    self.body._fetch_instances()
                elif _on == H607cDiyBody.Family.drip:
                    pass
                    self.body._fetch_instances()
                elif _on == H607cDiyBody.Family.gradual:
                    pass
                    self.body._fetch_instances()
                elif _on == H607cDiyBody.Family.lava:
                    pass
                    self.body._fetch_instances()
                elif _on == H607cDiyBody.Family.shimmer:
                    pass
                    self.body._fetch_instances()
                elif _on == H607cDiyBody.Family.shock:
                    pass
                    self.body._fetch_instances()
                elif _on == H607cDiyBody.Family.stream:
                    pass
                    self.body._fetch_instances()
                else:
                    pass



        def _write__seq(self, io=None):
            super(H607cDiyBody.Zone, self)._write__seq(io)
            self._io.write_u1(int(self.family))
            self._io.write_u1(self.len_body)
            if self.len_body != 0:
                pass
                _on = self.family
                if _on == H607cDiyBody.Family.breathe:
                    pass
                    _io__raw_body = KaitaiStream(BytesIO(bytearray(self.len_body)))
                    self._io.add_child_stream(_io__raw_body)
                    _pos2 = self._io.pos()
                    self._io.seek(self._io.pos() + (self.len_body))
                    def handler(parent, _io__raw_body=_io__raw_body):
                        self._raw_body = _io__raw_body.to_byte_array()
                        if len(self._raw_body) != self.len_body:
                            raise kaitaistruct.ConsistencyError(u"raw(body)", self.len_body, len(self._raw_body))
                        parent.write_bytes(self._raw_body)
                    _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
                    self.body._write__seq(_io__raw_body)
                elif _on == H607cDiyBody.Family.chase:
                    pass
                    _io__raw_body = KaitaiStream(BytesIO(bytearray(self.len_body)))
                    self._io.add_child_stream(_io__raw_body)
                    _pos2 = self._io.pos()
                    self._io.seek(self._io.pos() + (self.len_body))
                    def handler(parent, _io__raw_body=_io__raw_body):
                        self._raw_body = _io__raw_body.to_byte_array()
                        if len(self._raw_body) != self.len_body:
                            raise kaitaistruct.ConsistencyError(u"raw(body)", self.len_body, len(self._raw_body))
                        parent.write_bytes(self._raw_body)
                    _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
                    self.body._write__seq(_io__raw_body)
                elif _on == H607cDiyBody.Family.colour_wall:
                    pass
                    _io__raw_body = KaitaiStream(BytesIO(bytearray(self.len_body)))
                    self._io.add_child_stream(_io__raw_body)
                    _pos2 = self._io.pos()
                    self._io.seek(self._io.pos() + (self.len_body))
                    def handler(parent, _io__raw_body=_io__raw_body):
                        self._raw_body = _io__raw_body.to_byte_array()
                        if len(self._raw_body) != self.len_body:
                            raise kaitaistruct.ConsistencyError(u"raw(body)", self.len_body, len(self._raw_body))
                        parent.write_bytes(self._raw_body)
                    _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
                    self.body._write__seq(_io__raw_body)
                elif _on == H607cDiyBody.Family.drip:
                    pass
                    _io__raw_body = KaitaiStream(BytesIO(bytearray(self.len_body)))
                    self._io.add_child_stream(_io__raw_body)
                    _pos2 = self._io.pos()
                    self._io.seek(self._io.pos() + (self.len_body))
                    def handler(parent, _io__raw_body=_io__raw_body):
                        self._raw_body = _io__raw_body.to_byte_array()
                        if len(self._raw_body) != self.len_body:
                            raise kaitaistruct.ConsistencyError(u"raw(body)", self.len_body, len(self._raw_body))
                        parent.write_bytes(self._raw_body)
                    _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
                    self.body._write__seq(_io__raw_body)
                elif _on == H607cDiyBody.Family.gradual:
                    pass
                    _io__raw_body = KaitaiStream(BytesIO(bytearray(self.len_body)))
                    self._io.add_child_stream(_io__raw_body)
                    _pos2 = self._io.pos()
                    self._io.seek(self._io.pos() + (self.len_body))
                    def handler(parent, _io__raw_body=_io__raw_body):
                        self._raw_body = _io__raw_body.to_byte_array()
                        if len(self._raw_body) != self.len_body:
                            raise kaitaistruct.ConsistencyError(u"raw(body)", self.len_body, len(self._raw_body))
                        parent.write_bytes(self._raw_body)
                    _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
                    self.body._write__seq(_io__raw_body)
                elif _on == H607cDiyBody.Family.lava:
                    pass
                    _io__raw_body = KaitaiStream(BytesIO(bytearray(self.len_body)))
                    self._io.add_child_stream(_io__raw_body)
                    _pos2 = self._io.pos()
                    self._io.seek(self._io.pos() + (self.len_body))
                    def handler(parent, _io__raw_body=_io__raw_body):
                        self._raw_body = _io__raw_body.to_byte_array()
                        if len(self._raw_body) != self.len_body:
                            raise kaitaistruct.ConsistencyError(u"raw(body)", self.len_body, len(self._raw_body))
                        parent.write_bytes(self._raw_body)
                    _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
                    self.body._write__seq(_io__raw_body)
                elif _on == H607cDiyBody.Family.shimmer:
                    pass
                    _io__raw_body = KaitaiStream(BytesIO(bytearray(self.len_body)))
                    self._io.add_child_stream(_io__raw_body)
                    _pos2 = self._io.pos()
                    self._io.seek(self._io.pos() + (self.len_body))
                    def handler(parent, _io__raw_body=_io__raw_body):
                        self._raw_body = _io__raw_body.to_byte_array()
                        if len(self._raw_body) != self.len_body:
                            raise kaitaistruct.ConsistencyError(u"raw(body)", self.len_body, len(self._raw_body))
                        parent.write_bytes(self._raw_body)
                    _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
                    self.body._write__seq(_io__raw_body)
                elif _on == H607cDiyBody.Family.shock:
                    pass
                    _io__raw_body = KaitaiStream(BytesIO(bytearray(self.len_body)))
                    self._io.add_child_stream(_io__raw_body)
                    _pos2 = self._io.pos()
                    self._io.seek(self._io.pos() + (self.len_body))
                    def handler(parent, _io__raw_body=_io__raw_body):
                        self._raw_body = _io__raw_body.to_byte_array()
                        if len(self._raw_body) != self.len_body:
                            raise kaitaistruct.ConsistencyError(u"raw(body)", self.len_body, len(self._raw_body))
                        parent.write_bytes(self._raw_body)
                    _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
                    self.body._write__seq(_io__raw_body)
                elif _on == H607cDiyBody.Family.stream:
                    pass
                    _io__raw_body = KaitaiStream(BytesIO(bytearray(self.len_body)))
                    self._io.add_child_stream(_io__raw_body)
                    _pos2 = self._io.pos()
                    self._io.seek(self._io.pos() + (self.len_body))
                    def handler(parent, _io__raw_body=_io__raw_body):
                        self._raw_body = _io__raw_body.to_byte_array()
                        if len(self._raw_body) != self.len_body:
                            raise kaitaistruct.ConsistencyError(u"raw(body)", self.len_body, len(self._raw_body))
                        parent.write_bytes(self._raw_body)
                    _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
                    self.body._write__seq(_io__raw_body)
                else:
                    pass
                    self._io.write_bytes(self.body)



        def _check(self):
            if self.len_body != 0:
                pass
                _on = self.family
                if _on == H607cDiyBody.Family.breathe:
                    pass
                    if self.body._root != self._root:
                        raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
                    if self.body._parent != self:
                        raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
                    if self.body.family != self.family:
                        raise kaitaistruct.ConsistencyError(u"body", self.family, self.body.family)
                elif _on == H607cDiyBody.Family.chase:
                    pass
                    if self.body._root != self._root:
                        raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
                    if self.body._parent != self:
                        raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
                    if self.body.family != self.family:
                        raise kaitaistruct.ConsistencyError(u"body", self.family, self.body.family)
                elif _on == H607cDiyBody.Family.colour_wall:
                    pass
                    if self.body._root != self._root:
                        raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
                    if self.body._parent != self:
                        raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
                    if self.body.family != self.family:
                        raise kaitaistruct.ConsistencyError(u"body", self.family, self.body.family)
                elif _on == H607cDiyBody.Family.drip:
                    pass
                    if self.body._root != self._root:
                        raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
                    if self.body._parent != self:
                        raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
                    if self.body.family != self.family:
                        raise kaitaistruct.ConsistencyError(u"body", self.family, self.body.family)
                elif _on == H607cDiyBody.Family.gradual:
                    pass
                    if self.body._root != self._root:
                        raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
                    if self.body._parent != self:
                        raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
                    if self.body.family != self.family:
                        raise kaitaistruct.ConsistencyError(u"body", self.family, self.body.family)
                elif _on == H607cDiyBody.Family.lava:
                    pass
                    if self.body._root != self._root:
                        raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
                    if self.body._parent != self:
                        raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
                    if self.body.family != self.family:
                        raise kaitaistruct.ConsistencyError(u"body", self.family, self.body.family)
                elif _on == H607cDiyBody.Family.shimmer:
                    pass
                    if self.body._root != self._root:
                        raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
                    if self.body._parent != self:
                        raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
                    if self.body.family != self.family:
                        raise kaitaistruct.ConsistencyError(u"body", self.family, self.body.family)
                elif _on == H607cDiyBody.Family.shock:
                    pass
                    if self.body._root != self._root:
                        raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
                    if self.body._parent != self:
                        raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
                    if self.body.family != self.family:
                        raise kaitaistruct.ConsistencyError(u"body", self.family, self.body.family)
                elif _on == H607cDiyBody.Family.stream:
                    pass
                    if self.body._root != self._root:
                        raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
                    if self.body._parent != self:
                        raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
                    if self.body.family != self.family:
                        raise kaitaistruct.ConsistencyError(u"body", self.family, self.body.family)
                else:
                    pass
                    if len(self.body) != self.len_body:
                        raise kaitaistruct.ConsistencyError(u"body", self.len_body, len(self.body))

            self._dirty = False



