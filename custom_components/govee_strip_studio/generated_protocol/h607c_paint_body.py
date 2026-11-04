# This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild
# type: ignore

import kaitaistruct
from kaitaistruct import ReadWriteKaitaiStruct, KaitaiStream, BytesIO
from custom_components.govee_strip_studio.generated_protocol import govee_shared
from enum import IntEnum


if getattr(kaitaistruct, 'API_VERSION', (0, 9)) < (0, 11):
    raise Exception("Incompatible Kaitai Struct Python API: 0.11 or later is required, but you have %s" % (kaitaistruct.__version__))

class H607cPaintBody(ReadWriteKaitaiStruct):
    """H607C.
    Compatibility hypothesis: native paint uses direction, rate, background
    brightness/RGB and count-prefixed colour/position groups.
    Static paint selects native direction 9 under A3 transport command 03,
    then separately activates selector 900. Neither 9 nor 900 is an extra
    transport header. Pole/base physical budgets are product data, not a
    uniform logical-segment scale. Rendering and restoration are unqualified.
    """

    class ActivationSelector(IntEnum):
        static_paint = 900

    class Direction(IntEnum):
        native_2 = 2
        upward = 9
        downward = 10
        native_15 = 15
        native_19 = 19
        native_20 = 20

    class UploadSubtype(IntEnum):
        paint = 3
    def __init__(self, _io=None, _parent=None, _root=None):
        super(H607cPaintBody, self).__init__(_io)
        self._parent = _parent
        self._root = _root or self

    def _read(self):
        self.direction = KaitaiStream.resolve_enum(H607cPaintBody.Direction, self._io.read_u1())
        self.speed = self._io.read_u1()
        if not self.speed <= 100:
            raise kaitaistruct.ValidationGreaterThanError(100, self.speed, self._io, u"/seq/1")
        self.background_brightness = self._io.read_u1()
        self.background = govee_shared.GoveeShared.Rgb(self._io)
        self.background._read()
        self.num_groups = self._io.read_u1()
        self.groups = []
        for i in range(self.num_groups):
            _t_groups = H607cPaintBody.Group(self._io, self, self._root)
            try:
                _t_groups._read()
            finally:
                self.groups.append(_t_groups)

        self.unknown_tail = self._io.read_bytes_full()
        self._dirty = False


    def _fetch_instances(self):
        pass
        self.background._fetch_instances()
        for i in range(len(self.groups)):
            pass
            self.groups[i]._fetch_instances()



    def _write__seq(self, io=None):
        super(H607cPaintBody, self)._write__seq(io)
        self._io.write_u1(int(self.direction))
        self._io.write_u1(self.speed)
        self._io.write_u1(self.background_brightness)
        self.background._write__seq(self._io)
        self._io.write_u1(self.num_groups)
        for i in range(len(self.groups)):
            pass
            self.groups[i]._write__seq(self._io)

        self._io.write_bytes(self.unknown_tail)
        if not self._io.is_eof():
            raise kaitaistruct.ConsistencyError(u"unknown_tail", 0, self._io.size() - self._io.pos())


    def _check(self):
        if not self.speed <= 100:
            raise kaitaistruct.ValidationGreaterThanError(100, self.speed, None, u"/seq/1")
        if len(self.groups) != self.num_groups:
            raise kaitaistruct.ConsistencyError(u"groups", self.num_groups, len(self.groups))
        for i in range(len(self.groups)):
            pass
            if self.groups[i]._root != self._root:
                raise kaitaistruct.ConsistencyError(u"groups", self._root, self.groups[i]._root)
            if self.groups[i]._parent != self:
                raise kaitaistruct.ConsistencyError(u"groups", self, self.groups[i]._parent)

        self._dirty = False

    class Group(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cPaintBody.Group, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.num_positions = self._io.read_u1()
            self.colour = govee_shared.GoveeShared.Rgb(self._io)
            self.colour._read()
            self.positions = []
            for i in range(self.num_positions):
                self.positions.append(self._io.read_u1())

            self._dirty = False


        def _fetch_instances(self):
            pass
            self.colour._fetch_instances()
            for i in range(len(self.positions)):
                pass



        def _write__seq(self, io=None):
            super(H607cPaintBody.Group, self)._write__seq(io)
            self._io.write_u1(self.num_positions)
            self.colour._write__seq(self._io)
            for i in range(len(self.positions)):
                pass
                self._io.write_u1(self.positions[i])



        def _check(self):
            if len(self.positions) != self.num_positions:
                raise kaitaistruct.ConsistencyError(u"positions", self.num_positions, len(self.positions))
            for i in range(len(self.positions)):
                pass

            self._dirty = False



