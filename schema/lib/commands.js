"use strict";

const { Enum } = require('rom-builder').types;

const command_enum = new Enum({
  0x00: 'Fight',
  0x01: 'Item',
  0x02: 'Magic',
  0x03: 'Morph',
  0x04: 'Revert',
  0x05: 'Steal',
  0x06: 'Mug',
  0x07: 'Bushido',
  0x08: 'Throw',
  0x09: 'Tools',
  0x0A: 'Blitz',
  0x0B: 'Runic',
  0x0C: 'Lore',
  0x0D: 'Sketch',
  0x0E: 'Control',
  0x0F: 'Slot',
  0x10: 'Rage',
  0x11: 'Leap',
  0x12: 'Mimic',
  0x13: 'Dance',
  0x14: 'Row',
  0x15: 'Defend',
  0x16: 'Jump',
  0x17: 'X-Magic',
  0x18: 'GP Rain',
  0x19: 'Summon',
  0x1A: 'Health',
  0x1B: 'Shock',
  0x1C: 'Possess',
  0x1D: 'Magitek',
  0xFE: 'DoNothing',
  0xFF: '-'
});

module.exports = { command_enum };
