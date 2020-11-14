"use strict";

const {
  Empty,
  UInt,
  Enum,
  Fixed,
  Bits,
  List,
  Struct,
  Fork,
  PointerTable,
  Reader,
  Bitmask,
  Closure,
  Rewind
} = require('rom-builder').types;

/* Extra Type Definitions */

const element_enum = require('./elements');

const target_enum = new Enum(
  range(0x30, 6, i => `Enemy #${i - 1}`),
  {
    0x00: 'Terra',
    0x01: 'Locke',
    0x02: 'Cyan',
    0x03: 'Shadow',
    0x04: 'Edgar',
    0x05: 'Sabin',
    0x06: 'Celes',
    0x07: 'Strago',
    0x08: 'Setzer',
    0x09: 'Relm',
    0x0A: 'Mog',
    0x0B: 'Gau',
    0x0C: 'Gogo',
    0x0D: 'Umaro',
    0x0E: 'Banon',
    0x0F: 'Leo'
  }, {
    0x2B: '[Unknown]',
    0x36: 'Self',
    0x37: 'All enemies but self',
    0x38: 'All enemies',
    0x39: 'Random enemies but self',
    0x3A: 'Random enemies',
    0x43: 'All characters',
    0x44: 'Random character',
    0x45: 'Last char/enemy to act',
    0x46: 'All',
    0x47: 'Default targeting',
    0x48: 'Character #1',
    0x49: 'Character #2',
    0x4A: 'Character #3',
    0x4B: 'Character #4',
    0x4C: 'All or one random target'
  }
);

const status_enum = new Enum({
  0x00: 'Dark',
  0x01: 'Zombie',
  0x02: 'Poison',
  0x04: 'Clear',
  0x05: 'Imp',
  0x06: 'Petrify',
  0x07: 'Death',
  0x08: 'Condemned',
  0x09: 'Near Fatal',
  0x0A: 'Image',
  0x0B: 'Mute',
  0x0C: 'Bserk',
  0x0D: 'Muddle',
  0x0E: 'Sap',
  0x0F: 'Sleep',
  0x10: 'Dance',
  0x11: 'Regen',
  0x12: 'Slow',
  0x13: 'Haste',
  0x14: 'Stop',
  0x15: 'Shell',
  0x16: 'Safe',
  0x17: 'Rflect',
  0x18: 'Rage',
  0x19: 'Freeze',
  0x1A: 'Rerise',
  0x1B: 'Morph',
  0x1E: 'Dog Block',
  0x1F: 'Float'
});

const command_enum = new Enum({
  0x00: 'Fight',
  0x01: 'Item',
  0x02: 'Magic',
  0x05: 'Steal',
  0x06: 'Mug',
  0x07: 'Bushido',
  0x08: 'Throw',
  0x09: 'Tools',
  0x0A: 'Blitz',
  0x0C: 'Lore',
  0x0D: 'Sketch',
  0x0F: 'Slot',
  0x10: 'Rage',
  0x12: 'Mimic',
  0x13: 'Dance',
  0x16: 'Jump',
  0x17: 'X-Magic',
  0x18: 'GP Rain',
  0x19: 'Summon',
  0x1A: 'Health',
  0x1B: 'Shock',
  0x1D: 'Magitek'
});

const enemy_bitmask = new Bitmask({
  off_state: 'Self',
  flags: {
    0x01: 'Enemy 0',
    0x02: 'Enemy 1',
    0x04: 'Enemy 2',
    0x08: 'Enemy 3',
    0x10: 'Enemy 4',
    0x20: 'Enemy 5',
    0x40: 'Enemy 6 (n/a)',
    0x80: 'Enemy 7 (n/a)'
  }
});

/* AI */

