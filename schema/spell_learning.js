"use strict";

const {
  JSONer,
  Reader,
  Struct,
  List,
  Enum,
  UInt,
  ParallelList,
  Literal
} = require('rom-builder').types;

const get_values = require('rom-builder').get_values;

class SpellRates extends JSONer {
  constructor (fetch) {
    super();

    const spell_names = get_values(fetch('spells'));
    const spell_enum = new Enum({ 0xFF: 'empty' }, spell_names);
    const esper_names = spell_names.slice(54, 81);

    this.type = new ParallelList([{
      name: 'Esper',
      type: new Literal(esper_names)
    }, {
      name: 'Data',
      type: new Reader({
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
      })
    }]);
  }
}

module.exports = SpellRates;
