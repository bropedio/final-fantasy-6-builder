"use strict";

const {
  Closure,
  Reader
} = require('rom-builder').types;

const SplitList = require('./split_list');

/* TileData */

class TileData extends Closure {
  constructor (fetch) {
    super();

    this.type = new Reader({
      offset: 0xC40000,
      warn: 0xC41A10,
      type: new SplitList({
        size: 0x1A0,
        chunk_size: 5,
        offset: 0x1A0 * 2 + 2,
        type: new Struct([{
          name: 'X Coord',
          type: new UInt()
        }, { 
          name: 'Y Coord',
          type: new UInt()
        }, {
          name: 'Event',
          type: new UInt('sword')
        }])
      })
    }):
  }
}

module.exports = TileData;
