"use strict";

const {
  List,
  UInt,
  Struct,
  Bits,
  Text,
  TextLong,
  Reader,
  Enum,
  Fork,
  Fixed,
  Bool,
  Bitmask,
  ParallelList,
  Looker,
  PointerTable,
  JSONer
} = require('rom-builder').types;

const elements = require('./lib/elements');
const statuses = require('./lib/statuses');
const targeting = require('./lib/targeting');
const table = require('./lib/name_table');

/* Items */

class Items extends JSONer {
  constructor (fetch) {
    super();

    // TODO: Deduplicate this spell-name Enum from AI
    // const spell_scheme = ff6.get('spells');
    // const spells = spell_scheme.format(ff6.data.spells);
    // const spell_enum = new Enum(spells.map(spell => spell.Name));

    function get_item_data (type_name) {
      function template (options) {
        return options[type_name]
      }

      return new Struct([{
        name: 'Type',
        type: new Bits([{
          mask: 0x07,
          name: 'Item Type',
          type: new Enum([
            'Tool',
            'Weapon',
            'Armor',
            'Shield',
            'Hat',
            'Relic',
            'Item'
          ])
        }, {
          mask: 0x10,
          name: 'Throwable',
          type: new Bool()
        }, {
          mask: 0x20,
          name: 'Battle Use',
          type: new Bool()
        }, {
          mask: 0x40,
          name: 'Field Use',
          type: new Bool()
        }, {
          mask: 0x88,
          name: 'Unused',
          type: new Fixed(0x00)
        }])
      }, {
        name: 'Equippable',
        type: new Bitmask({
          flags: {
            0x0001: 'Terra',
            0x0002: 'Locke',
            0x0004: 'Cyan',
            0x0008: 'Shadow',
            0x0010: 'Edgar',
            0x0020: 'Sabin',
            0x0040: 'Celes',
            0x0080: 'Strago',
            0x0100: 'Relm',
            0x0200: 'Setzer',
            0x0400: 'Mog',
            0x0800: 'Gau',
            0x1000: 'Gogo',
            0x2000: 'Umaro',
            0xC000: 'UNUSED'
          }
        })
      }, {
        name: 'Spell Learnrate',
        type: new UInt()
      }, {
        name: 'Spell to Learn',
        type: new UInt() /*spell_enum*/
      }, {
        name: 'Field Effect',
        type: new UInt() // TODO: Should be bitmask -- check these
      }, {
        name: 'Status Protection (1)',
        type: statuses.status_1
      }, {
        name: 'Status Protection (2)',
        type: statuses.status_2
      }, {
        name: 'Innate Status-3',
        type: statuses.status_3
      }, {
        name: 'Effects-1',
        type: new Bitmask({
          flags: {
            0x01: 'Physical +25%',
            0x02: 'Magical +25%',
            0x04: 'HP +25%',
            0x08: 'HP +50%',
            0x10: 'HP +12.5%',
            0x20: 'MP +25%',
            0x40: 'MP +50%',
            0x80: 'MP +12.5%'
          }
        })
      }, {
        name: 'Effects-2',
        type: new Bitmask({
          flags: {
            0x01: 'Preemptive Up',
            0x02: 'No Back/Pincer',
            0x04: 'Fight -> Jump',
            0x08: 'Magic -> X-Magic',
            0x10: 'Runic -> Shock',
            0x20: 'Slot -> GP Rain',
            0x40: 'Steal -> Mug',
            0x80: 'Jump More'
          }
        })
      }, {
        name: 'Effects-3',
        type: new Bitmask({
          flags: {
            0x01: 'Steal Better',
            0x02: 'UNKNOWN',
            0x04: 'Sketch Better',
            0x08: 'Control Better',
            0x10: 'Always Hits',
            0x20: 'Halve MP Consumption',
            0x40: 'Set MP Consumption to 1',
            0x80: 'Raise Vigor' // ???
          }
        })
      }, {
        name: 'Effects-4',
        type: new Bitmask({
          flags: {
            0x01: 'Fight -> X-Fight',
            0x02: 'Counterattack',
            0x04: 'Randomly Evades', // ???
            0x08: 'Two-handed',
            0x10: 'Dual Wield',
            0x20: 'Equip anything',
            0x40: 'True Knight',
            0x80: 'Spellcast 50%'
          }
        })
      }, {
        name: 'Effects-5',
        type: new Bitmask({
          flags: {
            0x01: 'SOS Shell',
            0x02: 'SOS Safe',
            0x04: 'SOS Reflect',
            0x08: 'Exp x2',
            0x10: 'Gold x2',
            0x20: 'UNKNOWN 0x20',
            0x40: 'UNKNOWN 0x40',
            0x80: 'Undead'
          }
        })
      }, {
        name: 'Targeting',
        type: targeting
      }, {
        name: template({
          Item: 'Element (Unused)',
          Armor: 'Resist Element',
          Weapon: 'Element Attack'
        }),
        type: elements
      }, {
        name: 'Vigor/Speed',
        type: new Bits([{
          mask: 0x07,
          name: 'Vigor',
          type: new UInt()
        }, {
          mask: 0x08,
          name: 'Negative Vigor',
          type: new Bool()
        }, {
          mask: 0x70,
          name: 'Speed',
          type: new UInt()
        }, {
          mask: 0x80,
          name: 'Negative Speed',
          type: new Bool()
        }])
      }, {
        name: 'Heart/Magic',
        type: new Bits([{
          mask: 0x07,
          name: 'Heart',
          type: new UInt()
        }, {
          mask: 0x08,
          name: 'Negative Heart',
          type: new Bool()
        }, {
          mask: 0x70,
          name: 'Magic',
          type: new UInt()
        }, {
          mask: 0x80,
          name: 'Negative Magic',
          type: new Bool()
        }])
      }, {
        name: 'Weapon Spellcast',
        type: new Bits([{
          mask: 0x3F,
          name: 'Spell',
          type: new UInt() /*spell_enum*/
        }, {
          mask: 0x40,
          name: 'Randomly Casts',
          type: new Bool()
        }, {
          mask: 0x80,
          name: 'Remove from Inventory',
          type: new Bool()
        }])
      }, {
        name: 'Misc Flags',
        type: template({
          Weapon: new Bitmask({
            flags: {
              0x01: 'UNKNOWN-0x01',
              0x02: 'Allow Bushido',
              0x04: 'UNKNOWN-0x04',
              0x08: 'UNKNOWN-0x08',
              0x10: 'UNKNOWN-0x10',
              0x20: 'Ignores Row',
              0x40: 'Allow Two Handed',
              0x80: 'Allow Runic'
            }
          }),
          Item: new Bitmask({
            flags: {
              0x01: 'UNKNOWN-0x01',
              0x02: 'Dmg Undead',
              0x04: 'UNKNOWN-0x04',
              0x08: 'Affects HP',
              0x10: 'Affects MP',
              0x20: 'Lifts Status',
              0x40: 'UNKNOWN-0x40',
              0x80: 'Max Out'
            }
          }),
          Armor: new UInt()
        })
      }, {
        name: template({
          Weapon: 'Power',
          Item: 'Heal Power',
          Armor: 'Physical Defense'
        }),
        type: new UInt()
      }, template({
        Weapon: {
          name: 'Hit Rate',
          type: new UInt()
        },
        Item: {
          name: 'Status-1',
          type: statuses.status_1
        },
        Armor: {
          name: 'Magical Defense',
          type: new UInt()
        }
      }), template({
        Weapon: {
          name: 'Empty-1',
          type: new Fixed(0x00)
        },
        Item: {
          name: 'Status-2',
          type: statuses.status_2
        },
        Armor: {
          name: 'Absorb Elements',
          type: elements
        }
      }), template({
        Weapon: {
          name: 'Empty-2',
          type: new UInt()
        },
        Item: {
          name: 'Status-3',
          type: statuses.status_3
        },
        Armor: {
          name: 'Nullify Elements',
          type: elements
        }
      }), template({
        Weapon: {
          name: 'Empty-3',
          type: new Fixed(0x00)
        },
        Item: {
          name: 'Status-4',
          type: statuses.status_4
        },
        Armor: {
          name: 'Weak Elements',
          type: elements
        }
      }), {
        name: 'Innate Status-2',
        type: statuses.status_2
      }, {
        name: 'Evasion',
        type: new Bits([{
          mask: 0x0F,
          name: 'Physical Evade',
          type: new UInt()
        }, {
          mask: 0xF0,
          name: 'Magic Evade',
          type: new UInt()
        }])
      }, {
        name: 'Special Effect',
        type: new UInt()
      }, {
        name: 'Price',
        type: new UInt('word')
      }]);
    }

    const item_data = new List({
      size: 255,
      type: new Fork({
        control: new Looker((rom) => {
          return {
            0x00: 'Weapon',
            0x01: 'Weapon',
            0x02: 'Armor',
            0x03: 'Armor',
            0x04: 'Armor',
            0x05: 'Armor',
            0x06: 'Item'
          }[rom.read() & 0x07] || 'Weapon';
        }),
        map: {
          Weapon: { name: 'Weapon', type: get_item_data('Weapon') },
          Armor: { name: 'Armor', type: get_item_data('Armor') },
          Item: { name: 'Item', type: get_item_data('Item') }
        }
      })
    });

    this.type = new ParallelList([{
      name: 'Name',
      type: new Reader({
        offset: 0xD2B300,
        type: new List({
          size: 255,
          type: new Text(13, table)
        })
      })
    }, {
      name: 'Description',
      type: new Reader({
        offset: 0xED7AA0,
        type: new PointerTable({
          size: 0xFF,
          offset: 0xED6400,
          warn: 0xED77A0,
          type: new TextLong(table)
        })
      })
    }, {
      name: 'Data',
      type: new Reader({
        offset: 0xD85000,
        type: item_data
      })
    }]);
  }
}

module.exports = Items;
