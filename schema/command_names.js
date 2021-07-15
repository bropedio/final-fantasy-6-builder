"use strict";

const {
  JSONer,
  Reader,
  List,
  Text
} = require('rom-builder').types;

const table = require('./lib/name_table');

class CommandNames extends JSONer {
  constructor (fetch) {
    super();

    this.type = new Reader({
      offset: 0xD8CEA0,
      type: new List({
        size: 32,
        type: new Text(7, table)
      }) 
    })
  }
}

module.exports = CommandNames;
