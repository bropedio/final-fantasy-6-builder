"use strict";

const { types } = require('rom-builder');
const battle_text = require('./lib/battle_text');

module.exports = new types.File({
  name: 'BattleQuips',
  extension: 'json',
  type: new types.Reader({
    offset: 0xCFDFE0,
    type: new types.PointerTable({
      size: 256,
      start: 0xCFE1E0,
      warn: 0xCFF450,
      offset: 0xCF0000,
      type: battle_text
    })
  })
});
