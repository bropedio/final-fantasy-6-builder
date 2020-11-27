"use strict";

const {
  JSONer,
  ParallelList,
  Reader,
  PointerTable,
  Getter
} = require('rom-builder').types;

const DTEText = require('./lib/dte_text');
const script_table = require('./lib/script_table');

/* Locations */

class Locations extends JSONer {
  constructor (fetch) {
    super();

    this.type = new ParallelList([{
      name: 'Name',
      type: new Reader({
        offset: 0xE68400, 
        type: new PointerTable({
          size: 73,
          offset: 0xCEF100,
          warn: 0xCEF390, // Note: lots of empty space after here...
          type: new DTEText({
            dtes: fetch('dtes'),
            table: script_table
          })
        })
      })
    }])
  }
}

module.exports = Locations;
