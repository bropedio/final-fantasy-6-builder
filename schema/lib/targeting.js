"use strict";

const {
  Bits,
  Enum
} = require('rom-builder').types;

module.exports = new Bits([{
  mask: 0x10,
  name: 'Auto',
  type: new Enum(['Off', 'On'])
}, {
  mask: 0xEF,
  name: 'Type',
  type: new Enum({
    0x00: 'Empty',
    0x61: 'Spread Hurt',
    0x63: 'Spread Foes',
    0x41: 'Hurt One',
    0x43: 'One Foe',
    0x04: 'Everyone',
    0x6A: 'Foe Group',
    0x6E: 'All Foes',
    0x03: 'One Ally',
    0x2A: 'Ally Group',
    0x01: 'Help One',
    0x2E: 'All Allies',
    0x21: 'Spread Help',
    0x23: 'TODO-Targeting',
    0x02: 'Self',
    0x6B: 'Unknown...',
  })
}]);
