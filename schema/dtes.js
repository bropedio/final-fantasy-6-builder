"use strict";

const {
  Char,
  List,
  Reader,
  JSONer
} = require('rom-builder').types;

const script_table = require('./lib/script_table');
const { get_values } = require('rom-builder');

/* DTE Table */

class DTEs extends JSONer {
  constructor (fetch) {
    super();

    this.type = new Reader({
      offset: 0xC0DFA0,
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
    const dialogues = fetch('script').data;
    const locations = get_values(fetch('locations'));
    const chars = dialogues.concat(locations).flat().map(obj => {
      return obj.name === 'default' ? obj.data : 0x00;
    });
    const dte_map = {};
    const bar = new ProgressBar({ length: 32, ticks: 0x80 }); 

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
      bar.tick();
    }

    return Object.keys(dte_map).map(key => {
      return JSON.parse(key);
    });
  }
}

class ProgressBar {
  constructor (input) {
    this.length = input.length;
    this.ticks = input.ticks;
    this.progress = 0;
    process.stdout.write('Progress: [');
  }
  remaining () {
    return this.length - Math.floor(this.length * this.progress / this.ticks);
  }
  tick () {
    const pre_remain = this.remaining();

    if (pre_remain > 0) {
      this.progress++;
      const new_remain = this.remaining();

      if (new_remain < pre_remain) {
        process.stdout.write('#');

        if (new_remain === 0) {
          process.stdout.write(']\n');
        }
      }
    }
  }
}

module.exports = DTEs;
