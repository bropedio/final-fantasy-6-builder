"use strict";

const name_table = require('./name_table');
const {
  JSONer,
  Enum,
  Closure,
  Empty,
  UInt,
  Reader,
  PointerTable,
  TextScript
} = require('rom-builder').types;

module.exports = new TextScript({
  table: name_table,
  map: {
    0x00: {
      name: 'end',
      type: new Empty()
    },
    0x01: {
      name: 'line',
      type: new Empty()
    },
    0x02: {
      name: 'character name',
      type: new UInt()
    },
    0x03: {
      name: '0x03',
      type: new Empty()
    },
    0x04: {
      name: 'toggle_something',
      type: new Empty()
    },
    0x05: {
      name: 'pause',
      type: new Empty()
    },
    0x06: {
      name: 'frames',
      type: new UInt(10)
    },
    0x07: {
      name: 'press_a',
      type: new Empty()
    },
    0x08: {
      name: '0x08',
      type: new Empty()
    },
    0x09: {
      name: '0x09',
      type: new Empty()
    },
    0x0A: {
      name: '0x0A',
      type: new Empty()
    },
    0x0B: {
      name: '0x0B',
      type: new Empty()
    },
    0x0C: {
      name: 'command_name',
      type: new UInt()
    },
    0x0D: {
      name: '0x0D',
      type: new Empty()
    },
    0x0E: {
      name: 'item_name',
      type: new UInt()
    },
    0x0F: {
      name: 'attack_name',
      type: new UInt()
    },
    0x10: {
      name: 'variable_info_1',
      type: new Empty()
    },
    0x11: {
      name: 'variable_info_2',
      type: new Empty()
    },
    0x12: {
      name: 'draw_name',
      type: new Enum(['character', 'item', 'attack', 'command'])
    },
    0x13: {
      name: 'variable_info_3',
      type: new Empty()
    },
    0x14: {
      name: 'variable_info_4',
      type: new Empty()
    },
    0x1C: {
      name: 'tile_38',
      type: new Empty()
    },
    0x1D: {
      name: 'tile_3A',
      type: new Empty()
    },
    0x1E: {
      name: 'tile_3C',
      type: new Empty()
    },
    0x1F: {
      name: 'tile_3E',
      type: new Empty()
    },
  }
});
