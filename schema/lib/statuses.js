"use strict";

const { types } = require('rom-builder');

const status_list = [
  // Byte 1
  'Dark',
  'Zombie',
  'Poison',
  'Magitek',
  'Vanish',
  'Imp',
  'Petrify',
  'Death',

  // Byte 2
  'Doom',
  'Near Fatal',
  'Image',
  'Mute',
  'Bserk',
  'Muddle',
  'Sap',
  'Sleep',

  // Byte 3
  'Dance',
  'Regen',
  'Slow',
  'Haste',
  'Stop',
  'Shell',
  'Safe',
  'Reflect',

  // Byte 4
  'Rage',
  'Frozen',
  'Safety',
  'Morph',
  'Chanting',
  'Hidden',
  'Dog Block',
  'Float'
];

const status_1 = new types.Bitmask({ flags: status_list.slice(0, 8) });
const status_2 = new types.Bitmask({ flags: status_list.slice(8, 16) });
const status_3 = new types.Bitmask({ flags: status_list.slice(16, 24) });
const status_4 = new types.Bitmask({ flags: status_list.slice(24) });
const statuses = new types.Bitmask({ flags: status_list });

const status_enum = new types.Enum(status_list);
const status_struct = new types.Struct([
  { name: 'Status-1', type: status_1 },
  { name: 'Status-2', type: status_2 },
  { name: 'Status-3', type: status_3 },
  { name: 'Status-4', type: status_4 }
]);

module.exports = {
  status_1,
  status_2,
  status_3,
  status_4,
  statuses,
  status_struct,
  status_enum
};
