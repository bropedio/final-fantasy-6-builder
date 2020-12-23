"use strict";

const {
  types,
  get_values
} = require('rom-builder');

const {
  Reader,
  Enum,
  UInt,
  List,
  Struct,
  Bits,
  Bool,
  Custom,
  ParallelList,
  JSONer
} = types;

/* Formations */

class Formations extends JSONer {
  constructor (fetch) {
    super();

    const monster_names = get_values(fetch('monsters'));
    const monster_enum = new Enum(monster_names, { 0x1FF: '-' });

    const formation_data = new Reader({
      offset: 0xCF5900,
      type: new List({
        size: 0x240,
        type: new Struct([{
          name: 'Flags',
          type: new Bits([{
            name: 'Appearance Effects',
            mask: 0x000F,
            type: new UInt()
          }, {
            name: 'Disable Normal',
            mask: 0x0010,
            type: new Bool()
          }, {
            name: 'Disable Back',
            mask: 0x0020,
            type: new Bool()
          }, {
            name: 'Disable Pincer',
            mask: 0x0040,
            type: new Bool()
          }, {
            name: 'Disable Side',
            mask: 0x0080,
            type: new Bool()
          }, {
            name: 'UNKNOWN-0x0100',
            mask: 0x0100,
            type: new Bool()
          }, {
            name: 'Disable Fanfare',
            mask: 0x0200,
            type: new Bool()
          }, {
            name: 'Allow Joker Doom',
            mask: 0x0400,
            type: new Bool()
          }, {
            name: 'Can Leap',
            mask: 0x0800,
            type: new Bool()
          }, {
            name: 'UNKNOWN-0x1000',
            mask: 0x1000,
            type: new Bool()
          }, {
            name: 'UNKNOWN-0x2000',
            mask: 0x2000,
            type: new Bool()
          }, {
            name: 'UNKNOWN-0x4000',
            mask: 0x4000,
            type: new Bool()
          }, {
            name: 'Enable Event Script',
            mask: 0x8000,
            type: new Bool()
          }])
        }, {
          name: 'Battle Event Script',
          type: new UInt()
        }, {
          name: 'Flags-2',
          type: new Bits([{
            name: 'No Escape',
            mask: 0x01,
            type: new Bool()
          }, {
            name: 'No Veldt',
            mask: 0x02,
            type: new Bool()
          }, {
            name: 'Show Attack Type?',
            mask: 0x04,
            type: new Bool()
          }, {
            name: 'Hide Start Messages',
            mask: 0x08,
            type: new Bool()
          }, {
            name: 'Battle Music',
            mask: 0x70,
            type: new UInt()
          }, {
            name: 'Continue Current Music',
            mask: 0x80,
            type: new Bool()
          }])
        }])
      })
    });

    const formation_enemies = new Reader({
      offset: 0xCF6200,
      type: new List({
        size: 0x240,
        type: new Custom({
          decoder: function (rom) {
            const data = this.type.decode(rom);
            const boss_mask = rom.read();

            for (let i = 1, mask = 0x01; i < 7; i++, mask <<= 1) {
              let prop = `Monster-${i} ID`;
              let boss = boss_mask & mask;

              if (boss) {
                data[prop] += 0x100;
              }
            }

            return data;
          },
          encoder: function (data, rom) {
            data = { ...data };
            var boss_mask = 0;

            for (let i = 1, bit = 1; i < 7; i++, bit <<= 1) {
              let prop = `Monster-${i} ID`;
              let id = data[prop];

              if (id & 0x100) {
                data[prop] = id & 0xFF;
                boss_mask |= bit;
              }
            }

            this.type.encode(data, rom);
            return rom.write(boss_mask);
          },
          type: new Struct([{
            name: 'VRAM Map',
            type: new UInt()
          }, {
            name: 'Monsters Present',
            type: new UInt()
          }, {
            name: 'Monster-1 ID',
            type: monster_enum
          }, {
            name: 'Monster-2 ID',
            type: monster_enum
          }, {
            name: 'Monster-3 ID',
            type: monster_enum
          }, {
            name: 'Monster-4 ID',
            type: monster_enum
          }, {
            name: 'Monster-5 ID',
            type: monster_enum
          }, {
            name: 'Monster-6 ID',
            type: monster_enum
          }, {
            name: 'Monster-1 XY',
            type: new UInt()
          }, {
            name: 'Monster-2 XY',
            type: new UInt()
          }, {
            name: 'Monster-3 XY',
            type: new UInt()
          }, {
            name: 'Monster-4 XY',
            type: new UInt()
          }, {
            name: 'Monster-5 XY',
            type: new UInt()
          }, {
            name: 'Monster-6 XY',
            type: new UInt()
          //}, {
            //name: 'MSB Indexes',
            //type: new UInt()
          }])
        })
      })
    });

    this.type = new ParallelList([{
      name: 'Enemies',
      type: formation_enemies
    }, {
      name: 'Data',
      type: formation_data
    }]);
  }
}

module.exports = Formations;
