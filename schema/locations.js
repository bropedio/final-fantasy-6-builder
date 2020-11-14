"use strict";

const {
  JSONer,
  ParallelList,
  Reader,
  PointerTable,
  DTEText,
  Getter
} = require('rom-builder').types;

const script_table = require('./lib/script_table');

/* Locations */

class Locations extends JSONer {
  constructor (fetch) {
    super();

    this.type = new ParallelList([{
      name: 'Name',
      type: new Reader({
        offset: 0xE68400, 
        warn: 0xFFFFFF,
        type: new PointerTable({
          size: 73,
          offset: 0xCEF100,
          warn: 0xCEF384,
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
