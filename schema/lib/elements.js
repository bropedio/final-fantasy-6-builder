"use strict";

const {
  Bitmask
} = require('rom-builder').types;

module.exports = new Bitmask({
  off_state: 'N/A',
  flags: {
    0x01: 'Fire',
    0x02: 'Ice',
    0x04: 'Bolt',
    0x08: 'Dark',
    0x10: 'Wind',
    0x20: 'Holy',
    0x40: 'Earth',
    0x80: 'Water'
  }
});
