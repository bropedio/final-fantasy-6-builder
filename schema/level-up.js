"use strict";

const {
  JSONer,
  Struct,
  Reader,
  List,
  UInt
} = require('rom-builder').types;

/* Level Up Tables */

class LevelUp extends JSONer {
  constructor (fetch) {
    super();

    this.type = new Struct([{
      name: 'HP Gains',
      type: new Reader({
        offset: 0xE6F4A0,
        type: new List({
          size: 99,
          type: new UInt('byte', 10)
        })
      })
    }, {
      name: 'MP Gains',
      type: new Reader({
        offset: 0xE6F502,
        type: new List({
          size: 99,
          type: new UInt('byte', 10)
        })
      })
    }]);
  }
}

module.exports = LevelUp;
