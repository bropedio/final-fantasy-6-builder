"use strict";

const { types } = require('rom-builder');
const elements = require('./lib/elements');
const statuses = require('./lib/statuses');
const targeting = require('./lib/targeting');
const table = require('./lib/name_table');

/* Items */

// TODO: Deduplicate this spell-name Enum from AI
// const spell_scheme = ff6.get('spells');
// const spells = spell_scheme.format(ff6.data.spells);
// const spell_enum = new types.Enum(spells.map(spell => spell.Name));

const evade_enum = new types.Enum([
  '0','+10','+20','+30','+40','+50','-10','-20','-30','-40','-50'
]);

function get_item_data (type_name) {
  function template (options) {
    return options[type_name]
  }

  return new types.Struct([{
    name: 'Type',
    type: new types.Bits([{
      mask: 0x07,
      name: 'Item Type',
      type: new types.Enum([
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
      type: new types.Bool()
    }, {
      mask: 0x20,
      name: 'Battle Use',
      type: new types.Bool()
    }, {
      mask: 0x40,
      name: 'Field Use',
      type: new types.Bool()
    }, {
      mask: 0x88,
      name: 'Unused',
      type: new types.Fixed(0x00)
    }])
  }, {
    name: 'Equippable',
    type: new types.Bitmask({
      flags: [
        'Terra',
        'Locke',
        'Cyan',
        'Shadow',
        'Edgar',
        'Sabin',
        'Celes',
        'Strago',
        'Relm',
        'Setzer',
        'Mog',
        'Gau',
        'Gogo',
        'Umaro',
        'Banon',
        'Leo'
      ]
    })
  }, {
    name: 'Spell Learnrate',
    type: new types.UInt()
  }, {
    name: 'Spell to Learn',
    type: new types.UInt() /*spell_enum*/
  }, {
    name: 'Field Effect',
    type: new types.UInt() // TODO: Should be bitmask -- check these
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
    type: new types.Bitmask({
      flags: [
        'Physical +25%',
        'Magical +25%',
        'HP +25%',
        'HP +50%',
        'HP +12.5%',
        'MP +25%',
        'MP +50%',
        'MP +12.5%'
      ]
    })
  }, {
    name: 'Effects-2',
    type: new types.Bitmask({
      flags: [
        'Preemptive Up',
        'No Back/Pincer',
        'Fight -> Jump',
        'Magic -> X-Magic',
        'Sketch -> Control',
        'Slot -> GP Rain',
        'Steal -> Mug',
        'Jump More'
      ]
    })
  }, {
    name: 'Effects-3',
    type: new types.Bitmask({
      flags: [
        'Steal Better',
        'UNKNOWN',
        'Sketch Better',
        'Control Better',
        'Always Hits',
        'Halve MP Consumption',
        'Set MP Consumption to 1',
        'Raise Vigor' // ???
      ]
    })
  }, {
    name: 'Effects-4',
    type: new types.Bitmask({
      flags: [
        'Fight -> X-Fight',
        'Counterattack',
        'Randomly Evades', // ???
        'Two-handed',
        'Dual Wield',
        'Equip anything',
        'True Knight',
        'Spellcast 50%'
      ]
    })
  }, {
    name: 'Effects-5',
    type: new types.Bitmask({
      flags: [
        'SOS Shell',
        'SOS Safe',
        'SOS Reflect',
        'Exp x2',
        'Gold x2',
        'UNKNOWN 0x20', // BNW Moogle Charm (Dance/Fall)
        'UNKNOWN 0x40',
        'Undead'
      ]
    })
  }, {
    name: 'Targeting',
    type: targeting
  }, {
    name: template({
      Item: 'Element Attack',
      Armor: 'Resist Element',
      Weapon: 'Element Attack'
    }),
    type: elements
  }, {
    name: 'Vigor/Speed',
    type: new types.Bits([{
      mask: 0x07,
      name: 'Vigor',
      type: new types.UInt()
    }, {
      mask: 0x08,
      name: 'Negative Vigor',
      type: new types.Bool()
    }, {
      mask: 0x70,
      name: 'Speed',
      type: new types.UInt()
    }, {
      mask: 0x80,
      name: 'Negative Speed',
      type: new types.Bool()
    }])
  }, {
    name: 'Heart/Magic',
    type: new types.Bits([{
      mask: 0x07,
      name: 'Heart',
      type: new types.UInt()
    }, {
      mask: 0x08,
      name: 'Negative Heart',
      type: new types.Bool()
    }, {
      mask: 0x70,
      name: 'Magic',
      type: new types.UInt()
    }, {
      mask: 0x80,
      name: 'Negative Magic',
      type: new types.Bool()
    }])
  }, {
    name: 'Weapon Spellcast',
    type: new types.Bits([{
      mask: 0x3F,
      name: 'Spell',
      type: new types.UInt() /*spell_enum*/
    }, {
      mask: 0x40,
      name: 'Randomly Casts',
      type: new types.Bool()
    }, {
      mask: 0x80,
      name: 'Remove from Inventory',
      type: new types.Bool()
    }])
  }, {
    name: 'Misc Flags',
    type: template({
      Weapon: new types.Bitmask({
        flags: [
          'UNKNOWN-0x01',
          'Allow Bushido',
          'UNKNOWN-0x04',
          'UNKNOWN-0x08',
          'UNKNOWN-0x10',
          'Ignores Row',
          'Allow Two Handed',
          'Allow Runic'
        ]
      }),
      Item: new types.Bitmask({
        flags: [
          'UNKNOWN-0x01',
          'Dmg Undead',
          'UNKNOWN-0x04',
          'Affects HP',
          'Affects MP',
          'Lifts Status',
          'UNKNOWN-0x40',
          'Fractional'
        ]
      }),
      Armor: new types.UInt()
    })
  }, {
    name: template({
      Weapon: 'Power',
      Item: 'Heal Power',
      Armor: 'Physical Defense'
    }),
    type: new types.UInt()
  }, template({
    Weapon: {
      name: 'Hit Rate',
      type: new types.UInt()
    },
    Item: {
      name: 'Status-1',
      type: statuses.status_1
    },
    Armor: {
      name: 'Magical Defense',
      type: new types.UInt()
    }
  }), template({
    Weapon: {
      name: 'Empty-1',
      type: new types.Enum({ 0x00: 'N/A', 0xFF: 'Null' })
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
      type: new types.UInt()
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
      type: new types.Enum({ 0x00: 'N/A', 0xFF: 'Null' })
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
    type: new types.Bits([{
      mask: 0x0F,
      name: 'Physical Evade',
      type: evade_enum
    }, {
      mask: 0xF0,
      name: 'Magic Evade',
      type: evade_enum
    }])
  }, template({
    Item: {
      name: 'Special Effect',
      type: new types.UInt()
    },
    Weapon: {
      name: 'Special and Evade',
      type: new types.Custom({
        formatter: function (data) {
          const formatted = this.type.format(data);
          if (!formatted['Evade Type'].length) {
            delete formatted['Evade Animation'];
          }
          return formatted;
        },
        parser: function (json) {
          if (!json['Evade Animation']) {
            json['Evade Animation'] = 'Knife';
          }
          return this.type.parse(json);
        },
        type: new types.Bits([{
          mask: 0xF0,
          name: 'Special Effect',
          type: new types.UInt()
        }, {
          mask: 0x0C,
          name: 'Evade Type',
          type: new types.Bitmask({
            flags: [
              'Physical',
              'Magical'
            ]
          })
        }, {
          mask: 0x03,
          name: 'Evade Animation',
          type: new types.Enum({
            0x00: 'Knife',
            0x01: 'Sword',
            0x02: 'Shield',
            0x03: 'Cape'
          })
        }])
      })
    },
    Armor: {
      name: 'Special Effect (unused?)',
      type: new types.UInt()
    }
  }), {
    name: 'Price',
    type: new types.UInt('word')
  }]);
}

module.exports = new types.File({
  name: 'Items',
  extension: 'yaml',
  index_key: '------------------------------------------------------ ID',
  type: new types.ParallelList([{
    name: 'Name',
    type: new types.Reader({
      offset: 0xD2B300,
      type: new types.List({
        size: 0x100,
        type: new types.Text(13, table)
      })
    })
  }, {
    name: 'Description',
    type: new types.Reader({
      offset: 0xED7AA0,
      type: new types.PointerTable({
        size: 0x100,
        offset: 0xED6400,
        warn: 0xED77A0,
        type: new types.TextLong(table)
      })
    })
  }, {
    name: 'Data',
    type: new types.Reader({
      offset: 0xD85000,
      type: new types.List({
        size: 0x100,
        type: new types.Fork({
          control: new types.Looker((rom) => {
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
      })
    })
  }])
});

