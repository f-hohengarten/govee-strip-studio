# This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild
# type: ignore

import kaitaistruct
from kaitaistruct import ReadWriteKaitaiStruct, KaitaiStream, BytesIO
from enum import IntEnum


if getattr(kaitaistruct, 'API_VERSION', (0, 9)) < (0, 11):
    raise Exception("Incompatible Kaitai Struct Python API: 0.11 or later is required, but you have %s" % (kaitaistruct.__version__))

class H607cDreamviewFrame(ReadWriteKaitaiStruct):
    """H607C.
    Compatibility hypothesis: module 60 uses a single group-enable boolean
    without the camera discriminator. Delete is command 07 with ff.
    Native music activation has a type, two-byte selector, second parameter
    and sensitivity. Individual brightness and connection replies retain
    every slot, including zeros. No slot implies occupied membership.
    Mode eligibility, results, freshness and rendering require qualification.
    """

    class Command(IntEnum):
        switch_group = 1
        music = 2
        member_brightness = 3
        same_brightness = 4
        member_connect = 5
        delete_group = 7

    class Header(IntEnum):
        write = 51
        read = 170
    def __init__(self, is_query, _io=None, _parent=None, _root=None):
        super(H607cDreamviewFrame, self).__init__(_io)
        self._parent = _parent
        self._root = _root or self
        self.is_query = is_query

    def _read(self):
        self.header = KaitaiStream.resolve_enum(H607cDreamviewFrame.Header, self._io.read_u1())
        self.module = self._io.read_bytes(1)
        if not self.module == b"\x60":
            raise kaitaistruct.ValidationNotEqualError(b"\x60", self.module, self._io, u"/seq/1")
        self.command = KaitaiStream.resolve_enum(H607cDreamviewFrame.Command, self._io.read_u1())
        _on = (0 if self.is_query else int(self.header))
        if _on == 0:
            pass
            self._raw_body = self._io.read_bytes(16)
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = H607cDreamviewFrame.QueryBody(_io__raw_body, self, self._root)
            self.body._read()
        elif _on == 170:
            pass
            self._raw_body = self._io.read_bytes(16)
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = H607cDreamviewFrame.StatusBody(_io__raw_body, self, self._root)
            self.body._read()
        elif _on == 51:
            pass
            self._raw_body = self._io.read_bytes(16)
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = H607cDreamviewFrame.WriteBody(_io__raw_body, self, self._root)
            self.body._read()
        else:
            pass
            self.body = self._io.read_bytes(16)
        self.checksum = self._io.read_u1()
        self._dirty = False


    def _fetch_instances(self):
        pass
        _on = (0 if self.is_query else int(self.header))
        if _on == 0:
            pass
            self.body._fetch_instances()
        elif _on == 170:
            pass
            self.body._fetch_instances()
        elif _on == 51:
            pass
            self.body._fetch_instances()
        else:
            pass


    def _write__seq(self, io=None):
        super(H607cDreamviewFrame, self)._write__seq(io)
        self._io.write_u1(int(self.header))
        self._io.write_bytes(self.module)
        self._io.write_u1(int(self.command))
        _on = (0 if self.is_query else int(self.header))
        if _on == 0:
            pass
            _io__raw_body = KaitaiStream(BytesIO(bytearray(16)))
            self._io.add_child_stream(_io__raw_body)
            _pos2 = self._io.pos()
            self._io.seek(self._io.pos() + (16))
            def handler(parent, _io__raw_body=_io__raw_body):
                self._raw_body = _io__raw_body.to_byte_array()
                if len(self._raw_body) != 16:
                    raise kaitaistruct.ConsistencyError(u"raw(body)", 16, len(self._raw_body))
                parent.write_bytes(self._raw_body)
            _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
            self.body._write__seq(_io__raw_body)
        elif _on == 170:
            pass
            _io__raw_body = KaitaiStream(BytesIO(bytearray(16)))
            self._io.add_child_stream(_io__raw_body)
            _pos2 = self._io.pos()
            self._io.seek(self._io.pos() + (16))
            def handler(parent, _io__raw_body=_io__raw_body):
                self._raw_body = _io__raw_body.to_byte_array()
                if len(self._raw_body) != 16:
                    raise kaitaistruct.ConsistencyError(u"raw(body)", 16, len(self._raw_body))
                parent.write_bytes(self._raw_body)
            _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
            self.body._write__seq(_io__raw_body)
        elif _on == 51:
            pass
            _io__raw_body = KaitaiStream(BytesIO(bytearray(16)))
            self._io.add_child_stream(_io__raw_body)
            _pos2 = self._io.pos()
            self._io.seek(self._io.pos() + (16))
            def handler(parent, _io__raw_body=_io__raw_body):
                self._raw_body = _io__raw_body.to_byte_array()
                if len(self._raw_body) != 16:
                    raise kaitaistruct.ConsistencyError(u"raw(body)", 16, len(self._raw_body))
                parent.write_bytes(self._raw_body)
            _io__raw_body.write_back_handler = KaitaiStream.WriteBackHandler(_pos2, handler)
            self.body._write__seq(_io__raw_body)
        else:
            pass
            self._io.write_bytes(self.body)
        self._io.write_u1(self.checksum)


    def _check(self):
        if len(self.module) != 1:
            raise kaitaistruct.ConsistencyError(u"module", 1, len(self.module))
        if not self.module == b"\x60":
            raise kaitaistruct.ValidationNotEqualError(b"\x60", self.module, None, u"/seq/1")
        _on = (0 if self.is_query else int(self.header))
        if _on == 0:
            pass
            if self.body._root != self._root:
                raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
            if self.body._parent != self:
                raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
        elif _on == 170:
            pass
            if self.body._root != self._root:
                raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
            if self.body._parent != self:
                raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
        elif _on == 51:
            pass
            if self.body._root != self._root:
                raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
            if self.body._parent != self:
                raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
        else:
            pass
            if len(self.body) != 16:
                raise kaitaistruct.ConsistencyError(u"body", 16, len(self.body))
        self._dirty = False

    class Acknowledgement(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cDreamviewFrame.Acknowledgement, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.header = self._io.read_bytes(2)
            if not self.header == b"\x33\x60":
                raise kaitaistruct.ValidationNotEqualError(b"\x33\x60", self.header, self._io, u"/types/acknowledgement/seq/0")
            self.operation = KaitaiStream.resolve_enum(H607cDreamviewFrame.Command, self._io.read_u1())
            self.status = self._io.read_u1()
            self.unknown = self._io.read_bytes(15)
            self.checksum = self._io.read_u1()
            self._dirty = False


        def _fetch_instances(self):
            pass


        def _write__seq(self, io=None):
            super(H607cDreamviewFrame.Acknowledgement, self)._write__seq(io)
            self._io.write_bytes(self.header)
            self._io.write_u1(int(self.operation))
            self._io.write_u1(self.status)
            self._io.write_bytes(self.unknown)
            self._io.write_u1(self.checksum)


        def _check(self):
            if len(self.header) != 2:
                raise kaitaistruct.ConsistencyError(u"header", 2, len(self.header))
            if not self.header == b"\x33\x60":
                raise kaitaistruct.ValidationNotEqualError(b"\x33\x60", self.header, None, u"/types/acknowledgement/seq/0")
            if len(self.unknown) != 15:
                raise kaitaistruct.ConsistencyError(u"unknown", 15, len(self.unknown))
            self._dirty = False

        @property
        def is_success(self):
            if hasattr(self, '_m_is_success'):
                return self._m_is_success

            self._m_is_success = self.status == 0
            return getattr(self, '_m_is_success', None)

        def _invalidate_is_success(self):
            del self._m_is_success

    class MusicParameters(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cDreamviewFrame.MusicParameters, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.music_type = self._io.read_u1()
            self.selector = self._io.read_u2le()
            self.second_parameter = self._io.read_u1()
            self.sensitivity = self._io.read_u1()
            self._dirty = False


        def _fetch_instances(self):
            pass


        def _write__seq(self, io=None):
            super(H607cDreamviewFrame.MusicParameters, self)._write__seq(io)
            self._io.write_u1(self.music_type)
            self._io.write_u2le(self.selector)
            self._io.write_u1(self.second_parameter)
            self._io.write_u1(self.sensitivity)


        def _check(self):
            self._dirty = False


    class QueryBody(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cDreamviewFrame.QueryBody, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.unknown = self._io.read_bytes_full()
            self._dirty = False


        def _fetch_instances(self):
            pass


        def _write__seq(self, io=None):
            super(H607cDreamviewFrame.QueryBody, self)._write__seq(io)
            self._io.write_bytes(self.unknown)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"unknown", 0, self._io.size() - self._io.pos())


        def _check(self):
            self._dirty = False


    class StatusBody(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cDreamviewFrame.StatusBody, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            if  ((self._root.command == H607cDreamviewFrame.Command.switch_group) or (self._root.command == H607cDreamviewFrame.Command.same_brightness)) :
                pass
                self.enabled = self._io.read_u1()

            if self._root.command == H607cDreamviewFrame.Command.music:
                pass
                self.music = H607cDreamviewFrame.MusicParameters(self._io, self, self._root)
                self.music._read()

            if self._root.command == H607cDreamviewFrame.Command.member_brightness:
                pass
                self.brightness_bytes = self._io.read_bytes(16)

            if self._root.command == H607cDreamviewFrame.Command.member_connect:
                pass
                self.connection_bytes = self._io.read_bytes(10)

            self.unknown = self._io.read_bytes_full()
            self._dirty = False


        def _fetch_instances(self):
            pass
            if  ((self._root.command == H607cDreamviewFrame.Command.switch_group) or (self._root.command == H607cDreamviewFrame.Command.same_brightness)) :
                pass

            if self._root.command == H607cDreamviewFrame.Command.music:
                pass
                self.music._fetch_instances()

            if self._root.command == H607cDreamviewFrame.Command.member_brightness:
                pass

            if self._root.command == H607cDreamviewFrame.Command.member_connect:
                pass



        def _write__seq(self, io=None):
            super(H607cDreamviewFrame.StatusBody, self)._write__seq(io)
            if  ((self._root.command == H607cDreamviewFrame.Command.switch_group) or (self._root.command == H607cDreamviewFrame.Command.same_brightness)) :
                pass
                self._io.write_u1(self.enabled)

            if self._root.command == H607cDreamviewFrame.Command.music:
                pass
                self.music._write__seq(self._io)

            if self._root.command == H607cDreamviewFrame.Command.member_brightness:
                pass
                self._io.write_bytes(self.brightness_bytes)

            if self._root.command == H607cDreamviewFrame.Command.member_connect:
                pass
                self._io.write_bytes(self.connection_bytes)

            self._io.write_bytes(self.unknown)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"unknown", 0, self._io.size() - self._io.pos())


        def _check(self):
            if  ((self._root.command == H607cDreamviewFrame.Command.switch_group) or (self._root.command == H607cDreamviewFrame.Command.same_brightness)) :
                pass

            if self._root.command == H607cDreamviewFrame.Command.music:
                pass
                if self.music._root != self._root:
                    raise kaitaistruct.ConsistencyError(u"music", self._root, self.music._root)
                if self.music._parent != self:
                    raise kaitaistruct.ConsistencyError(u"music", self, self.music._parent)

            if self._root.command == H607cDreamviewFrame.Command.member_brightness:
                pass
                if len(self.brightness_bytes) != 16:
                    raise kaitaistruct.ConsistencyError(u"brightness_bytes", 16, len(self.brightness_bytes))

            if self._root.command == H607cDreamviewFrame.Command.member_connect:
                pass
                if len(self.connection_bytes) != 10:
                    raise kaitaistruct.ConsistencyError(u"connection_bytes", 10, len(self.connection_bytes))

            self._dirty = False


    class WriteBody(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cDreamviewFrame.WriteBody, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            if  ((self._root.command == H607cDreamviewFrame.Command.switch_group) or (self._root.command == H607cDreamviewFrame.Command.same_brightness)) :
                pass
                self.enabled = self._io.read_u1()

            if self._root.command == H607cDreamviewFrame.Command.music:
                pass
                self.music = H607cDreamviewFrame.MusicParameters(self._io, self, self._root)
                self.music._read()

            if self._root.command == H607cDreamviewFrame.Command.member_brightness:
                pass
                self.level = self._io.read_u1()

            if  ((self._root.command == H607cDreamviewFrame.Command.member_brightness) or (self._root.command == H607cDreamviewFrame.Command.member_connect)) :
                pass
                self.index = self._io.read_u1()

            if self._root.command == H607cDreamviewFrame.Command.member_connect:
                pass
                self.connected = self._io.read_u1()

            if self._root.command == H607cDreamviewFrame.Command.delete_group:
                pass
                self.clear = self._io.read_bytes(1)
                if not self.clear == b"\xFF":
                    raise kaitaistruct.ValidationNotEqualError(b"\xFF", self.clear, self._io, u"/types/write_body/seq/5")

            self.unknown = self._io.read_bytes_full()
            self._dirty = False


        def _fetch_instances(self):
            pass
            if  ((self._root.command == H607cDreamviewFrame.Command.switch_group) or (self._root.command == H607cDreamviewFrame.Command.same_brightness)) :
                pass

            if self._root.command == H607cDreamviewFrame.Command.music:
                pass
                self.music._fetch_instances()

            if self._root.command == H607cDreamviewFrame.Command.member_brightness:
                pass

            if  ((self._root.command == H607cDreamviewFrame.Command.member_brightness) or (self._root.command == H607cDreamviewFrame.Command.member_connect)) :
                pass

            if self._root.command == H607cDreamviewFrame.Command.member_connect:
                pass

            if self._root.command == H607cDreamviewFrame.Command.delete_group:
                pass



        def _write__seq(self, io=None):
            super(H607cDreamviewFrame.WriteBody, self)._write__seq(io)
            if  ((self._root.command == H607cDreamviewFrame.Command.switch_group) or (self._root.command == H607cDreamviewFrame.Command.same_brightness)) :
                pass
                self._io.write_u1(self.enabled)

            if self._root.command == H607cDreamviewFrame.Command.music:
                pass
                self.music._write__seq(self._io)

            if self._root.command == H607cDreamviewFrame.Command.member_brightness:
                pass
                self._io.write_u1(self.level)

            if  ((self._root.command == H607cDreamviewFrame.Command.member_brightness) or (self._root.command == H607cDreamviewFrame.Command.member_connect)) :
                pass
                self._io.write_u1(self.index)

            if self._root.command == H607cDreamviewFrame.Command.member_connect:
                pass
                self._io.write_u1(self.connected)

            if self._root.command == H607cDreamviewFrame.Command.delete_group:
                pass
                self._io.write_bytes(self.clear)

            self._io.write_bytes(self.unknown)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"unknown", 0, self._io.size() - self._io.pos())


        def _check(self):
            if  ((self._root.command == H607cDreamviewFrame.Command.switch_group) or (self._root.command == H607cDreamviewFrame.Command.same_brightness)) :
                pass

            if self._root.command == H607cDreamviewFrame.Command.music:
                pass
                if self.music._root != self._root:
                    raise kaitaistruct.ConsistencyError(u"music", self._root, self.music._root)
                if self.music._parent != self:
                    raise kaitaistruct.ConsistencyError(u"music", self, self.music._parent)

            if self._root.command == H607cDreamviewFrame.Command.member_brightness:
                pass

            if  ((self._root.command == H607cDreamviewFrame.Command.member_brightness) or (self._root.command == H607cDreamviewFrame.Command.member_connect)) :
                pass

            if self._root.command == H607cDreamviewFrame.Command.member_connect:
                pass

            if self._root.command == H607cDreamviewFrame.Command.delete_group:
                pass
                if len(self.clear) != 1:
                    raise kaitaistruct.ConsistencyError(u"clear", 1, len(self.clear))
                if not self.clear == b"\xFF":
                    raise kaitaistruct.ValidationNotEqualError(b"\xFF", self.clear, None, u"/types/write_body/seq/5")

            self._dirty = False


    @property
    def body_size(self):
        if hasattr(self, '_m_body_size'):
            return self._m_body_size

        self._m_body_size = 16
        return getattr(self, '_m_body_size', None)

    def _invalidate_body_size(self):
        del self._m_body_size
    @property
    def discriminator_size(self):
        if hasattr(self, '_m_discriminator_size'):
            return self._m_discriminator_size

        self._m_discriminator_size = 0
        return getattr(self, '_m_discriminator_size', None)

    def _invalidate_discriminator_size(self):
        del self._m_discriminator_size
    @property
    def module_value(self):
        if hasattr(self, '_m_module_value'):
            return self._m_module_value

        self._m_module_value = 96
        return getattr(self, '_m_module_value', None)

    def _invalidate_module_value(self):
        del self._m_module_value

