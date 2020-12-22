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
  Custom,
  JSONer
} = types;

/* Formations */

class Formations extends JSONer {
  constructor (fetch) {
    super();

    const monster_names = get_values(fetch('monsters'));
    const monster_enum = new Enum(monster_names, { 0x1FF: '-' });

    this.type = new Reader({
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
  }
}

module.exports = Formations;
