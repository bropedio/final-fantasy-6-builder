"use strict";

const { types } = require('rom-builder');
const table = require('./lib/name_table');

const item_enum = new types.RefEnum({
  ref: 'items',
  path: ['Name']
});

module.exports = new types.File({
  name: 'Characters',
  extension: 'json',
  type: new types.ParallelList([{
    name: 'Name',
    type: new types.Reader({
      offset: 0xC478C0,
      type: new types.List({
        size: 0x40,
        type: new types.Text(6, table)
      })
    })
  }, {
    name: 'Base Stats',
    type: new types.Reader({
      offset: 0xED7CA0,
      type: new types.List({
        size: 0x40,
        type: new types.Struct([{
          name: 'HP',
          type: new types.UInt('byte', 10)
        }, {
          name: 'MP',
          type: new types.UInt('byte', 10)
        }, {
          name: 'Commands',
          type: new types.List({
            size: 4,
            type: new types.RefEnum({
              ref: 'commands',
              path: ['Name'],
              inject: {
                0xFE: 'DoNothing',
                0xFF: '-'
              }
            })
          })
        }, {
          name: 'Vigor',
          type: new types.UInt('byte', 10)
        }, {
          name: 'Speed',
          type: new types.UInt('byte', 10)
        }, {
          name: 'Stamina',
          type: new types.UInt('byte', 10)
        }, {
          name: 'Magic',
          type: new types.UInt('byte', 10)
        }, {
          name: 'Attack',
          type: new types.UInt('byte', 10)
        }, {
          name: 'Defense',
          type: new types.UInt('byte', 10)
        }, {
          name: 'M.Defense',
          type: new types.UInt('byte', 10)
        }, {
          name: 'Evasion',
          type: new types.UInt('byte', 10)
        }, {
          name: 'M.Evasion',
          type: new types.UInt('byte', 10)
        }, {
          name: 'Right Hand',
          type: item_enum
        }, {
          name: 'Left Hand',
          type: item_enum
        }, {
          name: 'Head',
          type: item_enum
        }, {
          name: 'Body',
          type: item_enum
        }, {
          name: 'Relic 1',
          type: item_enum
        }, {
          name: 'Relic 2',
          type: item_enum
        }, {
          name: 'Miscellaneous',
          type: new types.Bits([{
            name: 'Flee Delay',
            mask: 0x03,
            type: new types.UInt()
          }, {
            name: 'Level Boost',
            mask: 0x0C,
            type: new types.Enum([0, 2, 5, -3]) // TODO: Read/write this table
          }, {
            name: 'Block Weapon Swap',
            mask: 0x10,
            type: new types.Bool()
          }, {
            name: 'Unused',
            mask: 0xE0,
            type: new types.UInt()
          }])
        }])
      })
    })
  }])
});
