"use strict";

const { types } = require('rom-builder');

const tile_properties_struct = new types.Bits([{
  name: 'Chocobo Blocked',
  mask: 0x0001,
  type: new types.Bool()
}, {
  name: 'Airship Blocked',
  mask: 0x0002,
  type: new types.Bool()
}, {
  name: 'Airship Shadow Size',
  mask: 0x000C,
  type: new types.UInt(10)
}, {
  name: 'Walk Blocked',
  mask: 0x0010,
  type: new types.Bool()
}, {
  name: 'Hides Character Legs',
  mask: 0x0020,
  type: new types.Bool()
}, {
  name: 'Encounters',
  mask: 0x0040,
  type: new types.Bool()
}, {
  name: 'UNKNOWN-0x0080',
  mask: 0x0080,
  type: new types.UInt(0x00)
}, {
  name: 'Battle Background',
  mask: 0x0700,
  type: new types.UInt()
}, {
  name: 'UNKNOWN-0xF800',
  mask: 0xF800,
  type: new types.UInt(0x00)
}]);

module.exports = new types.File({
  name: 'WorldTileProperties',
  extension: 'json',
  type: new types.Reader({
    offset: 0xEE9B14,
    type: new types.Struct([{
      name: 'World of Balance Tiles',
      type: new types.List({
        size: 0x100,
        type: tile_properties_struct
      })
    }, {
      name: 'World of Ruin Tiles',
      type: new types.List({
        size: 0x100,
        type: tile_properties_struct
      })
    }])
  })
});
