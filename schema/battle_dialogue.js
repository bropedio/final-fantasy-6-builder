"use strict";

const name_table = require('./lib/name_table');
const {
  JSONer,
  Reader,
  PointerTable,
  TextLong
} = require('rom-builder').types;

class BattleDialogue extends JSONer {
  constructor (fetch) {
    super();

    this.type = new Reader({
      offset: 0xCFDFE0,
      type: new PointerTable({
        size: 256,
        start: 0xCFE1E0,
        warn: 0xCFF450,
        offset: 0xCF0000,
        type: new TextLong(name_table)
      })
    });
  }
}

module.exports = BattleDialogue;
