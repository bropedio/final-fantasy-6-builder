"use strict";

const {
  Text,
  Enum,
  Bool,
  Bitmask,
  Bits,
  Custom,
  UInt,
  List,
  Reader,
  ParallelList,
  Struct,
  JSONer
} = require('rom-builder').types;

const { get_values } = require('rom-builder');
const AIReader = require('./lib/ai');
const name_table = require('./lib/name_table');
const statuses = require('./lib/statuses');
const elements = require('./lib/elements');

/* Monsters */

class Monsters extends JSONer {
  constructor (fetch) {
    super();

    const spell_names = get_values(fetch('spells'));
    const spell_enum = new Enum({ 0xFF: '-' }, spell_names);

    const item_names = get_values(fetch('items'));
    const item_enum = new Enum({ 0xFF: '[n/a]' }, item_names);

    this.type = new ParallelList([{
      name: 'Name',
      type: new Reader({
        offset: 0xCFC050,
        type: new List({
          size: 384,
          type: new Text(10, name_table)
        })
      })
    }, {
      name: 'Stats',
      type: new Reader({
        offset: 0xCF0000,
        type: new List({
          size: 384,
          type: new Struct([{
            name: 'Speed',
            type: new UInt()
          }, {
            name: 'Attack',
            type: new UInt()
          }, {
            name: 'Hit Rate',
            type: new UInt()
          }, {
            name: 'Evasion',
            type: new UInt()
          }, {
            name: 'Magic Evasion',
            type: new UInt()
          }, {
            name: 'Defense',
            type: new UInt()
          }, {
            name: 'Magic Defense',
            type: new UInt()
          }, {
            name: 'Magic Power',
            type: new UInt()
          }, {
            name: 'HP',
            type: new UInt('word')
          }, {
            name: 'MP',
            type: new UInt('word')
          }, {
            name: 'Experience',
            type: new UInt('word')
          }, {
            name: 'Gold',
            type: new UInt('word')
          }, {
            name: 'Level',
            type: new UInt()
          }, {
            name: 'Ragnarok Data',
            type: new UInt()
          }, {
            name: 'Flags-1',
            type: new Bitmask({
              flags: {
                0x01: 'Dies at 0 MP',
                0x02: 'UNKNOWN 0x02',
                0x04: 'No Name',
                0x08: 'UNKNOWN 0x08',
                0x10: 'Humanoid',
                0x20: 'UNKNOWN 0x20',
                0x40: 'Boss',
                0x80: 'Undead'
              }
            })
          }, {
            name: 'Flags-2',
            type: new Bitmask({
              flags: {
                0x01: 'Hard to Run',
                0x02: 'Attack First',
                0x04: 'Fractional Immune', // BNW (Suplex Immunity)
                0x08: 'Cannot Run',
                0x10: 'Cannot Scan',
                0x20: 'Cannot Sketch',
                0x40: 'Special Event',
                0x80: 'Cannot Control'
              }
            })
          }, {
            name: 'Blocked Status-1',
            type: statuses.status_1
          }, {
            name: 'Blocked Status-2',
            type: statuses.status_2
          }, {
            name: 'Blocked Status-3',
            type: statuses.status_3
          }, {
            name: 'Absorb Elements',
            type: elements
          }, {
            name: 'Immune Elements',
            type: elements
          }, {
            name: 'Weak Elements',
            type: elements
          }, {
            name: 'Attack Graphic',
            type: new UInt()
          }, {
            name: 'Innate Status-1',
            type: statuses.status_1
          }, {
            name: 'Innate Status-2',
            type: statuses.status_2
          }, {
            name: 'Innate Status-3',
            type: statuses.status_3
          }, {
            name: 'Flags-3',
            type: new Bitmask({
              flags: {
                0x01: 'True Knight',
                0x02: 'Runic',
                0x04: 'Rerise',
                0x08: 'UNKNOWN 0x08',
                0x10: 'UNKNOWN 0x10',
                0x20: 'UNKNOWN 0x20',
                0x40: 'UNKNOWN 0x40',
                0x80: 'Removeable Float'
              }
            })
          }, {
            name: 'Special Attack',
            type: new Bits([{
              name: 'Added Effect',
              mask: 0x3F,
              type: new Custom({
                type: new UInt(),
                formatter: data => {

                /* Potential Migration (needs asm)

                 20 10 08 04 02 01
                 20: boost/lift/absorb/mp or set status

                 boost dmg *or* lift status *or* absorb hp *or* absorb mp
                 10 08 04 02 01

                 set status
                 10 08 04 02 01
                */

                  const output = {};

                  if (data > 0x31) {
                    output.type = 'lift_reflect';
                  }
                  else if (data === 0x31) {
                    output.type = 'absorb_mp';
                  }
                  else if (data === 0x30) {
                    output.type = 'absorb_hp';
                  }
                  else if (data === 0x20) {
                    // Null
                  }
                  else if (data >= 0x20) {
                    output.type = 'boost_dmg';
                    output.data = data - 0x20;
                  }
                  else {
                    output.type = 'set_status';
                    output.data = statuses.status_enum.format(data);
                  }

                  return output;
                },
                parser: json => {
                  switch (json.type) {
                  case 'lift_reflect':
                    return 0x32;
                  case 'absorb_mp':
                    return 0x31;
                  case 'absorb_hp':
                    return 0x30;
                  case null:
                  case undefined:
                    return 0x20;
                  case 'boost_dmg':
                    return 0x20 | parseInt(json.data);
                  case 'set_status':
                    return statuses.status_enum.parse(json.data);
                  default:
                    throw new Error('Invalid special attack type');
                  }
                }
              })
            }, { 
              name: 'No Damage',
              mask: 0x40,
              type: new Bool()
            }, { 
              name: 'Cannot Miss',
              mask: 0x80,
              type: new Bool()
            }])
          }])
        })
      })
    }, {
      name: 'Special Attack Graphic',
      type: new Reader({
        offset: 0xCF37C0,
        type: new List({
          size: 384,
          type: new UInt()
        })
      })
    }, {
      name: 'Special Attack Name',
      type: new Reader({
        offset: 0xCFD0D0,
        type: new List({
          size: 384,
          type: new Text(10, name_table)
        })
      })
    }, {
      name: 'Rage',
      type: new Reader({
        offset: 0xCF4600,
        type: new List({
          size: 255,
          type: new List({
            size: 2,
            type: spell_enum
          })
        })
      })
    }, {
      name: 'Sketch',
      type: new Reader({
        offset: 0xCF4300,
        type: new List({
          size: 384,
          type: new List({
            size: 2,
            type: spell_enum
          })
        })
      })
    }, {
      name: 'Items',
      type: new Reader({
        offset: 0xCF3000,
        type: new List({
          size: 384,
          type: new Struct([{
            name: 'Rare Steal',
            type: item_enum
          }, {
            name: 'Common Steal',
            type: item_enum
          }, {
            name: 'Rare Drop',
            type: item_enum
          }, {
            name: 'Common Drop',
            type: item_enum
          }])
        })
      })
    }, {
      name: 'AI Script',
      type: new AIReader(fetch)
    }]);
  }
}

module.exports = Monsters;
