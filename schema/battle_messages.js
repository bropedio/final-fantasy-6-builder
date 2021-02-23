"use strict";

const name_table = require('./lib/name_table');
const {
  JSONer,
  Reader,
  PointerTable
} = require('rom-builder').types;

const battle_text = require('./lib/battle_text');

class BattleMessages extends JSONer {
  constructor (fetch) {
    super();

    this.type = new Reader({
      offset: 0xD1F7A0,
      type: new PointerTable({
        size: 256,
        start: 0xD1F000,
        warn: 0xD1F7A0,
        offset: 0xD10000,
        type: battle_text
      })
    });
  }
}

module.exports = BattleMessages;
