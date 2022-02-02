"use strict";

const { types } = require('rom-builder');

module.exports = new types.File({
  name: 'SpellRates',
  extension: 'json',
  type: new types.ParallelList([{
    name: 'Esper',
    type: new types.Transformer({
      type: new types.Ref('spells'),
      transform: spells => {
        const spell_names = spells.map(spell => spell.Name.trim());
        const esper_names = spell_names.slice(54, 81);
        return new types.Literal(esper_names);
      }
    })
  }, {
    name: 'Data',
    type: new types.Reader({
      offset: 0xD86E00,
      type: new types.List({
        size: 27,
        type: new types.Struct([{
          name: 'Spells',
          type: new types.List({
            size: 5,
            type: new types.Struct([{
              name: 'Rate',
              type: new types.UInt(10)
            }, {
              name: 'Name',
              type: new types.RefEnum({
                ref: 'spells',
                path: ['Name'],
                inject: { 0xFF: 'empty' }
              })
            }])
          })
        }, {
          name: 'Bonus',
          type: new types.UInt()
        }])
      })
    })
  }])
});
