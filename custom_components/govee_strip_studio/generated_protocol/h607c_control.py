# This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild
# type: ignore

import kaitaistruct
from kaitaistruct import ReadWriteKaitaiStruct, KaitaiStream, BytesIO
from custom_components.govee_strip_studio.generated_protocol import h60a_bulk
from enum import IntEnum


if getattr(kaitaistruct, 'API_VERSION', (0, 9)) < (0, 11):
    raise Exception("Incompatible Kaitai Struct Python API: 0.11 or later is required, but you have %s" % (kaitaistruct.__version__))

class H607cControl(ReadWriteKaitaiStruct):
    """H607C.
    Compatibility hypothesis: pole/base writes are independent selector/boolean
    commands. Power-on writes carry selector 02 and previous/on/off state;
    its query uses selector zero and replies retain an independent open flag.
    Device-info AA replies and EE/30 asynchronous flags have different envelopes.
    Gradual colour change uses the independent ordinary A3 boolean register;
    its AA/A3 query reply is not a multipart upload result.
    Unknown flags and suffixes remain opaque. Persistence and timing are unqualified.
    """

    class Command(IntEnum):
        zone_enable = 48
        power_on_behaviour = 65
        gradual = 163

    class NativeFlag(IntEnum):
        master = 1
        pole = 2
        base = 4

    class Zone(IntEnum):
        pole_enabled = 0
        base_enabled = 1
    def __init__(self, _io=None, _parent=None, _root=None):
        super(H607cControl, self).__init__(_io)
        self._parent = _parent
        self._root = _root or self

    def _read(self):
        self.header = self._io.read_bytes(1)
        if not self.header == b"\x33":
            raise kaitaistruct.ValidationNotEqualError(b"\x33", self.header, self._io, u"/seq/0")
        self.opcode = KaitaiStream.resolve_enum(H607cControl.Command, self._io.read_u1())
        _on = self.opcode
        if _on == H607cControl.Command.gradual:
            pass
            self._raw_body = self._io.read_bytes(17)
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = H607cControl.GradualState(_io__raw_body, self, self._root)
            self.body._read()
        elif _on == H607cControl.Command.power_on_behaviour:
            pass
            self._raw_body = self._io.read_bytes(17)
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = H607cControl.PowerOnCommand(_io__raw_body, self, self._root)
            self.body._read()
        elif _on == H607cControl.Command.zone_enable:
            pass
            self._raw_body = self._io.read_bytes(17)
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = H607cControl.ZoneEnable(_io__raw_body, self, self._root)
            self.body._read()
        else:
            pass
            self.body = self._io.read_bytes(17)
        self.checksum = self._io.read_u1()
        self._dirty = False


    def _fetch_instances(self):
        pass
        _on = self.opcode
        if _on == H607cControl.Command.gradual:
            pass
            self.body._fetch_instances()
        elif _on == H607cControl.Command.power_on_behaviour:
            pass
            self.body._fetch_instances()
        elif _on == H607cControl.Command.zone_enable:
            pass
            self.body._fetch_instances()
        else:
            pass


    def _write__seq(self, io=None):
        super(H607cControl, self)._write__seq(io)
        self._io.write_bytes(self.header)
        self._io.write_u1(int(self.opcode))
        _on = self.opcode
        if _on == H607cControl.Command.gradual:
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
        elif _on == H607cControl.Command.power_on_behaviour:
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
        elif _on == H607cControl.Command.zone_enable:
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
        if _on == H607cControl.Command.gradual:
            pass
            if self.body._root != self._root:
                raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
            if self.body._parent != self:
                raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
        elif _on == H607cControl.Command.power_on_behaviour:
            pass
            if self.body._root != self._root:
                raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
            if self.body._parent != self:
                raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
        elif _on == H607cControl.Command.zone_enable:
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

    class DeviceInfo(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cControl.DeviceInfo, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.brightness = self._io.read_u1()
            self.flags = H607cControl.NativeFlags(self._io, self, self._root)
            self.flags._read()
            self.unknown_tail = self._io.read_bytes_full()
            self._dirty = False


        def _fetch_instances(self):
            pass
            self.flags._fetch_instances()


        def _write__seq(self, io=None):
            super(H607cControl.DeviceInfo, self)._write__seq(io)
            self._io.write_u1(self.brightness)
            self.flags._write__seq(self._io)
            self._io.write_bytes(self.unknown_tail)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"unknown_tail", 0, self._io.size() - self._io.pos())


        def _check(self):
            if self.flags._root != self._root:
                raise kaitaistruct.ConsistencyError(u"flags", self._root, self.flags._root)
            if self.flags._parent != self:
                raise kaitaistruct.ConsistencyError(u"flags", self, self.flags._parent)
            self._dirty = False


    class DeviceInfoQuery(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cControl.DeviceInfoQuery, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.header = self._io.read_bytes(3)
            if not self.header == b"\xAA\x07\x08":
                raise kaitaistruct.ValidationNotEqualError(b"\xAA\x07\x08", self.header, self._io, u"/types/device_info_query/seq/0")
            self.unknown_tail = self._io.read_bytes(16)
            self.checksum = self._io.read_u1()
            self._dirty = False


        def _fetch_instances(self):
            pass


        def _write__seq(self, io=None):
            super(H607cControl.DeviceInfoQuery, self)._write__seq(io)
            self._io.write_bytes(self.header)
            self._io.write_bytes(self.unknown_tail)
            self._io.write_u1(self.checksum)


        def _check(self):
            if len(self.header) != 3:
                raise kaitaistruct.ConsistencyError(u"header", 3, len(self.header))
            if not self.header == b"\xAA\x07\x08":
                raise kaitaistruct.ValidationNotEqualError(b"\xAA\x07\x08", self.header, None, u"/types/device_info_query/seq/0")
            if len(self.unknown_tail) != 16:
                raise kaitaistruct.ConsistencyError(u"unknown_tail", 16, len(self.unknown_tail))
            self._dirty = False


    class GradualQuery(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cControl.GradualQuery, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.header = self._io.read_bytes(2)
            if not self.header == b"\xAA\xA3":
                raise kaitaistruct.ValidationNotEqualError(b"\xAA\xA3", self.header, self._io, u"/types/gradual_query/seq/0")
            self.unknown_tail = self._io.read_bytes(17)
            self.checksum = self._io.read_u1()
            self._dirty = False


        def _fetch_instances(self):
            pass


        def _write__seq(self, io=None):
            super(H607cControl.GradualQuery, self)._write__seq(io)
            self._io.write_bytes(self.header)
            self._io.write_bytes(self.unknown_tail)
            self._io.write_u1(self.checksum)


        def _check(self):
            if len(self.header) != 2:
                raise kaitaistruct.ConsistencyError(u"header", 2, len(self.header))
            if not self.header == b"\xAA\xA3":
                raise kaitaistruct.ValidationNotEqualError(b"\xAA\xA3", self.header, None, u"/types/gradual_query/seq/0")
            if len(self.unknown_tail) != 17:
                raise kaitaistruct.ConsistencyError(u"unknown_tail", 17, len(self.unknown_tail))
            self._dirty = False


    class GradualState(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cControl.GradualState, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.flag = self._io.read_u1()
            if not  ((self.flag == 0) or (self.flag == 1)) :
                raise kaitaistruct.ValidationNotAnyOfError(self.flag, self._io, u"/types/gradual_state/seq/0")
            self.unknown_tail = self._io.read_bytes_full()
            self._dirty = False


        def _fetch_instances(self):
            pass


        def _write__seq(self, io=None):
            super(H607cControl.GradualState, self)._write__seq(io)
            self._io.write_u1(self.flag)
            self._io.write_bytes(self.unknown_tail)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"unknown_tail", 0, self._io.size() - self._io.pos())


        def _check(self):
            if not  ((self.flag == 0) or (self.flag == 1)) :
                raise kaitaistruct.ValidationNotAnyOfError(self.flag, None, u"/types/gradual_state/seq/0")
            self._dirty = False


    class NativeFlags(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cControl.NativeFlags, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.mask = self._io.read_u1()
            self._dirty = False


        def _fetch_instances(self):
            pass


        def _write__seq(self, io=None):
            super(H607cControl.NativeFlags, self)._write__seq(io)
            self._io.write_u1(self.mask)


        def _check(self):
            self._dirty = False

        @property
        def base_enabled(self):
            if hasattr(self, '_m_base_enabled'):
                return self._m_base_enabled

            self._m_base_enabled = self.mask & int(H607cControl.NativeFlag.base) != 0
            return getattr(self, '_m_base_enabled', None)

        def _invalidate_base_enabled(self):
            del self._m_base_enabled
        @property
        def master_enabled(self):
            if hasattr(self, '_m_master_enabled'):
                return self._m_master_enabled

            self._m_master_enabled = self.mask & int(H607cControl.NativeFlag.master) != 0
            return getattr(self, '_m_master_enabled', None)

        def _invalidate_master_enabled(self):
            del self._m_master_enabled
        @property
        def pole_enabled(self):
            if hasattr(self, '_m_pole_enabled'):
                return self._m_pole_enabled

            self._m_pole_enabled = self.mask & int(H607cControl.NativeFlag.pole) != 0
            return getattr(self, '_m_pole_enabled', None)

        def _invalidate_pole_enabled(self):
            del self._m_pole_enabled
        @property
        def unknown_mask(self):
            if hasattr(self, '_m_unknown_mask'):
                return self._m_unknown_mask

            self._m_unknown_mask = self.mask & 248
            return getattr(self, '_m_unknown_mask', None)

        def _invalidate_unknown_mask(self):
            del self._m_unknown_mask

    class PowerOnCommand(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cControl.PowerOnCommand, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.selector = self._io.read_bytes(1)
            if not self.selector == b"\x02":
                raise kaitaistruct.ValidationNotEqualError(b"\x02", self.selector, self._io, u"/types/power_on_command/seq/0")
            self.state = KaitaiStream.resolve_enum(h60a_bulk.H60aBulk.PowerOnState, self._io.read_u1())
            self.unknown_tail = self._io.read_bytes_full()
            self._dirty = False


        def _fetch_instances(self):
            pass


        def _write__seq(self, io=None):
            super(H607cControl.PowerOnCommand, self)._write__seq(io)
            self._io.write_bytes(self.selector)
            self._io.write_u1(int(self.state))
            self._io.write_bytes(self.unknown_tail)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"unknown_tail", 0, self._io.size() - self._io.pos())


        def _check(self):
            if len(self.selector) != 1:
                raise kaitaistruct.ConsistencyError(u"selector", 1, len(self.selector))
            if not self.selector == b"\x02":
                raise kaitaistruct.ValidationNotEqualError(b"\x02", self.selector, None, u"/types/power_on_command/seq/0")
            self._dirty = False


    class PowerOnQuery(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cControl.PowerOnQuery, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.header = self._io.read_bytes(3)
            if not self.header == b"\xAA\x41\x00":
                raise kaitaistruct.ValidationNotEqualError(b"\xAA\x41\x00", self.header, self._io, u"/types/power_on_query/seq/0")
            self.unknown_tail = self._io.read_bytes(16)
            self.checksum = self._io.read_u1()
            self._dirty = False


        def _fetch_instances(self):
            pass


        def _write__seq(self, io=None):
            super(H607cControl.PowerOnQuery, self)._write__seq(io)
            self._io.write_bytes(self.header)
            self._io.write_bytes(self.unknown_tail)
            self._io.write_u1(self.checksum)


        def _check(self):
            if len(self.header) != 3:
                raise kaitaistruct.ConsistencyError(u"header", 3, len(self.header))
            if not self.header == b"\xAA\x41\x00":
                raise kaitaistruct.ValidationNotEqualError(b"\xAA\x41\x00", self.header, None, u"/types/power_on_query/seq/0")
            if len(self.unknown_tail) != 16:
                raise kaitaistruct.ConsistencyError(u"unknown_tail", 16, len(self.unknown_tail))
            self._dirty = False


    class PowerOnState(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cControl.PowerOnState, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.open_flag = self._io.read_u1()
            self.state = KaitaiStream.resolve_enum(h60a_bulk.H60aBulk.PowerOnState, self._io.read_u1())
            self.unknown_tail = self._io.read_bytes_full()
            self._dirty = False


        def _fetch_instances(self):
            pass


        def _write__seq(self, io=None):
            super(H607cControl.PowerOnState, self)._write__seq(io)
            self._io.write_u1(self.open_flag)
            self._io.write_u1(int(self.state))
            self._io.write_bytes(self.unknown_tail)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"unknown_tail", 0, self._io.size() - self._io.pos())


        def _check(self):
            self._dirty = False


    class ZoneEnable(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cControl.ZoneEnable, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.zone = KaitaiStream.resolve_enum(H607cControl.Zone, self._io.read_u1())
            self.enabled = self._io.read_u1()
            if not  ((self.enabled == 0) or (self.enabled == 1)) :
                raise kaitaistruct.ValidationNotAnyOfError(self.enabled, self._io, u"/types/zone_enable/seq/1")
            self.unknown_tail = self._io.read_bytes_full()
            self._dirty = False


        def _fetch_instances(self):
            pass


        def _write__seq(self, io=None):
            super(H607cControl.ZoneEnable, self)._write__seq(io)
            self._io.write_u1(int(self.zone))
            self._io.write_u1(self.enabled)
            self._io.write_bytes(self.unknown_tail)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"unknown_tail", 0, self._io.size() - self._io.pos())


        def _check(self):
            if not  ((self.enabled == 0) or (self.enabled == 1)) :
                raise kaitaistruct.ValidationNotAnyOfError(self.enabled, None, u"/types/zone_enable/seq/1")
            self._dirty = False


    class ZoneNotification(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cControl.ZoneNotification, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.header = self._io.read_bytes(2)
            if not self.header == b"\xEE\x30":
                raise kaitaistruct.ValidationNotEqualError(b"\xEE\x30", self.header, self._io, u"/types/zone_notification/seq/0")
            self._raw_body = self._io.read_bytes(17)
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = H607cControl.ZoneNotificationBody(_io__raw_body, self, self._root)
            self.body._read()
            self.checksum = self._io.read_u1()
            self._dirty = False


        def _fetch_instances(self):
            pass
            self.body._fetch_instances()


        def _write__seq(self, io=None):
            super(H607cControl.ZoneNotification, self)._write__seq(io)
            self._io.write_bytes(self.header)
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
            self._io.write_u1(self.checksum)


        def _check(self):
            if len(self.header) != 2:
                raise kaitaistruct.ConsistencyError(u"header", 2, len(self.header))
            if not self.header == b"\xEE\x30":
                raise kaitaistruct.ValidationNotEqualError(b"\xEE\x30", self.header, None, u"/types/zone_notification/seq/0")
            if self.body._root != self._root:
                raise kaitaistruct.ConsistencyError(u"body", self._root, self.body._root)
            if self.body._parent != self:
                raise kaitaistruct.ConsistencyError(u"body", self, self.body._parent)
            self._dirty = False

        @property
        def base_enabled(self):
            if hasattr(self, '_m_base_enabled'):
                return self._m_base_enabled

            self._m_base_enabled = self.body.flags.base_enabled
            return getattr(self, '_m_base_enabled', None)

        def _invalidate_base_enabled(self):
            del self._m_base_enabled
        @property
        def domain(self):
            if hasattr(self, '_m_domain'):
                return self._m_domain

            self._m_domain = u"zone_enable"
            return getattr(self, '_m_domain', None)

        def _invalidate_domain(self):
            del self._m_domain
        @property
        def is_on(self):
            if hasattr(self, '_m_is_on'):
                return self._m_is_on

            self._m_is_on = self.body.flags.master_enabled
            return getattr(self, '_m_is_on', None)

        def _invalidate_is_on(self):
            del self._m_is_on
        @property
        def pole_enabled(self):
            if hasattr(self, '_m_pole_enabled'):
                return self._m_pole_enabled

            self._m_pole_enabled = self.body.flags.pole_enabled
            return getattr(self, '_m_pole_enabled', None)

        def _invalidate_pole_enabled(self):
            del self._m_pole_enabled

    class ZoneNotificationBody(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cControl.ZoneNotificationBody, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.unknown_prefix = self._io.read_u1()
            self.flags = H607cControl.NativeFlags(self._io, self, self._root)
            self.flags._read()
            self.unknown_tail = self._io.read_bytes_full()
            self._dirty = False


        def _fetch_instances(self):
            pass
            self.flags._fetch_instances()


        def _write__seq(self, io=None):
            super(H607cControl.ZoneNotificationBody, self)._write__seq(io)
            self._io.write_u1(self.unknown_prefix)
            self.flags._write__seq(self._io)
            self._io.write_bytes(self.unknown_tail)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"unknown_tail", 0, self._io.size() - self._io.pos())


        def _check(self):
            if self.flags._root != self._root:
                raise kaitaistruct.ConsistencyError(u"flags", self._root, self.flags._root)
            if self.flags._parent != self:
                raise kaitaistruct.ConsistencyError(u"flags", self, self.flags._parent)
            self._dirty = False



