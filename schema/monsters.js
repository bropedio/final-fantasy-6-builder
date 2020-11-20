"use strict";

const {
  Text,
  List,
  Reader,
  ParallelList,
  JSONer
} = require('rom-builder').types;

const AIReader = require('./lib/ai');
const name_table = require('./lib/name_table');

/* Monsters */

class Monsters extends JSONer {
  constructor (fetch) {
    super();

    this.type = new ParallelList([{
      name: 'Name',
      type: new Reader({
        offset: 0xCFC050,
        type: new List({
          size: 383,
          type: new Text(10, name_table)
        })
      })
    }, {
      name: 'AI Script',
      type: new AIReader(fetch)
    }]);
  }
}

module.exports = Monsters;
