"use strict";

const battle_text = require('./lib/battle_text');
const { types } = require('rom-builder');

module.exports = new types.File({
  name: 'BattleDialogue',
  extension: 'json',
  type: new types.Reader({
    offset: 0xD0D000,
    type: new types.PointerTable({
      size: 256,
      start: 0xD0D200,
      warn: 0xD0FD00,
      offset: 0xD00000,
      type: battle_text
    })
  })
});
