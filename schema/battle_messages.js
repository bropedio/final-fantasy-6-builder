"use strict";

const battle_text = require('./lib/battle_text');
const { types } = require('rom-builder');

module.exports = new types.File({
  name: 'BattleMessages',
  extension: 'json',
  type: new types.Reader({
    offset: 0xD1F7A0,
    type: new types.PointerTable({
      size: 256,
      start: 0xD1F000,
      warn: 0xD1F7A0,
      offset: 0xD10000,
      type: battle_text
    })
  })
});
