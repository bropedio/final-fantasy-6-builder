"use strict";

const { types } = require('rom-builder');

/* Natural Magic */

const natural_magic = new types.List({
  size: 16,
  type: new types.Struct([{
    name: 'Spell',
    type: new types.RefEnum({
      ref: 'spells',
      path: ['Name']
    })
  }, {
    name: 'Level',
    type: new types.UInt(10)
  }])
});

module.exports = new types.File({
  name: 'NaturalMagic',
  extension: 'json',
  type: new types.Reader({
    offset: 0xECE3C0,
    type: new types.Struct([{
      name: 'Terra',
      type: natural_magic
    }, {
      name: 'Celes',
      type: natural_magic
    }])
  })
});
