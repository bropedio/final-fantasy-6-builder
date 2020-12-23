"use strict";

const {
  get_values,
  types
} = require('rom-builder');

const {
  JSONer,
  Reader,
  List,
  Struct,
  UInt,
  Enum
} = types;

/* Natural Magic */

class NaturalMagic extends JSONer {
  constructor (fetch) {
    super();

    const spell_names = get_values(fetch('spells'));
    const spell_enum = new Enum(spell_names);

    const natural_magic = new List({
      size: 16,
      type: new Struct([{
        name: 'Spell',
        type: spell_enum
      }, {
        name: 'Level',
        type: new UInt(10)
      }])
    });

    this.type = new Reader({
      offset: 0xECE3C0,
      type: new Struct([{
        name: 'Terra',
        type: natural_magic
      }, {
        name: 'Celes',
        type: natural_magic
      }])
    });
  }
}

module.exports = NaturalMagic;
