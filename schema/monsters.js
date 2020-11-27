"use strict";

const {
  Text,
  List,
  Reader,
  ParallelList,
  JSONer
} = require('rom-builder').types;

const AIReader = require('./lib/ai');
const name_table = require('./lib/name_table');
const statuses = require('./lib/statuses');

/* Monsters */

class Monsters extends JSONer {
  constructor (fetch) {
    super();

    this.type = new ParallelList([{
      name: 'Name',
      type: new Reader({
        offset: 0xCFC050,
        type: new List({
          size: 383,
          type: new Text(10, name_table)
        })
      })
    }, {
      name: 'Stats',
      type: new Reader({
        offset: 0xCF0000,
        type: new List({
          size: 383,
          type: new Struct([{
            name: 'Speed',
            type: new UInt()
          }, {
            name: 'Vigor',
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
              name: 'Attack Definition',
              mask: 0x3F,
              type: new UInt()
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
      name: 'AI Script',
      type: new AIReader(fetch)
    }]);
  }
}

module.exports = Monsters;
