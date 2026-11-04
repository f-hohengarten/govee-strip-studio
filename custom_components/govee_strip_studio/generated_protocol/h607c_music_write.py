# This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild
# type: ignore

import kaitaistruct
from kaitaistruct import ReadWriteKaitaiStruct, KaitaiStream, BytesIO
from enum import IntEnum


if getattr(kaitaistruct, 'API_VERSION', (0, 9)) < (0, 11):
    raise Exception("Incompatible Kaitai Struct Python API: 0.11 or later is required, but you have %s" % (kaitaistruct.__version__))

class H607cMusicWrite(ReadWriteKaitaiStruct):
    """H607C.
    Compatibility hypothesis: selector 13 carries the native mode and
    sensitivity after its companion upload. Paired mode 130 selects independent
    pole/base sections. Mode 115 retains a numeric name until its presentation
    semantics are established independently.
    Unknown suffixes, reply coverage and rendering remain unqualified.
    """

    class MusicMode(IntEnum):
        hopping = 51
        fusion = 79
        shiny = 81
        rhythm = 114
        native_115 = 115
        magic = 116
        paired = 130
        colour_dots = 131
        splash = 132
        spring = 133
    def __init__(self, _io=None, _parent=None, _root=None):
        super(H607cMusicWrite, self).__init__(_io)
        self._parent = _parent
        self._root = _root or self

    def _read(self):
        self.header = self._io.read_bytes(3)
        if not self.header == b"\x33\x05\x13":
            raise kaitaistruct.ValidationNotEqualError(b"\x33\x05\x13", self.header, self._io, u"/seq/0")
        self._raw_selector = self._io.read_bytes(16)
        _io__raw_selector = KaitaiStream(BytesIO(self._raw_selector))
        self.selector = H607cMusicWrite.MusicSelector(_io__raw_selector, self, self._root)
        self.selector._read()
        self.checksum = self._io.read_u1()
        self._dirty = False


    def _fetch_instances(self):
        pass
        self.selector._fetch_instances()


    def _write__seq(self, io=None):
        super(H607cMusicWrite, self)._write__seq(io)
        self._io.write_bytes(self.header)
        _io__raw_selector = KaitaiStream(BytesIO(bytearray(16)))
        self._io.add_child_stream(_io__raw_selector)
        _pos2 = self._io.pos()
        self._io.seek(self._io.pos() + (16))
        def handler(parent, _io__raw_selector=_io__raw_selector):
            self._raw_selector = _io__raw_selector.to_byte_array()
            if len(self._raw_selector) != 16:
                raise kaitaistruct.ConsistencyError(u"raw(selector)", 16, len(self._raw_selector))
            parent.write_bytes(self._raw_selector)
        _io__raw_selector.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
        self.selector._write__seq(_io__raw_selector)
        self._io.write_u1(self.checksum)


    def _check(self):
        if len(self.header) != 3:
            raise kaitaistruct.ConsistencyError(u"header", 3, len(self.header))
        if not self.header == b"\x33\x05\x13":
            raise kaitaistruct.ValidationNotEqualError(b"\x33\x05\x13", self.header, None, u"/seq/0")
        if self.selector._root != self._root:
            raise kaitaistruct.ConsistencyError(u"selector", self._root, self.selector._root)
        if self.selector._parent != self:
            raise kaitaistruct.ConsistencyError(u"selector", self, self.selector._parent)
        self._dirty = False

    class MusicSelector(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cMusicWrite.MusicSelector, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.mode_id = KaitaiStream.resolve_enum(H607cMusicWrite.MusicMode, self._io.read_u1())
            self.sensitivity = self._io.read_u1()
            self.unknown_tail = self._io.read_bytes_full()
            self._dirty = False


        def _fetch_instances(self):
            pass


        def _write__seq(self, io=None):
            super(H607cMusicWrite.MusicSelector, self)._write__seq(io)
            self._io.write_u1(int(self.mode_id))
            self._io.write_u1(self.sensitivity)
            self._io.write_bytes(self.unknown_tail)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"unknown_tail", 0, self._io.size() - self._io.pos())


        def _check(self):
            self._dirty = False

        @property
        def is_legacy(self):
            if hasattr(self, '_m_is_legacy'):
                return self._m_is_legacy

            self._m_is_legacy = False
            return getattr(self, '_m_is_legacy', None)

        def _invalidate_is_legacy(self):
            del self._m_is_legacy


