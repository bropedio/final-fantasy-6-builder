"use strict";

const { types } = require('rom-builder');
const SplitList = require('./split_list');

/* TileData */

module.exports = new types.Reader({
  offset: 0xC40000,
  warn: 0xC41A10,
  type: new SplitList({
    size: 0x1A0,
    chunk_size: 5,
    offset: 0x1A0 * 2 + 2,
    type: new types.Struct([{
      name: 'X Coord',
      type: new types.UInt()
    }, { 
      name: 'Y Coord',
      type: new types.UInt()
    }, {
      name: 'Event',
      type: new types.UInt('sword')
    }])
  })
});
