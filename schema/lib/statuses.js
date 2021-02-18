"use strict";

const {
  Bitmask,
  Enum,
  Struct
} = require('rom-builder').types;

const status_1 = new Bitmask({
  flags: [
    'Dark',
    'Zombie',
    'Poison',
    'Magitek',
    'Vanish',
    'Imp',
    'Petrify',
    'Death'
  ]
});

const status_2 = new Bitmask({
  flags: [
    'Doom',
    'Near Fatal',
    'Image',
    'Mute',
    'Bserk',
    'Muddle',
    'Sap',
    'Sleep'
  ]
});

const status_3 = new Bitmask({
  flags: [
    'Dance',
    'Regen',
    'Slow',
    'Haste',
    'Stop',
    'Shell',
    'Safe',
    'Reflect'
  ]
});

const status_4 = new Bitmask({
  flags: [
    'Rage',
    'Frozen',
    'Safety',
    'Morph',
    'Chanting',
    'Hidden',
    'Dog Block',
    'Float'
  ]
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
