"use strict";

const {
  JSONer,
  Reader,
  List,
  EnumWord
} = require('rom-builder').types;

/* Slot Reels */

class SlotReels extends JSONer {
  constructor (fetch) {
    super();

    this.type = new Reader({
      offset: 0xC2A800,
      type: new List({
        size: 3,
        type: new List({
          size: 16,
          type: new EnumWord([
            'Seven',
            'Dragon',
            'Bar',
            'Airship',
            'Chobobo',
            'Diamond'
          ])
        })
      })
    });
  }
}

module.exports = SlotReels;
