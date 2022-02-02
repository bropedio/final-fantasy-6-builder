"use strict"

const name_table = require('./name_table');
const { types } = require('rom-builder');

module.exports = new types.TextScript({
  table: name_table,
  map: {
    0x00: {
      name: 'end',
      type: new types.Empty()
    },
    0x01: {
      name: 'line',
      type: new types.Empty()
    },
    0x02: {
      name: 'number',
      type: new types.UInt(10)
    },
    0x03: {
      name: 'tile',
      type: new types.UInt()
    },
    0x04: {
      name: 'tilebank',
      type: new types.UInt()
    },
    0x05: {
      name: 'spaces',
      type: new types.UInt()
    },
    0x06: {
      name: '0x06',
      type: new types.Empty()
    },
    0x07: {
      name: 'character1',
      type: new types.UInt(10)
    },
    0x08: {
      name: 'character2',
      type: new types.UInt(10)
    },
    0x09: {
      name: 'character3',
      type: new types.UInt(10)
    },
    0x0A: {
      name: 'character4',
      type: new types.UInt(10)
    },
    0x0B: {
      name: 'monster_name',
      type: new types.UInt(10)
    },
    0x0C: {
      name: 'skip direction', // ?
      type: new types.UInt()
    },
    0x0D: {
      name: 'command_name',
      type: new types.UInt()
    },
    0x0E: {
      name: 'item_name',
      type: new types.UInt()
    },
    0x0F: {
      name: 'attack_name',
      type: new types.UInt()
    },
    0x10: {
      name: 'status_name',
      type: new types.UInt()
    },
    0x11: {
      name: 'padded_attack_name',
      type: new types.UInt()
    },
    0x12: {
      name: 'item_type_name',
      type: new types.UInt()
    }
  }
});
