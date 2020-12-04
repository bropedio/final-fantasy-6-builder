"use strict";

const {
  Bitmask,
  Enum,
  Struct
} = require('rom-builder').types;

const status_1 = new Bitmask({
  flags: {
    0x01: 'Dark',
    0x02: 'Zombie',
    0x04: 'Poison',
    0x08: 'Magitek',
    0x10: 'Vanish',
    0x20: 'Imp',
    0x40: 'Petrify',
    0x80: 'Death'
  }
});

const status_2 = new Bitmask({
  flags: {
    0x01: 'Doom',
    0x02: 'Near Fatal',
    0x04: 'Image',
    0x08: 'Mute',
    0x10: 'Bserk',
    0x20: 'Muddle',
    0x40: 'Sap',
    0x80: 'Sleep'
  }
});

const status_3 = new Bitmask({
  flags: {
    0x01: 'Dance',
    0x02: 'Regen',
    0x04: 'Slow',
    0x08: 'Haste',
    0x10: 'Stop',
    0x20: 'Shell',
    0x40: 'Safe',
    0x80: 'Reflect'
  }
});

const status_4 = new Bitmask({
  flags: {
    0x01: 'Rage',
    0x02: 'Frozen',
    0x04: 'Safety',
    0x08: 'Morph',
    0x10: 'Chanting',
    0x20: 'Hidden',
    0x40: 'Dog Block',
    0x80: 'Float'
  }
});

const all_statuses = new Struct([{
  name: 'Status-1',
  type: status_1
}, {
  name: 'Status-2',
  type: status_2
}, {
  name: 'Status-3',
  type: status_3
}, {
  name: 'Status-4',
  type: status_4
}]);

const status_enum = new Enum([
  'Dark',
  'Zombie',
  'Poison',
  'Magitek',
  'Vanish',
  'Imp',
  'Petrify',
  'Death',
  'Doom',
  'Near Fatal',
  'Image',
  'Mute',
  'Bserk',
  'Muddle',
  'Sap',
  'Sleep',
  'Dance',
  'Regen',
  'Slow',
  'Haste',
  'Stop',
  'Shell',
  'Safe',
  'Reflect',
  'Rage',
  'Frozen',
  'Safety',
  'Morph',
  'Chanting',
  'Hidden',
  'Dog Block',
  'Float'
]);

module.exports = {
  status_1,
  status_2,
  status_3,
  status_4,
  all_statuses,
  status_enum
};
