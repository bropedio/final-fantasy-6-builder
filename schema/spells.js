"use strict";

const { types } = require('rom-builder');
const { statuses } = require('./lib/statuses');
const elements = require('./lib/elements');
const table = require('./lib/name_table');

/* Spells */

const spell_data = new types.List({
  size: 255,
  type: new types.Struct([{
    name: 'Targeting',
    type: new types.Bits([{
      mask: 0x10,
      name: 'Auto',
      type: new types.Enum(['Off', 'On'])
    }, {
      mask: 0xEF,
      name: 'Type',
      type: new types.Enum({
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
    type: new types.Bitmask({
      flags: [
        'Physical',
        'Instant Death',
        'Target Dead Only',
        'Reverse on Undead',
        'Randomize Target', 
        'Ignore Defense',
        'No Split Damage',
        'Abort on Allies'
      ]
    })
  }, {
    name: 'Flags-2',
    type: new types.Bitmask({
      flags: [
        'Usable on Field',
        'Unreflectable',
        'Learnable Lore',
        'Runicable',
        'Warps',
        'Retarget if Invalid',
        'Suicidal',
        'MP Damage'
      ]
    })
  }, {
    name: 'Flags-3',
    type: new types.Bitmask({
      flags: [
        'Heals',
        'Drains',
        'Lifts Status',
        'Toggles Status',
        'Stamina Evasion',
        'Cannot Miss',
        'Abort on Enemies',
        'Fractional Dmg'
      ]
    })
  }, {
    name: 'MP Cost',
    type: new types.UInt('byte', 10)
  }, {
    name: 'Power',
    type: new types.UInt('byte', 10)
  }, {
    name: 'Flags-4',
    type: new types.Bitmask({
      flags: [
        'Miss if Status Unchanged',
        'Show Msg',
        'Unused-0x04',
        'Unused-0x08',
        'Unused-0x10',
        'Unused-0x20',
        'Unused-0x40',
        'Unused-0x80'
      ]
    })
  }, {
    name: 'Hitrate',
    type: new types.UInt('byte', 10)
  }, {
    name: 'Special Effect',
    type: new types.UInt() // TODO: Name these
  }, {
    name: 'Status Effect(s)',
    type: statuses
  }])
});

module.exports = new types.File({
  name: 'Spells',
  extension: 'json',
  type: new types.ParallelList([{
    name: 'Name',
    type: new types.FlatStruct([{
      name: 'MagicNames',
      type: new types.Reader({
        offset: 0xE6F567,
        type: new types.List({
          size: 54,
          type: new types.Text(7, table)
        })
      })
    }, {
      name: 'EsperNames',
      type: new types.Reader({
        offset: 0xE6F6E1,
        type: new types.List({
          size: 27,
          type: new types.Text(8, table)
        })
      })
    }, {
      name: 'MiscSpellNames',
      type: new types.Reader({
        offset: 0xE6F7B9,
        type: new types.List({
          size: 4,
          type: new types.Text(10, table)
        })
      })
    }, {
      name: 'BushidoNames',
      type: new types.Reader({
        offset: 0xCF3C40,
        type: new types.List({
          size: 8,
          type: new types.Text(12, table)
        })
      })
    }, {
      // TODO Handle Reprisal, others?
      name: 'EnemySkillNames',
      type: new types.Reader({
        offset: 0xE6F831,
        type: new types.List({
          size: 162,
          type: new types.Text(10, table)
        })
      })
    }])
  }, {
    name: 'Description',
    type: new types.FlatStruct([{
      name: 'Magic',
      type: new types.Reader({
        offset: 0xD8CF80,
        type: new types.PointerTable({
          size: 54,
          offset: 0xD8C9A0,
          warn: 0xD8CEA0,
          type: new types.TextLong(table)
        })
      })
    }, {
      name: 'Espers',
      type: new types.Reader({
        offset: 0xCFFE40,
        type: new types.PointerTable({
          size: 27,
          offset: 0xCF3940,
          warn: 0xCF3C40,
          type: new types.TextLong(table)
        })
      })
    }, {
      name: 'MiscSpells',
      type: new types.List({
        size: 4,
        type: new types.Empty()
      })
    }, {
      name: 'Bushido',
      type: new types.Reader({
        offset: 0xCFFFAE,
        type: new types.PointerTable({
          size: 8,
          offset: 0xCFFD00,
          warn: 0xCFFE00,
          type: new types.TextLong(table)
        })
      })
    }, {
      name: 'Blitz',
      type: new types.Reader({
        offset: 0xCFFF9E,
        type: new types.PointerTable({
          size: 8,
          offset: 0xCFFC00,
          warn: 0xCFFD00,
          type: new types.TextLong(table)
        })
      })
    }, {
      name: 'DanceRageOther',
      type: new types.List({
        size: 38,
        type: new types.Empty()
      })
    }, {
      name: 'Lore',
      type: new types.Reader({
        offset: 0xED7A70,
        type: new types.PointerTable({
          size: 24,
          offset: 0xED77A0,
          warn: 0xED7A70,
          type: new types.TextLong(table)
        })
      })
    }])
  }, {
    name: 'Data',
    type: new types.Reader({
      offset: 0xC46AC0,
      type: spell_data
    })
  }])
});
