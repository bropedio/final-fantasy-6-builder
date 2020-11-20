"use strict";

const {
  Reader,
  UInt,
  List,
  Struct,
  JSONer
} = require('rom-builder').types;

/* Formations */

class Formations extends JSONer {
  constructor (fetch) {
    super();

    this.type = new Reader({
      offset: 0xCF6200,
      type: new List({
        size: 0x240,
        type: new Struct([{
          name: 'VRAM Map',
          type: new UInt()
        }, {
          name: 'Monsters Present',
          type: new UInt()
        }, {
          name: 'Monster-1 ID',
          type: new UInt()
        }, {
          name: 'Monster-2 ID',
          type: new UInt()
        }, {
          name: 'Monster-3 ID',
          type: new UInt()
        }, {
          name: 'Monster-4 ID',
          type: new UInt()
        }, {
          name: 'Monster-5 ID',
          type: new UInt()
        }, {
          name: 'Monster-6 ID',
          type: new UInt()
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
        }, {
          name: 'MSB Indexes',
          type: new UInt()
        }])
      })
    });
  }
}

module.exports = Formations;
