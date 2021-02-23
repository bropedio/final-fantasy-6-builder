"use strict";

const name_table = require('./lib/name_table');
const {
  JSONer,
  Reader,
  PointerTable
} = require('rom-builder').types;

const battle_text = require('./lib/battle_text');

class BattleDialogue extends JSONer {
  constructor (fetch) {
    super();

    this.type = new Reader({
      offset: 0xD0D000,
      type: new PointerTable({
        size: 256,
        start: 0xD0D200,
        warn: 0xD0FD00,
        offset: 0xD00000,
        type: battle_text
      })
    });
  }
}

module.exports = BattleDialogue;
