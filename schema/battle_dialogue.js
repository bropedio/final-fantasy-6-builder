"use strict";

const name_table = require('./lib/name_table');
const {
  Closure,
  Reader,
  PointerTable
} = require('rom-builder').types;

const battle_text = require('./lib/battle_text_2');

class BattleDialogue extends Closure {
  constructor (fetch) {
    super();

    this.type = new Reader({
      offset: 0xCFDFE0,
      type: new PointerTable({
        size: 256,
        start: 0xCFE1E0,
        warn: 0xCFF450,
        offset: 0xCF0000,
        type: battle_text
      })
    });
  }
  parse (string) {
    return super.parse(string.split('\n').filter(line => {
      return line && line[0] !== ';';
    }));
  }
  format (list) {
    return super.format(list).map((line, i) => {
      return `; #${i}\n${line}`;
    }).join('\n\n');
  }
}

module.exports = BattleDialogue;