class AIReader extends Closure {
  constructor (fetch) {
    super();

    // TODO for spell list: 0xFE means "do nothing" for this op code
    // const spell_scheme = ff6.get('spells');
    // const spells = spell_scheme.type.format(ff6.data.spells);
    // const spell_enum = new Enum(spells.map(spell => spell.Name));

    // const item_scheme = ff6.get('items');
    // const items = item_scheme.type.format(ff6.data.items);
    // const item_enum = new Enum(items.map(item => item.Name));

    const ai_script = new List({
      size: data => (data[data.length - 1] || {}).id === 0xFF,
      type: new Fork({
        control: new UInt(),
        map: {
          default: {
            name: 'Use Spell',
            type: new Rewind({
              steps: 1,
              type: new UInt() /*spell_enum*/
            })
          },
          0xF0: {
            name: 'Use Random Spell',
            type: new List({ size: 3, type: new UInt() /*spell_enum*/ })
          },
          0xF1: {
            name: 'Target',
            type: target_enum
          },
          0xF2: {
            name: 'Call Formation',
            type: new List({ size: 3, type: new UInt() })
          },
          0xF3: {
            name: 'Small Caption',
            type: new List({ size: 2, type: new UInt() })
          },
          0xF4: {
            name: 'Use Random Command',
            type: new List({ size: 3, type: command_enum })
          },
          0xF5: {
            name: 'Add/Remove',
            type: new Struct([{
              name: 'AnimationID',
              type: new UInt()
            }, {
              name: 'Mode',
              type: new Enum([
                'Unhide w/ max HP',
                'Remove (preserve HP)',
                'Unhide w/ current HP',
                'Hide',
                'Hide [dup]',
                'Kill'
              ])
            }, {
              name: 'Targets',
              type: enemy_bitmask
            }])
          },
          0xF6: {
            name: 'Throw/Use Item',
            type: new Struct([
              { name: 'Mode', type: new Enum(['Use', 'Throw']) },
              { name: 'Common (2/3)', type: new UInt() /*item_enum*/ },
              { name: 'Rare (1/3)', type: new UInt() /*item_enum*/ }
            ])
          },
          0xF7: {
            name: 'Trigger Event',
            type: new UInt()
          },
          0xF8: {
            name: 'Variable Math',
            type: new Struct([{
              name: 'Variable ID',
              type: new UInt()
            }, {
              name: 'Math',
              type: new Bits([{
                mask: 0xC0,
                name: 'Operator',
                type: new Enum(['Set', 'Set [dup]', 'Add', 'Subtract'])
              }, {
                mask: 0x3F,
                name: 'Operand',
                type: new UInt()
              }])
            }])
          },
          0xF9: {
            name: 'Variable Bit',
            type: new Struct([
              { name: 'Operation', type: new Enum(['Toggle', 'Set', 'Unset']) },
              { name: 'VariableID', type: new UInt() },
              { name: 'BitID', type: new UInt() }
            ])
          },
          0xFA: {
            name: 'Animation',
            type: new Struct([{
              name: 'AnimationID',
              type: new Enum([
                'Enemy flashes red',
                'Enemy steps back (slow)',
                'Enemy steps forward (slow)',
                'Enemy steps back (fast)',
                'Enemy steps forward (fast)',
                'Characters run to right',
                'Characters run to left',
                'Enemy steps back 3',
                'Enemy steps forward 3',
                'Play sound',
                'Kefka head',
                'Enemy flashes yellow',
                'Enemy flashes yellow briefly',
                'Boss death animation'
              ])
            }, {
              name: 'Arg2',
              type: new UInt()
            }, {
              name: 'Arg3',
              type: new UInt()
            }])
          },
          0xFB: {
            name: 'Miscellaneous',
            type: new Fork({
              control: new UInt(),
              map: {
                0x00: {
                  name: 'Reset battle timer',
                  type: new Fixed(0x00)
                },
                0x01: {
                  name: 'Target becomes invincible',
                  type: target_enum
                },
                0x02: {
                  name: 'End battle',
                  type: new Fixed(0x00)
                },
                0x03: {
                  name: 'Add Gau to party',
                  type: new Fixed(0x00)
                },
                0x04: {
                  name: 'Reset global timer',
                  type: new Fixed(0x00)
                },
                0x05: {
                  name: 'Target loses invincibility',
                  type: target_enum
                },
                0x06: {
                  name: 'Target becomes targetable',
                  type: target_enum
                },
                0x07: {
                  name: 'Target becomes untargetable',
                  type: target_enum
                },
                0x08: {
                  name: 'Unknown',
                  type: new UInt()
                },
                0x09: {
                  name: 'Unknown',
                  type: new UInt()
                },
                0x0A: {
                  name: 'Unknown',
                  type: new UInt()
                },
                0x0B: {
                  name: 'Self gains status',
                  type: status_enum
                },
                0x0C: {
                  name: 'Self loses status',
                  type: status_enum
                },
                0x0D: {
                  name: 'Piranha death',
                  type: new Fixed(0x00)
                }
              }
            })
          },
          0xFC: {
            name: 'Conditional',
            type: new Fork({
              control: new UInt(),
              map: {
                0x00: {
                  // Null
                },
                0x01: {
                  name: 'Hit by command',
                  type: new List({ size: 2, type: command_enum })
                },
                0x02: {
                  name: 'Hit by spell',
                  type: new List({ size: 2, type: new UInt() /*spell_enum*/ }) 
                },
                0x03: {
                  name: 'Hit by item',
                  type: new List({ size: 2, type: new UInt() /*item_enum*/ })
                },
                0x04: {
                  name: 'Hit by element',
                  type: new Struct([
                    { name: 'Elements', type: element_enum },
                    { name: 'Arg2', type: new Fixed(0x00) }
                  ])
                },
                0x05: {
                  name: 'Hit at all',
                  type: new Struct([
                    { name: 'Unused', type: new Fixed(0x00) },
                    { name: 'Hit Type', type: new Enum(['Any', 'Melee', 'MP Dmg']) } 
                  ])
                },
                0x06: {
                  name: 'Target HP < {x}',
                  type: new Struct([
                    { name: 'Target', type: target_enum },
                    { name: 'HP / 128', type: new UInt() }
                  ])
                },
                0x07: {
                  name: 'Target MP < {x}',
                  type: new Struct([
                    { name: 'Target', type: target_enum },
                    { name: 'MP', type: new UInt() }
                  ])
                },
                0x08: {
                  name: 'Target has status',
                  type: new Struct([
                    { name: 'Target', type: target_enum },
                    { name: 'Status', type: status_enum }
                  ])
                },
                0x09: {
                  name: 'Target lacks status',
                  type: new Struct([
                    { name: 'Target', type: target_enum },
                    { name: 'Status', type: status_enum }
                  ])
                },
                0x0A: {
                  // Null
                },
                0x0B: {
                  name: 'Battle timer > {x}',
                  type: new Struct([
                    { name: 'Timer', type: new UInt() },
                    { name: 'Arg2', type: new Fixed(0x00) }
                  ])
                },
                0x0C: {
                  name: 'Variable < {x}',
                  type: new Struct([
                    { name: 'VariableID', type: new UInt() },
                    { name: 'Value', type: new UInt() }
                  ])
                },
                0x0D: {
                  name: 'Variable >= {x}',
                  type: new Struct([
                    { name: 'VariableID', type: new UInt() },
                    { name: 'Value', type: new UInt() }
                  ])
                },
                0x0E: {
                  name: 'Target level < {x}',
                  type: new Struct([
                    { name: 'Target', type: target_enum },
                    { name: 'Level', type: new UInt() }
                  ])
                },
                0x0F: {
                  name: 'Target level >= {x}',
                  type: new Struct([
                    { name: 'Target', type: target_enum },
                    { name: 'Level', type: new UInt() }
                  ])
                },
                0x10: {
                  name: 'Only one enemy type alive',
                  type: new List({ size: 2, type: new Fixed(0x00) })
                },
                0x11: {
                  name: 'Enemies are alive',
                  type: new Struct([
                    { name: 'Enemies', type: enemy_bitmask },
                    { name: 'Arg2', type: new Fixed(0x00) }
                  ])
                },
                0x12: {
                  name: 'Enemies are dead',
                  type: new Struct([
                    { name: 'Enemies', type: enemy_bitmask },
                    { name: 'Arg2', type: new Fixed(0x00) }
                  ])
                },
                0x13: {
                  name: 'Entities alive <= {X}',
                  type: new Struct([
                    { name: 'Side', type: new Enum(['Allies', 'Enemies']) },
                    { name: 'X', type: new UInt() }
                  ])
                },
                0x14: {
                  name: 'Bit is set',
                  type: new Struct([
                    { name: 'VariableID', type: new UInt() },
                    { name: 'Bit', type: new UInt() }
                  ])
                },
                0x15: {
                  name: 'Bit is unset',
                  type: new Struct([
                    { name: 'VariableID', type: new UInt() },
                    { name: 'Bit', type: new UInt() }
                  ])
                },
                0x16: {
                  name: 'Global battle timer > {x}',
                  type: new Struct([
                    { name: 'X', type: new UInt() },
                    { name: 'Arg2', type: new Fixed(0x00) }
                  ])
                },
                0x17: {
                  name: 'Target is valid',
                  type: new Struct([
                    { name: 'Target', type: target_enum },
                    { name: 'Arg2', type: new Fixed(0x00) }
                  ])
                },
                0x18: {
                  name: 'Gau not in party',
                  type: new List({ size: 2, type: new Fixed(0x00) })
                },
                0x19: {
                  name: 'Enemy in position',
                  type: new Struct([
                    { name: 'Enemies', type: enemy_bitmask },
                    { name: 'Arg2', type: new Fixed(0x00) }
                  ])
                },
                0x1A: {
                  name: 'Target is weak to element',
                  type: new Struct([
                    { name: 'Target', type: target_enum },
                    { name: 'Element', type: element_enum }
                  ])
                },
                0x1B: {
                  name: 'Battle formation = {X}',
                  type: new UInt('word')
                },
                0xB5: {
                  name: 'Unknown 0xB5',
                  type: new UInt('word')
                },
                0x80: {
                  name: 'Unknown 0x80',
                  type: new UInt('word')
                }
              }
            })
          },
          0xFD: {
            name: 'Wait One Turn',
            type: new Empty()
          },
          0xFE: {
            name: 'End Conditional',
            type: new Empty()
          },
          0xFF: {
            name: 'End Script',
            type: new Empty()
          }
        }
      })
    });

    this.type = new Reader({
      offset: 0xCF8400,
      warn: 0xCFC050,
      type: new PointerTable({
        size: 383,
        offset: 0xCF8700,
        warn: 0xCFC050,
        type: new Struct([{
          name: 'MainScript',
          type: ai_script
        }, {
          name: 'ReactiveScript',
          type: ai_script
        }])
      })
    });
  }
}

/* Miscellaneous Helpers */

function range (start, length, format) {
  const result = {}; 
  for (let i = 0; i < length; i++) {
    result[start + i] = format(i);
  }
  return result;
}

/* Exports */

module.exports = AIReader;

