"use strict";

const {
  JSONer,
  Reader,
  Grid,
  Closure
} = require('rom-builder').types;

const LZSS = require('./lib/lzss');

class Overworld extends Closure {
  constructor (fetch) {
    super();

    const lzss_grid = new LZSS({
      type: new Grid({
        height: 256,
        width: 256,
        mapper: (num) => {
          return num.toString(16).padStart(2, '0');

          /*
            WOB Tile Conversion Chart
              06: Ocean
              18: Grassland
              1E: Desert
              4E: Forest
          */
        }
      })
    });

    this.type = new Struct({
      fields: [{
        name: 'World of Balance',
        type: new Reader({
          offset: 0xEED434,
          warn: 0xEF114F,
          type: lzss_grid
        })
      }, {
        name: 'World of Ruin',
        type: new Reader({
          offset: 0xEF6A56,
          warn: 0xEF9D17,
          type: lzss_grid
        })
      }]
    });
  }
  parse (string) {
    let data = {};
    let groups = string.split('\n\n');
    
    for (let i = 0; i < groups.length; i += 2) {
      let name = groups[i].slice(2);
      let value = groups[i + 1];
      data[name] = value;
    }

    return this.type.parse(data);
  }
  format (raw_data) {
    const data = this.type.format(raw_data);
    const output = [];

    for (let name in data) {
      output.push(`; ${name}`, data[name]);
    }

    return output.join('\n\n');
  }
}

module.exports = Overworld;
