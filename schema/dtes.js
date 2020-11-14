"use strict";

const {
  Char,
  List,
  Reader,
  JSONer
} = require('rom-builder').types;

const script_table = require('./lib/script_table');

/* DTE Table */

class DTEs extends JSONer {
  constructor (fetch) {
    super();

    this.type = new Reader({
      offset: 0xC0DFA0,
      warn: 0xC0E0A0,
      type: new List({
        size: 128,
        type: new List({
          size: 2,
          type: new Char(script_table)
        })
      })
    });
  }

  optimize (dtes, fetch) {
    const dialogues = fetch('script');
    const locations = fetch('locations').map(obj => obj.Name);
    const chars = dialogues.concat(locations).flat().map(obj => obj.id);
    const dte_map = {};

    while (Object.keys(dte_map).length < 0x80) {
      let pairs = {};

      for (let i = 0; i < chars.length - 1; i++) {
        let char_a = chars[i];
        let char_b = chars[i + 1];

        if (char_a < 0x20 || char_b < 0x20) {
          continue;
        }

        let key = JSON.stringify([char_a, char_b]);

        if (dte_map[key]) {
          i++;
          continue; 
        }

        pairs[key] = (pairs[key] || 0) + 1;
      }

      let keys = Object.keys(pairs).sort((a, b) => {
        return pairs[b] - pairs[a];
      });

      dte_map[keys[0]] = true;
    }

    return Object.keys(dte_map).map(key => {
      return JSON.parse(key);
    });
  }
}

module.exports = DTEs;
