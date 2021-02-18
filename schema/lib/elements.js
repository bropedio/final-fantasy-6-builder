"use strict";

const {
  Bitmask
} = require('rom-builder').types;

module.exports = new Bitmask({
  off_state: 'N/A',
  flags: [
    'Fire',
    'Ice',
    'Bolt',
    'Dark',
    'Wind',
    'Holy',
    'Earth',
    'Water'
  ]
});
