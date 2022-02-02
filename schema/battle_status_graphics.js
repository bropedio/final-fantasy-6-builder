"use strict";

const { types } = require('rom-builder');
const LZSS = require('./lib/lzss');

module.exports = new types.File({
  name: 'BattleStatusGraphics',
  extension: 'txt',
  type: new types.Reader({
    offset: 0xD2E000,
    type: new LZSS({
      type: new types.List({
        size: 300,
        type: new types.Tile({
          bpp: 4
        })
      })
    })
  }),
  parser: function (string) {
    return this.type.parse(string.split('\n\n'));
  },
  formatter: function (data) {
    return this.type.format(data).join('\n\n');
  }
});
