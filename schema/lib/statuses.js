"use strict";

const { types } = require('rom-builder');

const status_1 = new types.Bitmask({
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

const status_2 = new types.Bitmask({
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

const status_3 = new types.Bitmask({
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

const status_4 = new types.Bitmask({
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

const all_statuses = new types.Struct([{
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

const status_enum = new types.Enum([
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
