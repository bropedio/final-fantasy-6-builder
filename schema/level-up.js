"use strict";

const { types } = require('rom-builder');

/* Level Up Tables */

module.exports = new types.File({
  name: 'LevelUp',
  extension: 'json',
  type: new types.Struct([{
    name: 'HP Gains',
    type: new types.Reader({
      offset: 0xE6F4A0,
      type: new types.List({
        size: 99,
        type: new types.UInt('byte', 10)
      })
    })
  }, {
    name: 'MP Gains',
    type: new types.Reader({
      offset: 0xE6F502,
      type: new types.List({
        size: 99,
        type: new types.UInt('byte', 10)
      })
    })
  }])
});
