"use strict";

const name_table = require('./name_table');

module.exports = (function () {
  return {
    0x00: '[end]',
    0x01: '[line]',
    0x02: '[2-digit-number:]',
    0x03: '[draw:]',
    0x04: '[update-bank:]',
    0x05: '[spaces:]',
    0x07: '[char-1-info:]',
    0x08: '[char-2-info:]',
    0x09: '[char-3-info:]',
    0x0A: '[char-4=info:]',

    ...name_table
  };
})();
