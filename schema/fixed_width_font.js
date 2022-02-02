"use strict";

const { types } = require('rom-builder');
const LZSS = require('./lib/lzss');

module.exports = new types.File({
  name: 'FixedWidthFont',
  extension: 'txt',
  type: new types.Reader({
    offset: 0xC487C0,
    type: new types.List({
      size: 128,
      type: new types.Tile({
        bpp: 2
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
