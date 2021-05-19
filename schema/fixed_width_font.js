"use strict";

const {
  Reader,
  Tile,
  List,
  Closure,
  JSONer
} = require('rom-builder').types;

const LZSS = require('./lib/lzss');

class FixedWidthFont extends Closure {
  constructor (fetch) {
    super();

    this.type = new Reader({
      offset: 0xC487C0,
      type: new List({
        size: 128,
        type: new Tile({
          bpp: 2
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

module.exports = FixedWidthFont;
