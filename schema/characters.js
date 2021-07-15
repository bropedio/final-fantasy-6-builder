"use strict";

const {
  JSONer,
  ParallelList,
  Reader,
  List,
  Text,
  Struct,
  UInt,
  Bool,
  Bits,
  Enum
} = require('rom-builder').types;

const { get_values } = require('rom-builder');
const table = require('./lib/name_table');

/* Characters */

class Characters extends JSONer {
  constructor (fetch) {
    super();

    const commands = get_values(fetch('command_names'), x => x.trim());
    const command_enum = new Enum({
      ...commands,
      0xFE: 'DoNothing',
      0xFF: '-'
    });
    const item_names = get_values(fetch('items'));
    const item_enum = new Enum(item_names);

    this.type = new ParallelList([{
      name: 'Name',
      type: new Reader({
        offset: 0xC478C0,
        type: new List({
          size: 0x40,
          type: new Text(6, table)
        })
      })
    }, {
      name: 'Base Stats',
      type: new Reader({
        offset: 0xED7CA0,
        type: new List({
          size: 0x40,
          type: new Struct([{
            name: 'HP',
            type: new UInt('byte', 10)
          }, {
            name: 'MP',
            type: new UInt('byte', 10)
          }, {
            name: 'Commands',
            type: new List({
              size: 4,
              type: command_enum
            })
          }, {
            name: 'Vigor',
            type: new UInt('byte', 10)
          }, {
            name: 'Speed',
            type: new UInt('byte', 10)
          }, {
            name: 'Stamina',
            type: new UInt('byte', 10)
          }, {
            name: 'Magic',
            type: new UInt('byte', 10)
          }, {
            name: 'Attack',
            type: new UInt('byte', 10)
          }, {
            name: 'Defense',
            type: new UInt('byte', 10)
          }, {
            name: 'M.Defense',
            type: new UInt('byte', 10)
          }, {
            name: 'Evasion',
            type: new UInt('byte', 10)
          }, {
            name: 'M.Evasion',
            type: new UInt('byte', 10)
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
            type: new Bits([{
              name: 'Flee Delay',
              mask: 0x03,
              type: new UInt()
            }, {
              name: 'Level Boost',
              mask: 0x0C,
              type: new Enum([0, 2, 5, -3]) // TODO: Read/write this table
            }, {
              name: 'Block Weapon Swap',
              mask: 0x10,
              type: new Bool()
            }, {
              name: 'Unused',
              mask: 0xE0,
              type: new UInt()
            }])
          }])
        })
      })
    }]);
  }
}

module.exports = Characters;
