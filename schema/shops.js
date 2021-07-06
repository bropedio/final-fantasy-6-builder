"use strict";

const {
  Reader,
  List,
  Struct,
  Bits,
  Enum,
  UInt,
  JSONer
} = require('rom-builder').types;

const get_values = require('rom-builder').get_values;

class Shops extends JSONer {
  constructor (fetch) {
    super();

    const item_names = get_values(fetch('items'));
    const item_enum = new Enum(item_names);

    this.type = new Reader({
      offset: 0xC47AC0,
      type: new List({
        size: 0x80,
        type: new Struct([{
          name: 'Flags',
          type: new Bits([{
            name: 'Type',
            mask: 0x07,
            type: new Enum([
              'None',
              'Weapon',
              'Armor',
              'Item',
              'Relic',
              'Vendor'
            ])
          }, {
            name: 'Modifier',
            mask: 0xF8,
            type: new UInt()
          }])
        }, {
          name: 'Inventory',
          type: new List({
            size: 8,
            type: item_enum
          })
        }])
      })
    });
  }
}

module.exports = Shops;
