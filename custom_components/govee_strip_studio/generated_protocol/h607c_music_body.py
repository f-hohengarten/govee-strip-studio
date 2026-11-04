# This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild
# type: ignore

import kaitaistruct
from kaitaistruct import ReadWriteKaitaiStruct, KaitaiStream, BytesIO
from custom_components.govee_strip_studio.generated_protocol import govee_common
from custom_components.govee_strip_studio.generated_protocol import govee_shared
from custom_components.govee_strip_studio.generated_protocol import h607c_music_write


if getattr(kaitaistruct, 'API_VERSION', (0, 9)) < (0, 11):
    raise Exception("Incompatible Kaitai Struct Python API: 0.11 or later is required, but you have %s" % (kaitaistruct.__version__))

class H607cMusicBody(ReadWriteKaitaiStruct):
    """H607C.
    Compatibility hypothesis: music uploads have the two-byte command header
    41/mode. Paired mode has separately bounded pole/base sections.
    Palette bodies retain mode-specific parameters; only independently
    established fields are named. Hopping's physical piece counts are not
    logical colour segments. Unknown parameters stay opaque.
    Palette rendering, unused tails and result timing remain unqualified.
    """
    def __init__(self, _io=None, _parent=None, _root=None):
        super(H607cMusicBody, self).__init__(_io)
        self._parent = _parent
        self._root = _root or self

    def _read(self):
        self.header = govee_common.GoveeCommon.A3Header(self._io)
        self.header._read()
        self.command = self._io.read_bytes(1)
        if not self.command == b"\x41":
            raise kaitaistruct.ValidationNotEqualError(b"\x41", self.command, self._io, u"/seq/1")
        self.mode = KaitaiStream.resolve_enum(h607c_music_write.H607cMusicWrite.MusicMode, self._io.read_u1())
        _on = self.mode
        if _on == h607c_music_write.H607cMusicWrite.MusicMode.paired:
            pass
            self.body = H607cMusicBody.PairedParameters(self._io, self, self._root)
            self.body._read()
        else:
            pass
            self.body = H607cMusicBody.Parameters(self.mode, self._io, self, self._root)
            self.body._read()
        self.padding = []
        i = 0
        while not self._io.is_eof():
            self.padding.append(self._io.read_u1())
            if not self.padding[i] == 0:
                raise kaitaistruct.ValidationNotEqualError(0, self.padding[i], self._io, u"/seq/4")
            i += 1

        self._dirty = False


    def _fetch_instances(self):
        pass
        self.header._fetch_instances()
        _on = self.mode
        if _on == h607c_music_write.H607cMusicWrite.MusicMode.paired:
            pass
            self.body._fetch_instances()
        else:
            pass
            self.body._fetch_instances()
        for i in range(len(self.padding)):
            pass



    def _write__seq(self, io=None):
        super(H607cMusicBody, self)._write__seq(io)
        self.header._write__seq(self._io)
        self._io.write_bytes(self.command)
        self._io.write_u1(int(self.mode))
        _on = self.mode
        if _on == h607c_music_write.H607cMusicWrite.MusicMode.paired:
            pass
            self.body._write__seq(self._io)
        else:
            pass
            self.body._write__seq(self._io)
        for i in range(len(self.padding)):
            pass
            if self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"padding", 0, self._io.size() - self._io.pos())
            self._io.write_u1(self.padding[i])

        if not self._io.is_eof():
            raise kaitaistruct.ConsistencyError(u"padding", 0, self._io.size() - self._io.pos())


    def _check(self):
        if len(self.command) != 1:
            raise kaitaistruct.ConsistencyError(u"command", 1, len(self.command))
        if not self.command == b"\x41":
            raise kaitaistruct.ValidationNotEqualError(b"\x41", self.command, None, u"/seq/1")
        _on = self.mode
        if _on == h607c_music_write.H607cMusicWrite.MusicMode.paired:
            pass
            if self.body._root != self._root:
                raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
            if self.body._parent != self:
                raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
        else:
            pass
            if self.body._root != self._root:
                raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
            if self.body._parent != self:
                raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
            if self.body.mode != self.mode:
                raise kaitaistruct.ConsistencyError(u"body", self.mode, self.body.mode)
        for i in range(len(self.padding)):
            pass
            if not self.padding[i] == 0:
                raise kaitaistruct.ValidationNotEqualError(0, self.padding[i], None, u"/seq/4")

        self._dirty = False

    class HoppingParameters(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cMusicBody.HoppingParameters, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.background = govee_shared.GoveeShared.Rgb(self._io)
            self.background._read()
            self.background_brightness = self._io.read_u1()
            self.speed = self._io.read_u1()
            self.piece_length_min = self._io.read_u1()
            self.piece_length_max = self._io.read_u1()
            self.piece_count_min = self._io.read_u1()
            self.piece_count_max = self._io.read_u1()
            self.unknown_tail = self._io.read_bytes_full()
            self._dirty = False


        def _fetch_instances(self):
            pass
            self.background._fetch_instances()


        def _write__seq(self, io=None):
            super(H607cMusicBody.HoppingParameters, self)._write__seq(io)
            self.background._write__seq(self._io)
            self._io.write_u1(self.background_brightness)
            self._io.write_u1(self.speed)
            self._io.write_u1(self.piece_length_min)
            self._io.write_u1(self.piece_length_max)
            self._io.write_u1(self.piece_count_min)
            self._io.write_u1(self.piece_count_max)
            self._io.write_bytes(self.unknown_tail)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"unknown_tail", 0, self._io.size() - self._io.pos())


        def _check(self):
            self._dirty = False


    class OpaqueParameters(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cMusicBody.OpaqueParameters, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.unknown = self._io.read_bytes_full()
            self._dirty = False


        def _fetch_instances(self):
            pass


        def _write__seq(self, io=None):
            super(H607cMusicBody.OpaqueParameters, self)._write__seq(io)
            self._io.write_bytes(self.unknown)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"unknown", 0, self._io.size() - self._io.pos())


        def _check(self):
            self._dirty = False


    class PairedParameters(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cMusicBody.PairedParameters, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.pole = H607cMusicBody.Zone(self._io, self, self._root)
            self.pole._read()
            self.base = H607cMusicBody.Zone(self._io, self, self._root)
            self.base._read()
            self._dirty = False


        def _fetch_instances(self):
            pass
            self.pole._fetch_instances()
            self.base._fetch_instances()


        def _write__seq(self, io=None):
            super(H607cMusicBody.PairedParameters, self)._write__seq(io)
            self.pole._write__seq(self._io)
            self.base._write__seq(self._io)


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


    class Parameters(ReadWriteKaitaiStruct):
        def __init__(self, mode, _io=None, _parent=None, _root=None):
            super(H607cMusicBody.Parameters, self).__init__(_io)
            self._parent = _parent
            self._root = _root
            self.mode = mode

        def _read(self):
            self.num_palette = self._io.read_u1()
            self.palette = []
            for i in range(self.num_palette):
                _t_palette = govee_shared.GoveeShared.Rgb(self._io)
                try:
                    _t_palette._read()
                finally:
                    self.palette.append(_t_palette)

            _on = self.mode
            if _on == h607c_music_write.H607cMusicWrite.MusicMode.hopping:
                pass
                self.tail = H607cMusicBody.HoppingParameters(self._io, self, self._root)
                self.tail._read()
            else:
                pass
                self.tail = H607cMusicBody.OpaqueParameters(self._io, self, self._root)
                self.tail._read()
            self._dirty = False


        def _fetch_instances(self):
            pass
            for i in range(len(self.palette)):
                pass
                self.palette[i]._fetch_instances()

            _on = self.mode
            if _on == h607c_music_write.H607cMusicWrite.MusicMode.hopping:
                pass
                self.tail._fetch_instances()
            else:
                pass
                self.tail._fetch_instances()


        def _write__seq(self, io=None):
            super(H607cMusicBody.Parameters, self)._write__seq(io)
            self._io.write_u1(self.num_palette)
            for i in range(len(self.palette)):
                pass
                self.palette[i]._write__seq(self._io)

            _on = self.mode
            if _on == h607c_music_write.H607cMusicWrite.MusicMode.hopping:
                pass
                self.tail._write__seq(self._io)
            else:
                pass
                self.tail._write__seq(self._io)


        def _check(self):
            if len(self.palette) != self.num_palette:
                raise kaitaistruct.ConsistencyError(u"palette", self.num_palette, len(self.palette))
            for i in range(len(self.palette)):
                pass

            _on = self.mode
            if _on == h607c_music_write.H607cMusicWrite.MusicMode.hopping:
                pass
                if self.tail._root != self._root:
                    raise kaitaistruct.ConsistencyError(u"tail", self._root, self.tail._root)
                if self.tail._parent != self:
                    raise kaitaistruct.ConsistencyError(u"tail", self, self.tail._parent)
            else:
                pass
                if self.tail._root != self._root:
                    raise kaitaistruct.ConsistencyError(u"tail", self._root, self.tail._root)
                if self.tail._parent != self:
                    raise kaitaistruct.ConsistencyError(u"tail", self, self.tail._parent)
            self._dirty = False


    class Zone(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cMusicBody.Zone, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.mode = KaitaiStream.resolve_enum(h607c_music_write.H607cMusicWrite.MusicMode, self._io.read_u1())
            self.len_parameters = self._io.read_u1()
            self._raw_body = self._io.read_bytes(self.len_parameters)
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = H607cMusicBody.Parameters(self.mode, _io__raw_body, self, self._root)
            self.body._read()
            self._dirty = False


        def _fetch_instances(self):
            pass
            self.body._fetch_instances()


        def _write__seq(self, io=None):
            super(H607cMusicBody.Zone, self)._write__seq(io)
            self._io.write_u1(int(self.mode))
            self._io.write_u1(self.len_parameters)
            _io__raw_body = KaitaiStream(BytesIO(bytearray(self.len_parameters)))
            self._io.add_child_stream(_io__raw_body)
            _pos2 = self._io.pos()
            self._io.seek(self._io.pos() + (self.len_parameters))
            def handler(parent, _io__raw_body=_io__raw_body):
                self._raw_body = _io__raw_body.to_byte_array()
                if len(self._raw_body) != self.len_parameters:
                    raise kaitaistruct.ConsistencyError(u"raw(body)", self.len_parameters, len(self._raw_body))
                parent.write_bytes(self._raw_body)
            _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
            self.body._write__seq(_io__raw_body)


        def _check(self):
            if self.body._root != self._root:
                raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
            if self.body._parent != self:
                raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
            if self.body.mode != self.mode:
                raise kaitaistruct.ConsistencyError(u"body", self.mode, self.body.mode)
            self._dirty = False


    @property
    def num_palette(self):
        if hasattr(self, '_m_num_palette'):
            return self._m_num_palette

        if self.mode != h607c_music_write.H607cMusicWrite.MusicMode.paired:
            pass
            self._m_num_palette = self.body.num_palette

        return getattr(self, '_m_num_palette', None)

    def _invalidate_num_palette(self):
        del self._m_num_palette
    @property
    def palette(self):
        if hasattr(self, '_m_palette'):
            return self._m_palette

        if self.mode != h607c_music_write.H607cMusicWrite.MusicMode.paired:
            pass
            self._m_palette = self.body.palette

        return getattr(self, '_m_palette', None)

    def _invalidate_palette(self):
        del self._m_palette
    @property
    def tail(self):
        if hasattr(self, '_m_tail'):
            return self._m_tail

        if self.mode != h607c_music_write.H607cMusicWrite.MusicMode.paired:
            pass
            self._m_tail = self.body.tail

        return getattr(self, '_m_tail', None)

    def _invalidate_tail(self):
        del self._m_tail

