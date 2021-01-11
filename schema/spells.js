"use strict";

const {
  Empty,
  List,
  UInt,
  Struct,
  FlatStruct,
  Bits,
  Text,
  TextLong,
  Reader,
  Enum,
  Bitmask,
  ParallelList,
  JSONer,
  PointerTable
} = require('rom-builder').types;

const elements = require('./lib/elements');
const statuses = require('./lib/statuses').all_statuses;
const table = require('./lib/name_table');

/* Spells */

class Spells extends JSONer {
  constructor (fetch) {
    super();

    const spell_data = new List({
      size: 255,
      type: new Struct([{
        name: 'Targeting',
        type: new Bits([{
          mask: 0x10,
          name: 'Auto',
          type: new Enum(['Off', 'On'])
        }, {
          mask: 0xEF,
          name: 'Type',
          type: new Enum({
            0x00: 'Empty',
            0x61: 'Spread Hurt',
            0x63: 'Spread Foes',
            0x41: 'Hurt One',
            0x43: 'One Foe',
            0x04: 'Everyone',
            0x6A: 'Foe Group',
            0x6E: 'All Foes',
            0x03: 'One Ally',
            0x2A: 'Ally Group',
            0x01: 'Help One',
            0x2E: 'All Allies',
            0x21: 'Spread Help',
            0x29: '0x29',
            0x02: 'Self',
            0x69: '0x69',
            0x6B: '0x6B',
            0xC0: '0xC0'
          })
        }])
      }, {
        name: 'Element',
        type: elements
      }, {
        name: 'Flags-1',
        type: new Bitmask({
          flags: {
            0x01: 'Physical',
            0x02: 'Instant Death',
            0x04: 'Target Dead Only',
            0x08: 'Reverse on Undead',
            0x10: 'Randomize Target', 
            0x20: 'Ignore Defense',
            0x40: 'No Split Damage',
            0x80: 'Abort on Allies'
          }
        })
      }, {
        name: 'Flags-2',
        type: new Bitmask({
          flags: {
            0x01: 'Usable on Field',
            0x02: 'Unreflectable',
            0x04: 'Learnable Lore',
            0x08: 'Runicable',
            0x10: 'Warps',
            0x20: 'Retarget if Invalid',
            0x40: 'Suicidal',
            0x80: 'MP Damage'
          }
        })
      }, {
        name: 'Flags-3',
        type: new Bitmask({
          flags: {
            0x01: 'Heals',
            0x02: 'Drains',
            0x04: 'Lifts Status',
            0x08: 'Toggles Status',
            0x10: 'Stamina Evasion',
            0x20: 'Cannot Miss',
            0x40: 'Abort on Enemies',
            0x80: 'Fractional Dmg'
          }
        })
      }, {
        name: 'MP Cost',
        type: new UInt()
      }, {
        name: 'Power',
        type: new UInt()
      }, {
        name: 'Flags-4',
        type: new Bitmask({
          flags: {
            0x01: 'Miss if Status Unchanged',
            0x02: 'Show Msg',
            0x04: 'Stamina Damage', // BNW
            0x08: 'Respect Gauntlet/Genji', // BNW
            0x10: 'Respect Row', // BNW
            0x20: 'No Critical Dmg' // BNW
          }
        })
      }, {
        name: 'Hitrate',
        type: new UInt()
      }, {
        name: 'Special Effect',
        type: new UInt() // TODO: Name these
      }, {
        name: 'Status Effect(s)',
        type: statuses
      }])

    });

    this.type = new ParallelList([{
      name: 'Name',
      type: new FlatStruct([{
        name: 'MagicNames',
        type: new Reader({
          offset: 0xE6F567,
          type: new List({
            size: 54,
            type: new Text(7, table)
          })
        })
      }, {
        name: 'EsperNames',
        type: new Reader({
          offset: 0xE6F6E1,
          type: new List({
            size: 27,
            type: new Text(8, table)
          })
        })
      }, {
        name: 'MiscSpellNames',
        type: new Reader({
          offset: 0xE6F7B9,
          type: new List({
            size: 4,
            type: new Text(10, table)
          })
        })
      }, {
        name: 'BushidoNames',
        type: new Reader({
          offset: 0xCF3C40,
          type: new List({
            size: 8,
            type: new Text(12, table)
          })
        })
      }, {
        // TODO Handle Reprisal, others?
        name: 'EnemySkillNames',
        type: new Reader({
          offset: 0xE6F831,
          type: new List({
            size: 162,
            type: new Text(10, table)
          })
        })
      }])
    }, {
      name: 'Description',
      type: new FlatStruct([{
        name: 'Magic',
        type: new Reader({
          offset: 0xD8CF80,
          type: new PointerTable({
            size: 54,
            offset: 0xD8C9A0,
            warn: 0xD8CEA0,
            type: new TextLong(table)
          })
        })
      }, {
        name: 'Espers',
        type: new Reader({
          offset: 0xCFFE40,
          type: new PointerTable({
            size: 27,
            offset: 0xCF3940,
            warn: 0xCF3C40,
            type: new TextLong(table)
          })
        })
      }, {
        name: 'MiscSpells',
        type: new List({
          size: 4,
          type: new Empty()
        })
      }, {
        name: 'Bushido',
        type: new Reader({
          offset: 0xCFFFAE,
          type: new PointerTable({
            size: 8,
            offset: 0xCFFD00,
            warn: 0xCFFE00,
            type: new TextLong(table)
          })
        })
      }, {
        name: 'Blitz',
        type: new Reader({
          offset: 0xCFFF9E,
          type: new PointerTable({
            size: 8,
            offset: 0xCFFC00,
            warn: 0xCFFD00,
            type: new TextLong(table)
          })
        })
      }, {
        name: 'DanceRageOther',
        type: new List({
          size: 38,
          type: new Empty()
        })
      }, {
        name: 'Lore',
        type: new Reader({
          offset: 0xED7A70,
          type: new PointerTable({
            size: 12, // space for 24?
            offset: 0xED77A0,
            warn: 0xED7A70,
            type: new TextLong(table)
          })
        })
      }])
    }, {
      name: 'Data',
      type: new Reader({
        offset: 0xC46AC0,
        type: spell_data
      })
    }]);
  }
}

module.exports = Spells;
