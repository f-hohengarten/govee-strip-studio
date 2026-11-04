# This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild
# type: ignore

import kaitaistruct
from kaitaistruct import ReadWriteKaitaiStruct, KaitaiStream, BytesIO
from enum import IntEnum


if getattr(kaitaistruct, 'API_VERSION', (0, 9)) < (0, 11):
    raise Exception("Incompatible Kaitai Struct Python API: 0.11 or later is required, but you have %s" % (kaitaistruct.__version__))

class H607cDreamviewGroup(ReadWriteKaitaiStruct):
    """H607C.
    Compatibility hypothesis: Music DreamView V2 uploads a member count
    and explicit identity records under A3 command 60. Each record ends
    with a scalar area count, not the camera protocol's area-value vector.
    Mark and command version are supplied explicitly. MAC bytes are reversed;
    names use byte lengths. Member compatibility and group results require
    hardware qualification. No membership readback is implied.
    """

    class IdentityKind(IntEnum):
        mac = 0
        name = 1
    def __init__(self, _io=None, _parent=None, _root=None):
        super(H607cDreamviewGroup, self).__init__(_io)
        self._parent = _parent
        self._root = _root or self

    def _read(self):
        self.num_members = self._io.read_u1()
        self.members = []
        for i in range(self.num_members):
            _t_members = H607cDreamviewGroup.Member(self._io, self, self._root)
            try:
                _t_members._read()
            finally:
                self.members.append(_t_members)

        self.unknown = self._io.read_bytes_full()
        self._dirty = False


    def _fetch_instances(self):
        pass
        for i in range(len(self.members)):
            pass
            self.members[i]._fetch_instances()



    def _write__seq(self, io=None):
        super(H607cDreamviewGroup, self)._write__seq(io)
        self._io.write_u1(self.num_members)
        for i in range(len(self.members)):
            pass
            self.members[i]._write__seq(self._io)

        self._io.write_bytes(self.unknown)
        if not self._io.is_eof():
            raise kaitaistruct.ConsistencyError(u"unknown", 0, self._io.size() - self._io.pos())


    def _check(self):
        if len(self.members) != self.num_members:
            raise kaitaistruct.ConsistencyError(u"members", self.num_members, len(self.members))
        for i in range(len(self.members)):
            pass
            if self.members[i]._root != self._root:
                raise kaitaistruct.ConsistencyError(u"members", self._root, self.members[i]._root)
            if self.members[i]._parent != self:
                raise kaitaistruct.ConsistencyError(u"members", self, self.members[i]._parent)

        self._dirty = False

    class Member(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cDreamviewGroup.Member, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.mark = self._io.read_u1()
            self.identity_kind = KaitaiStream.resolve_enum(H607cDreamviewGroup.IdentityKind, self._io.read_u1())
            self.cmd_ver = self._io.read_u1()
            if self.identity_kind == H607cDreamviewGroup.IdentityKind.mac:
                pass
                self.reversed_mac = self._io.read_bytes(6)

            if self.identity_kind == H607cDreamviewGroup.IdentityKind.name:
                pass
                self.len_name_bytes = self._io.read_u1()

            if self.identity_kind == H607cDreamviewGroup.IdentityKind.name:
                pass
                self.name_bytes = self._io.read_bytes(self.len_name_bytes)

            self.area_num = self._io.read_u1()
            self._dirty = False


        def _fetch_instances(self):
            pass
            if self.identity_kind == H607cDreamviewGroup.IdentityKind.mac:
                pass

            if self.identity_kind == H607cDreamviewGroup.IdentityKind.name:
                pass

            if self.identity_kind == H607cDreamviewGroup.IdentityKind.name:
                pass



        def _write__seq(self, io=None):
            super(H607cDreamviewGroup.Member, self)._write__seq(io)
            self._io.write_u1(self.mark)
            self._io.write_u1(int(self.identity_kind))
            self._io.write_u1(self.cmd_ver)
            if self.identity_kind == H607cDreamviewGroup.IdentityKind.mac:
                pass
                self._io.write_bytes(self.reversed_mac)

            if self.identity_kind == H607cDreamviewGroup.IdentityKind.name:
                pass
                self._io.write_u1(self.len_name_bytes)

            if self.identity_kind == H607cDreamviewGroup.IdentityKind.name:
                pass
                self._io.write_bytes(self.name_bytes)

            self._io.write_u1(self.area_num)


        def _check(self):
            if self.identity_kind == H607cDreamviewGroup.IdentityKind.mac:
                pass
                if len(self.reversed_mac) != 6:
                    raise kaitaistruct.ConsistencyError(u"reversed_mac", 6, len(self.reversed_mac))

            if self.identity_kind == H607cDreamviewGroup.IdentityKind.name:
                pass

            if self.identity_kind == H607cDreamviewGroup.IdentityKind.name:
                pass
                if len(self.name_bytes) != self.len_name_bytes:
                    raise kaitaistruct.ConsistencyError(u"name_bytes", self.len_name_bytes, len(self.name_bytes))

            self._dirty = False


    @property
    def group_type(self):
        if hasattr(self, '_m_group_type'):
            return self._m_group_type

        self._m_group_type = 96
        return getattr(self, '_m_group_type', None)

    def _invalidate_group_type(self):
        del self._m_group_type

