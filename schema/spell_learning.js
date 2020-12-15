"use strict";

const {
  JSONer,
  Reader,
  Struct,
  List,
  Enum,
  UInt
} = require('rom-builder').types;

class SpellRates extends JSONer {
  constructor (fetch) {
    super();

    const { data, scheme } = fetch('spells');
    const spells = scheme.type.format(data);
    const spell_names = spells.reduce((obj, spell, i) => {
      obj[i] = spell.Name;
      return obj;
    }, {});
    const spell_enum = new Enum({ 0xFF: 'empty' }, spell_names);

    this.type = new Reader({
      offset: 0xD86E00,
      type: new List({
        size: 27,
        type: new Struct([{
          name: 'Spells',
          type: new List({
            size: 5,
            type: new Struct([{
              name: 'Rate',
              type: new UInt(10)
            }, {
              name: 'Name',
              type: spell_enum
            }])
          })
        }, {
          name: 'Bonus',
          type: new UInt()
        }])
      })
    });
  }
}

module.exports = SpellRates;
