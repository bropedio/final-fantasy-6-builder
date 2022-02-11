"use strict";

const { types } = require('rom-builder')
const table = require('./lib/name_table');
const targeting = require('./lib/targeting');

module.exports = new types.File({
  name: 'Commands',
  extension: 'json',
  type: new types.ParallelList([{
    name: 'Name',
    type: new types.Reader({
      offset: 0xD8CEA0,
      type: new types.List({
        size: 32,
        type: new types.Text(7, table)
      }) 
    })
  }, {
    name: 'Wait',
    type: new types.Reader({
      offset: 0xC2067B,
      type: new types.List({
        size: 32,
        type: new types.UInt(10)
      })
    })
  }, {
    name: 'Data',
    type: new types.Reader({
      offset: 0xCFFE00,
      type: new types.List({
        size: 32,
        type: new types.Struct([{
          name: 'Flags',
          type: new types.Bitmask({
            flags: [
              'Gogo can use',
              'Mimickable',
              'Imp can use',
              'UNKNOWN-08',
              'UNKNOWN-10',
              'UNKNOWN-20',
              'UNKNOWN-40',
              'UNKNOWN-80'
            ]
          })
        }, {
          name: 'Targeting',
          type: targeting
        }])
      })
    })
  }, {
    name: 'Targeting Flags',
    type: new types.Reader({
      offset: 0xC2278A,
      type: new types.List({
        size: 32,
        type: new types.Bitmask({
          flags: [
            'Exclude Attacker from Targets',
            'Type: Item-ish',
            'Type: Magic-ish',
            'No Retarget when Invalid',
            'Target Dead Only',
            'Beat on Corpses',
            'Randomize Target',
            'Abort on Characters'
          ]
        })
      })
    })
  }])
});
