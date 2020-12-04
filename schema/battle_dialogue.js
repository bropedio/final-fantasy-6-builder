"use strict";

const name_table = require('./lib/name_table');
const {
  JSONer,
  Reader,
  Struct,
  PointerTable
} = require('rom-builder').types;

const battle_text = require('./lib/battle_text');

class BattleDialogue extends JSONer {
  constructor (fetch) {
    super();

    this.type = new Struct([{
      name: 'Long Dialogue',
      type: new Reader({
        offset: 0xD0D000,
        type: new PointerTable({
          size: 256,
          start: 0xD0D200,
          warn: 0xD0FD00,
          offset: 0xD00000,
          type: battle_text
        })
      })
    }, {
      name: 'Short Dialogue',
      type: new Reader({
        offset: 0xCFDFE0,
        type: new PointerTable({
          size: 256,
          start: 0xCFE1E0,
          warn: 0xCFF450,
          offset: 0xCF0000,
          type: battle_text
        })
      })
    }, {
      name: 'Messages',
      type: new Reader({
        offset: 0xD1F7A0,
        type: new PointerTable({
          size: 256,
          start: 0xD1F000,
          warn: 0xD1F7A0,
          offset: 0xD10000,
          type: battle_text
        })
      })
    }]);
  }
  /*
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
  */
}

module.exports = BattleDialogue;
