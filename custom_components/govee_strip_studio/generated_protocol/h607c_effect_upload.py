# This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild
# type: ignore

import kaitaistruct
from kaitaistruct import ReadWriteKaitaiStruct, KaitaiStream, BytesIO
from custom_components.govee_strip_studio.generated_protocol import govee_common
from custom_components.govee_strip_studio.generated_protocol import govee_shared
from custom_components.govee_strip_studio.generated_protocol import h607c_diy_body
from custom_components.govee_strip_studio.generated_protocol import h607c_dreamview_group
from custom_components.govee_strip_studio.generated_protocol import h607c_music_body
from custom_components.govee_strip_studio.generated_protocol import h607c_music_write
from custom_components.govee_strip_studio.generated_protocol import h607c_paint_body
from custom_components.govee_strip_studio.generated_protocol import h607c_scene_body
from enum import IntEnum


if getattr(kaitaistruct, 'API_VERSION', (0, 9)) < (0, 11):
    raise Exception("Incompatible Kaitai Struct Python API: 0.11 or later is required, but you have %s" % (kaitaistruct.__version__))

class H607cEffectUpload(ReadWriteKaitaiStruct):
    """H607C.
    Compatibility hypothesis: catalogue/body family and transport command are
    independent. The scene command itself supplies its catalogue marker once.
    Music adds its mode after command 41; native DIY uses command 56 and
    native paint command 03. Music DreamView has separate palette, protocol,
    membership and member-scene commands.
    Member-scene assignments require independently sourced operation/effect/
    activation metadata, not an ordinary lamp scene-type number.
    Unknown suffixes are retained; actual acceptance and rendering are unqualified.
    """

    class Kind(IntEnum):
        paint = 3
        layered_scene = 10
        music = 65
        dreamview_palette = 81
        dreamview_protocols = 85
        native_diy = 86
        dreamview_scene = 88
        dreamview_group = 96
    def __init__(self, _io=None, _parent=None, _root=None):
        super(H607cEffectUpload, self).__init__(_io)
        self._parent = _parent
        self._root = _root or self

    def _read(self):
        self.header = govee_common.GoveeCommon.A3Header(self._io)
        self.header._read()
        self.kind = KaitaiStream.resolve_enum(H607cEffectUpload.Kind, self._io.read_u1())
        _on = self.kind
        if _on == H607cEffectUpload.Kind.dreamview_group:
            pass
            self.content = h607c_dreamview_group.H607cDreamviewGroup(self._io)
            self.content._read()
        elif _on == H607cEffectUpload.Kind.dreamview_palette:
            pass
            self.content = H607cEffectUpload.Palette(self._io, self, self._root)
            self.content._read()
        elif _on == H607cEffectUpload.Kind.dreamview_protocols:
            pass
            self.content = H607cEffectUpload.Protocols(self._io, self, self._root)
            self.content._read()
        elif _on == H607cEffectUpload.Kind.dreamview_scene:
            pass
            self.content = H607cEffectUpload.SceneAssignments(self._io, self, self._root)
            self.content._read()
        elif _on == H607cEffectUpload.Kind.layered_scene:
            pass
            self.content = H607cEffectUpload.LayeredScene(self._io, self, self._root)
            self.content._read()
        elif _on == H607cEffectUpload.Kind.music:
            pass
            self.content = H607cEffectUpload.Music(self._io, self, self._root)
            self.content._read()
        elif _on == H607cEffectUpload.Kind.native_diy:
            pass
            self.content = h607c_diy_body.H607cDiyBody(self._io)
            self.content._read()
        elif _on == H607cEffectUpload.Kind.paint:
            pass
            self.content = h607c_paint_body.H607cPaintBody(self._io)
            self.content._read()
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
        self.header._fetch_instances()
        _on = self.kind
        if _on == H607cEffectUpload.Kind.dreamview_group:
            pass
            self.content._fetch_instances()
        elif _on == H607cEffectUpload.Kind.dreamview_palette:
            pass
            self.content._fetch_instances()
        elif _on == H607cEffectUpload.Kind.dreamview_protocols:
            pass
            self.content._fetch_instances()
        elif _on == H607cEffectUpload.Kind.dreamview_scene:
            pass
            self.content._fetch_instances()
        elif _on == H607cEffectUpload.Kind.layered_scene:
            pass
            self.content._fetch_instances()
        elif _on == H607cEffectUpload.Kind.music:
            pass
            self.content._fetch_instances()
        elif _on == H607cEffectUpload.Kind.native_diy:
            pass
            self.content._fetch_instances()
        elif _on == H607cEffectUpload.Kind.paint:
            pass
            self.content._fetch_instances()
        for i in range(len(self.padding)):
            pass



    def _write__seq(self, io=None):
        super(H607cEffectUpload, self)._write__seq(io)
        self.header._write__seq(self._io)
        self._io.write_u1(int(self.kind))
        _on = self.kind
        if _on == H607cEffectUpload.Kind.dreamview_group:
            pass
            self.content._write__seq(self._io)
        elif _on == H607cEffectUpload.Kind.dreamview_palette:
            pass
            self.content._write__seq(self._io)
        elif _on == H607cEffectUpload.Kind.dreamview_protocols:
            pass
            self.content._write__seq(self._io)
        elif _on == H607cEffectUpload.Kind.dreamview_scene:
            pass
            self.content._write__seq(self._io)
        elif _on == H607cEffectUpload.Kind.layered_scene:
            pass
            self.content._write__seq(self._io)
        elif _on == H607cEffectUpload.Kind.music:
            pass
            self.content._write__seq(self._io)
        elif _on == H607cEffectUpload.Kind.native_diy:
            pass
            self.content._write__seq(self._io)
        elif _on == H607cEffectUpload.Kind.paint:
            pass
            self.content._write__seq(self._io)
        for i in range(len(self.padding)):
            pass
            if self._io.is_eof():
                raise kaitaistruct.ConsistencyError(u"padding", 0, self._io.size() - self._io.pos())
            self._io.write_u1(self.padding[i])

        if not self._io.is_eof():
            raise kaitaistruct.ConsistencyError(u"padding", 0, self._io.size() - self._io.pos())


    def _check(self):
        _on = self.kind
        if _on == H607cEffectUpload.Kind.dreamview_group:
            pass
        elif _on == H607cEffectUpload.Kind.dreamview_palette:
            pass
            if self.content._root != self._root:
                raise kaitaistruct.ConsistencyError(u"content", self._root, self.content._root)
            if self.content._parent != self:
                raise kaitaistruct.ConsistencyError(u"content", self, self.content._parent)
        elif _on == H607cEffectUpload.Kind.dreamview_protocols:
            pass
            if self.content._root != self._root:
                raise kaitaistruct.ConsistencyError(u"content", self._root, self.content._root)
            if self.content._parent != self:
                raise kaitaistruct.ConsistencyError(u"content", self, self.content._parent)
        elif _on == H607cEffectUpload.Kind.dreamview_scene:
            pass
            if self.content._root != self._root:
                raise kaitaistruct.ConsistencyError(u"content", self._root, self.content._root)
            if self.content._parent != self:
                raise kaitaistruct.ConsistencyError(u"content", self, self.content._parent)
        elif _on == H607cEffectUpload.Kind.layered_scene:
            pass
            if self.content._root != self._root:
                raise kaitaistruct.ConsistencyError(u"content", self._root, self.content._root)
            if self.content._parent != self:
                raise kaitaistruct.ConsistencyError(u"content", self, self.content._parent)
        elif _on == H607cEffectUpload.Kind.music:
            pass
            if self.content._root != self._root:
                raise kaitaistruct.ConsistencyError(u"content", self._root, self.content._root)
            if self.content._parent != self:
                raise kaitaistruct.ConsistencyError(u"content", self, self.content._parent)
        elif _on == H607cEffectUpload.Kind.native_diy:
            pass
        elif _on == H607cEffectUpload.Kind.paint:
            pass
        for i in range(len(self.padding)):
            pass
            if not self.padding[i] == 0:
                raise kaitaistruct.ValidationNotEqualError(0, self.padding[i], None, u"/seq/3")

        self._dirty = False

    class LayeredScene(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cEffectUpload.LayeredScene, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.num_records = self._io.read_u1()
            self.records = []
            for i in range(self.num_records):
                _t_records = h607c_scene_body.H607cSceneBody.Record(self._io)
                try:
                    _t_records._read()
                finally:
                    self.records.append(_t_records)

            self._dirty = False


        def _fetch_instances(self):
            pass
            for i in range(len(self.records)):
                pass
                self.records[i]._fetch_instances()



        def _write__seq(self, io=None):
            super(H607cEffectUpload.LayeredScene, self)._write__seq(io)
            self._io.write_u1(self.num_records)
            for i in range(len(self.records)):
                pass
                self.records[i]._write__seq(self._io)



        def _check(self):
            if len(self.records) != self.num_records:
                raise kaitaistruct.ConsistencyError(u"records", self.num_records, len(self.records))
            for i in range(len(self.records)):
                pass

            self._dirty = False


    class Music(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cEffectUpload.Music, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.mode = KaitaiStream.resolve_enum(h607c_music_write.H607cMusicWrite.MusicMode, self._io.read_u1())
            _on = self.mode
            if _on == h607c_music_write.H607cMusicWrite.MusicMode.paired:
                pass
                self.body = h607c_music_body.H607cMusicBody.PairedParameters(self._io)
                self.body._read()
            else:
                pass
                self.body = h607c_music_body.H607cMusicBody.Parameters(self.mode, self._io)
                self.body._read()
            self._dirty = False


        def _fetch_instances(self):
            pass
            _on = self.mode
            if _on == h607c_music_write.H607cMusicWrite.MusicMode.paired:
                pass
                self.body._fetch_instances()
            else:
                pass
                self.body._fetch_instances()


        def _write__seq(self, io=None):
            super(H607cEffectUpload.Music, self)._write__seq(io)
            self._io.write_u1(int(self.mode))
            _on = self.mode
            if _on == h607c_music_write.H607cMusicWrite.MusicMode.paired:
                pass
                self.body._write__seq(self._io)
            else:
                pass
                self.body._write__seq(self._io)


        def _check(self):
            _on = self.mode
            if _on == h607c_music_write.H607cMusicWrite.MusicMode.paired:
                pass
            else:
                pass
                if self.body.mode != self.mode:
                    raise kaitaistruct.ConsistencyError(u"body", self.mode, self.body.mode)
            self._dirty = False


    class Palette(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cEffectUpload.Palette, self).__init__(_io)
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
            super(H607cEffectUpload.Palette, self)._write__seq(io)
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


    class ProtocolPair(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cEffectUpload.ProtocolPair, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.protocol_type = self._io.read_u1()
            self.protocol_version = self._io.read_u1()
            self._dirty = False


        def _fetch_instances(self):
            pass


        def _write__seq(self, io=None):
            super(H607cEffectUpload.ProtocolPair, self)._write__seq(io)
            self._io.write_u1(self.protocol_type)
            self._io.write_u1(self.protocol_version)


        def _check(self):
            self._dirty = False


    class Protocols(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cEffectUpload.Protocols, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.num_members = self._io.read_u1()
            self.members = []
            for i in range(self.num_members):
                _t_members = H607cEffectUpload.ProtocolPair(self._io, self, self._root)
                try:
                    _t_members._read()
                finally:
                    self.members.append(_t_members)

            self._dirty = False


        def _fetch_instances(self):
            pass
            for i in range(len(self.members)):
                pass
                self.members[i]._fetch_instances()



        def _write__seq(self, io=None):
            super(H607cEffectUpload.Protocols, self)._write__seq(io)
            self._io.write_u1(self.num_members)
            for i in range(len(self.members)):
                pass
                self.members[i]._write__seq(self._io)



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


    class SceneAssignments(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cEffectUpload.SceneAssignments, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.num_groups = self._io.read_u1()
            self.groups = []
            for i in range(self.num_groups):
                _t_groups = H607cEffectUpload.SceneGroup(self._io, self, self._root)
                try:
                    _t_groups._read()
                finally:
                    self.groups.append(_t_groups)

            self._dirty = False


        def _fetch_instances(self):
            pass
            for i in range(len(self.groups)):
                pass
                self.groups[i]._fetch_instances()



        def _write__seq(self, io=None):
            super(H607cEffectUpload.SceneAssignments, self)._write__seq(io)
            self._io.write_u1(self.num_groups)
            for i in range(len(self.groups)):
                pass
                self.groups[i]._write__seq(self._io)



        def _check(self):
            if len(self.groups) != self.num_groups:
                raise kaitaistruct.ConsistencyError(u"groups", self.num_groups, len(self.groups))
            for i in range(len(self.groups)):
                pass
                if self.groups[i]._root != self._root:
                    raise kaitaistruct.ConsistencyError(u"groups", self._root, self.groups[i]._root)
                if self.groups[i]._parent != self:
                    raise kaitaistruct.ConsistencyError(u"groups", self, self.groups[i]._parent)

            self._dirty = False


    class SceneGroup(ReadWriteKaitaiStruct):
        def __init__(self, _io=None, _parent=None, _root=None):
            super(H607cEffectUpload.SceneGroup, self).__init__(_io)
            self._parent = _parent
            self._root = _root

        def _read(self):
            self.num_members = self._io.read_u1()
            self.reversed_macs = []
            for i in range(self.num_members):
                self.reversed_macs.append(self._io.read_bytes(6))

            self.operation = self._io.read_u1()
            self.len_effect = self._io.read_u2le()
            self.effect = self._io.read_bytes(self.len_effect)
            self.len_activation = self._io.read_u1()
            self.activation = self._io.read_bytes(self.len_activation)
            self._dirty = False


        def _fetch_instances(self):
            pass
            for i in range(len(self.reversed_macs)):
                pass



        def _write__seq(self, io=None):
            super(H607cEffectUpload.SceneGroup, self)._write__seq(io)
            self._io.write_u1(self.num_members)
            for i in range(len(self.reversed_macs)):
                pass
                self._io.write_bytes(self.reversed_macs[i])

            self._io.write_u1(self.operation)
            self._io.write_u2le(self.len_effect)
            self._io.write_bytes(self.effect)
            self._io.write_u1(self.len_activation)
            self._io.write_bytes(self.activation)


        def _check(self):
            if len(self.reversed_macs) != self.num_members:
                raise kaitaistruct.ConsistencyError(u"reversed_macs", self.num_members, len(self.reversed_macs))
            for i in range(len(self.reversed_macs)):
                pass
                if len(self.reversed_macs[i]) != 6:
                    raise kaitaistruct.ConsistencyError(u"reversed_macs", 6, len(self.reversed_macs[i]))

            if len(self.effect) != self.len_effect:
                raise kaitaistruct.ConsistencyError(u"effect", self.len_effect, len(self.effect))
            if len(self.activation) != self.len_activation:
                raise kaitaistruct.ConsistencyError(u"activation", self.len_activation, len(self.activation))
            self._dirty = False



