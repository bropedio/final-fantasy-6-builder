"use strict";

const { types } = require('rom-builder');

/* Formations */

const monster_enum = new types.RefEnum({
  ref: 'monsters',
  path: ['Name'],
  inject: { 0x1FF: '-' }
});

module.exports = new types.File({
  name: 'Formations',
  extension: 'json',
  type: new types.ParallelList([{
    name: 'Enemies',
    type: new types.Reader({
      offset: 0xCF6200,
      type: new types.List({
        size: 0x240,
        type: new types.Custom({
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
          type: new types.Struct([{
            name: 'VRAM Map',
            type: new types.UInt()
          }, {
            name: 'Monsters Present',
            type: new types.UInt()
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
            type: new types.UInt()
          }, {
            name: 'Monster-2 XY',
            type: new types.UInt()
          }, {
            name: 'Monster-3 XY',
            type: new types.UInt()
          }, {
            name: 'Monster-4 XY',
            type: new types.UInt()
          }, {
            name: 'Monster-5 XY',
            type: new types.UInt()
          }, {
            name: 'Monster-6 XY',
            type: new types.UInt()
          //}, {
            //name: 'MSB Indexes',
            //type: new types.UInt()
          }])
        })
      })
    })
  }, {
    name: 'Magic Points',
    type: new types.Reader({
      offset: 0xDFB400,
      type: new types.List({
        size: 0x200,
        type: new types.UInt('byte', 10)
      })
    })
  }, {
    name: 'Data',
    type: new types.Reader({
      offset: 0xCF5900,
      type: new types.List({
        size: 0x240,
        type: new types.Struct([{
          name: 'Flags',
          type: new types.Bits([{
            name: 'Appearance Effects',
            mask: 0x000F,
            type: new types.UInt()
          }, {
            name: 'Disable Normal',
            mask: 0x0010,
            type: new types.Bool()
          }, {
            name: 'Disable Back',
            mask: 0x0020,
            type: new types.Bool()
          }, {
            name: 'Disable Pincer',
            mask: 0x0040,
            type: new types.Bool()
          }, {
            name: 'Disable Side',
            mask: 0x0080,
            type: new types.Bool()
          }, {
            name: 'UNKNOWN-0x0100',
            mask: 0x0100,
            type: new types.Bool()
          }, {
            name: 'Disable Fanfare',
            mask: 0x0200,
            type: new types.Bool()
          }, {
            name: 'Allow Joker Doom',
            mask: 0x0400,
            type: new types.Bool()
          }, {
            name: 'Can Leap',
            mask: 0x0800,
            type: new types.Bool()
          }, {
            name: 'UNKNOWN-0x1000',
            mask: 0x1000,
            type: new types.Bool()
          }, {
            name: 'UNKNOWN-0x2000',
            mask: 0x2000,
            type: new types.Bool()
          }, {
            name: 'UNKNOWN-0x4000',
            mask: 0x4000,
            type: new types.Bool()
          }, {
            name: 'Enable Event Script',
            mask: 0x8000,
            type: new types.Bool()
          }])
        }, {
          name: 'Battle Event Script',
          type: new types.UInt()
        }, {
          name: 'Flags-2',
          type: new types.Bits([{
            name: 'No Escape',
            mask: 0x01,
            type: new types.Bool()
          }, {
            name: 'No Veldt',
            mask: 0x02,
            type: new types.Bool()
          }, {
            name: 'Hide Start Messages',
            mask: 0x04,
            type: new types.Bool()
          }, {
            name: 'Battle Music',
            mask: 0x38,
            type: new types.UInt()
          }, {
            name: 'UNKNOWN 0x40',
            mask: 0x40,
            type: new types.Bool()
          }, {
            name: 'Continue Current Music',
            mask: 0x80,
            type: new types.Bool()
          }])
        }])
      })
    })
  }])
});
