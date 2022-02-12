"use strict";

const { types } = require('rom-builder');
const AIReader = require('./lib/ai');
const name_table = require('./lib/name_table');
const statuses = require('./lib/statuses');
const elements = require('./lib/elements');

/* Monsters */

const spell_enum = new types.RefEnum({
  ref: 'spells',
  path: ['Name'],
  inject: { 0xFF: '-' }
});

const item_enum = new types.RefEnum({
  ref: 'items',
  path: ['Name']
});

module.exports = new types.File({
  name: 'Monsters',
  extension: 'json',
  type: new types.ParallelList([{
    name: 'Name',
    type: new types.Reader({
      offset: 0xCFC050,
      type: new types.List({
        size: 384,
        type: new types.Text(10, name_table)
      })
    })
  }, {
    name: 'Stats',
    type: new types.Reader({
      offset: 0xCF0000,
      type: new types.List({
        size: 384,
        type: new types.Struct([{
          name: 'Speed',
          type: new types.UInt('byte', 10)
        }, {
          name: 'Attack',
          type: new types.UInt('byte', 10)
        }, {
          name: 'Hit Rate',
          type: new types.UInt('byte', 10)
        }, {
          name: 'Evasion',
          type: new types.UInt('byte', 10)
        }, {
          name: 'Magic Evasion',
          type: new types.UInt('byte', 10)
        }, {
          name: 'Defense',
          type: new types.UInt('byte', 10)
        }, {
          name: 'Magic Defense',
          type: new types.UInt('byte', 10)
        }, {
          name: 'Magic Power',
          type: new types.UInt('byte', 10)
        }, {
          name: 'HP',
          type: new types.UInt('word', 10)
        }, {
          name: 'MP',
          type: new types.UInt('word', 10)
        }, {
          name: 'Experience',
          type: new types.UInt('word', 10)
        }, {
          name: 'Gold',
          type: new types.UInt('word', 10)
        }, {
          name: 'Level',
          type: new types.UInt('byte', 10)
        }, {
          name: 'Ragnarok Data',
          type: new types.UInt()
        }, {
          name: 'Flags-1',
          type: new types.Bitmask({
            flags: [
              'Dies at 0 MP',
              'UNKNOWN 0x02',
              'No Name',
              'UNKNOWN 0x08',
              'Humanoid',
              'UNKNOWN 0x20',
              'Boss',
              'Undead'
            ]
          })
        }, {
          name: 'Flags-2',
          type: new types.Bitmask({
            flags: [
              'Hard to Run',
              'Attack First',
              'Fractional Immune', // BNW (Suplex Immunity)
              'Cannot Run',
              'Cannot Scan',
              'Cannot Sketch',
              'Special Event',
              'Cannot Control'
            ]
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
          type: new types.UInt()
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
          type: new types.Bitmask({
            flags: [
              'True Knight',
              'Runic',
              'Rerise',
              'UNKNOWN 0x08',
              'UNKNOWN 0x10',
              'UNKNOWN 0x20',
              'UNKNOWN 0x40',
              'Removeable Float'
            ]
          })
        }, {
          name: 'Special Attack',
          type: new types.Bits([{
            name: 'Added Effect',
            mask: 0x3F,
            type: new types.Custom({
              type: new types.UInt(),
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
                else if (data >= 0x20) {
                  output.type = 'boost_dmg';
                  output.data = `+${(data - 0x20 + 1)*50}%`;
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
                  return 0x20 | (parseInt(json.data.slice(1, -1))/50 - 1);
                case 'set_status':
                  return statuses.status_enum.parse(json.data);
                default:
                  throw new types.Error('Invalid special attack type');
                }
              }
            })
          }, { 
            name: 'No Damage',
            mask: 0x40,
            type: new types.Bool()
          }, { 
            name: 'Cannot Miss',
            mask: 0x80,
            type: new types.Bool()
          }])
        }])
      })
    })
  }, {
    name: 'Special Attack Graphic',
    type: new types.Reader({
      offset: 0xCF37C0,
      type: new types.List({
        size: 384,
        type: new types.UInt()
      })
    })
  }, {
    name: 'Special Attack Name',
    type: new types.Reader({
      offset: 0xCFD0D0,
      type: new types.List({
        size: 384,
        type: new types.Text(10, name_table)
      })
    })
  }, {
    name: 'Rage',
    type: new types.Reader({
      offset: 0xCF4600,
      type: new types.List({
        size: 255,
        type: new types.List({
          size: 2,
          type: spell_enum
        })
      })
    })
  }, {
    name: 'Sketch',
    type: new types.Reader({
      offset: 0xCF4300,
      type: new types.List({
        size: 384,
        type: new types.List({
          size: 2,
          type: spell_enum
        })
      })
    })
  }, {
    name: 'Items',
    type: new types.Reader({
      offset: 0xCF3000,
      type: new types.List({
        size: 384,
        type: new types.Struct([{
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
    type: AIReader
  }])
});
