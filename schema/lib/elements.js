"use strict";

const { types } = require('rom-builder');

module.exports = new types.Bitmask({
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
