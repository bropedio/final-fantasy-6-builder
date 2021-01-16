"use strict";

const {
  Reader,
  Tile,
  List,
  Closure,
  JSONer
} = require('rom-builder').types;

const LZSS = require('./lib/lzss');

class BattleStatusGraphics extends Closure {
  constructor (fetch) {
    super();

    this.type = new Reader({
      offset: 0xD2E000,
      type: new LZSS({
        type: new List({
          size: 300,
          type: new Tile({
            bpp: 4
          })
        })
      })
    });
  }
  parse (string) {
    return this.type.parse(string.split('\n\n'));
  }
  format (data) {
    return this.type.format(data).join('\n\n');
  }
}

module.exports = BattleStatusGraphics;
