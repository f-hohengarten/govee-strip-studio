# This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild
# type: ignore

import kaitaistruct
from kaitaistruct import ReadWriteKaitaiStruct, KaitaiStream, BytesIO
from custom_components.govee_strip_studio.generated_protocol import govee_shared
from enum import IntEnum


if getattr(kaitaistruct, 'API_VERSION', (0, 9)) < (0, 11):
    raise Exception("Incompatible Kaitai Struct Python API: 0.11 or later is required, but you have %s" % (kaitaistruct.__version__))

class H607cSceneBody(ReadWriteKaitaiStruct):
    """H607C.
    Compatibility hypothesis: catalogue type 6 carries a marker-prefixed
    length-delimited layer container. A3 upload uses subtype 0a and removes
    that marker once. Common layer fields retain their existing encoding;
    their excess contains the V2 trailer described below.
    Catalogue bodies establish structure, not BLE acceptance or rendering.
    Sub-device mapping, extension semantics and the tail remain unqualified.
    """

    class CatalogueType(IntEnum):
        layered_scene = 6

    class UploadSubtype(IntEnum):
        layered_scene = 10
    def __init__(self, _io=None, _parent=None, _root=None):
        super(H607cSceneBody, self).__init__(_io)
        self._parent = _parent
        self._root = _root or self

    def _read(self):
        self.marker = self._io.read_bytes(1)
        if not self.marker == b"\x0A":
            raise kaitaistruct.ValidationNotEqualError(b"\x0A", self.marker, self._io, u"/seq/0")
        self.num_records = self._io.read_u1()
        self.records = []
        for i in range(self.num_records):
            _t_records = H607cSceneBody.Record(self._io, self, self._root)
            try:
                _t_records._read()
            finally:
                self.records.append(_t_records)

        self.padding = []
        i = 0
        while not self._io.is_eof():
            self.padding.append(self._io.read_u1())
            if not self.padding[i] == 0:
                raise kaitaistruct.ValidationNotEqualError(0, self.padding[i], self._io, u"/seq/3")
            i += 1

        self._dirty = False


    def _fetch_instances(self):
        pass
        for i in range(len(self.records)):
            pass
            self.records[i]._fetch_instances()

        for i in range(len(self.padding)):
            pass



    def _write__seq(self, io=None):
        super(H607cSceneBody, self)._write__seq(io)
        self._io.write_bytes(self.marker)
        self._io.write_u1(self.num_records)
        for i in range(len(self.records)):
            pass
            self.records[i]._write__seq(self._io)

        for i in range(len(self.padding)):
            pass
            if self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"padding", 0, self._io.size() - self._io.pos())
            self._io.write_u1(self.padding[i])

        if not self._io.is_eof():
            raise kaitaistruct.ConsistencyError(u"padding", 0, self._io.size() - self._io.pos())


    def _check(self):
        if len(self.marker) != 1:
            raise kaitaistruct.ConsistencyError(u"marker", 1, len(self.marker))
        if not self.marker == b"\x0A":
            raise kaitaistruct.ValidationNotEqualError(b"\x0A", self.marker, None, u"/seq/0")
        if len(self.records) != self.num_records:
            raise kaitaistruct.ConsistencyError(u"records", self.num_records, len(self.records))
        for i in range(len(self.records)):
            pass
            if self.records[i]._root != self._root:
                raise kaitaistruct.ConsistencyError(u"records", self._root, self.records[i]._root)
            if self.records[i]._parent != self:
                raise kaitaistruct.ConsistencyError(u"records", self, self.records[i]._parent)

        for i in range(len(self.padding)):
            pass
            if not self.padding[i] == 0:
                raise kaitaistruct.ValidationNotEqualError(0, self.padding[i], None, u"/seq/3")

        self._dirty = False

    class LayerTrailer(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cSceneBody.LayerTrailer, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.sub_device = self._io.read_u1()
            self.len_extension = self._io.read_u1()
            self.extension = self._io.read_bytes(self.len_extension)
            self.tail = self._io.read_u1()
            self.unknown = self._io.read_bytes_full()
            self._dirty = False


        def _fetch_instances(self):
            pass


        def _write__seq(self, io=None):
            super(H607cSceneBody.LayerTrailer, self)._write__seq(io)
            self._io.write_u1(self.sub_device)
            self._io.write_u1(self.len_extension)
            self._io.write_bytes(self.extension)
            self._io.write_u1(self.tail)
            self._io.write_bytes(self.unknown)
            if not self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"unknown", 0, self._io.size() - self._io.pos())


        def _check(self):
            if len(self.extension) != self.len_extension:
                raise kaitaistruct.ConsistencyError(u"extension", self.len_extension, len(self.extension))
            self._dirty = False


    class Record(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cSceneBody.Record, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.len_body = self._io.read_u1()
            self._raw_body = self._io.read_bytes(self.len_body)
            _io__raw_body = KaitaiStream(BytesIO(self._raw_body))
            self.body = govee_shared.GoveeShared.EffectLayer(_io__raw_body)
            self.body._read()
            self._dirty = False


        def _fetch_instances(self):
            pass
            self.body._fetch_instances()


        def _write__seq(self, io=None):
            super(H607cSceneBody.Record, self)._write__seq(io)
            self._io.write_u1(self.len_body)
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


        def _check(self):
            self._dirty = False



