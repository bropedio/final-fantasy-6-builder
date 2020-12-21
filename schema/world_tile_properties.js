"use strict";

const {
  JSONer,
  Reader,
  Struct,
  Bits,
  List,
  Bool,
  Fixed,
  UInt
} = require('rom-builder').types;

const tile_properties_struct = new Bits([{
  name: 'Chocobo Blocked',
  mask: 0x0001,
  type: new Bool()
}, {
  name: 'Airship Blocked',
  mask: 0x0002,
  type: new Bool()
}, {
  name: 'Airship Shadow Size',
  mask: 0x000C,
  type: new UInt(10)
}, {
  name: 'Walk Blocked',
  mask: 0x0010,
  type: new Bool()
}, {
  name: 'Hides Character Legs',
  mask: 0x0020,
  type: new Bool()
}, {
  name: 'Encounters',
  mask: 0x0040,
  type: new Bool()
}, {
  name: 'UNKNOWN-0x0080',
  mask: 0x0080,
  type: new UInt(0x00)
}, {
  name: 'Battle Background',
  mask: 0x0700,
  type: new UInt()
}, {
  name: 'UNKNOWN-0xF800',
  mask: 0xF800,
  type: new UInt(0x00)
}]);

class WorldTileProperties extends JSONer {
  constructor (fetch) {
    super();

    this.type = new Reader({
      offset: 0xEE9B14,
      type: new Struct([{
        name: 'World of Balance Tiles',
        type: new List({
          size: 0x100,
          type: tile_properties_struct
        })
      }, {
        name: 'World of Ruin Tiles',
        type: new List({
          size: 0x100,
          type: tile_properties_struct
        })
      }])
    });
  }
}

module.exports = WorldTileProperties;
