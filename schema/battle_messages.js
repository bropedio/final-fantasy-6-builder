"use strict";

const {
  Closure,
  Reader,
  PointerTable,
} = require('rom-builder').types;

const battle_text = require('./lib/battle_text_2');

class BattleMessages extends Closure {
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

module.exports = BattleMessages;
