"use strict";

const { types } = require('rom-builder');

/* Slot Reels */

module.exports = new types.File({
  name: 'SlotReels',
  extension: 'json',
  type: new types.Reader({
    offset: 0xC2A800,
    type: new types.List({
      size: 3,
      type: new types.List({
        size: 16,
        type: new types.EnumWord([
          'Seven',
          'Dragon',
          'Bar',
          'Airship',
          'Chobobo',
          'Diamond'
        ])
      })
    })
  })
});
