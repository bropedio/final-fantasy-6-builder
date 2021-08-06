"use strict";

const {
  Closure,
  Reader,
  Struct,
  UInt,
  Fork,
  Looker,
  Fixed,
  Bits,
  Enum
} = require('rom-builder').types;

const SplitList = require('./split_list');
const { get_values } = require('rom-builder');

/* Treasures */

const real_types = {
  0x04: 'Empty',
  0x10: 'Monster',
  0x20: 'Item',
  0x40: 'Gold'
};

const types = { ...real_types };

for (let i = 0; i < 256; i++) {
  types[i] = types[i] || `0x${i.toString(16)}`;
}

function get_type (contents) {
  return new Struct([{
    name: 'Coordinates',
    type: new UInt('word')
  }, {
    name: 'Data',
    type: new Bits([{
      mask: 0x01FF,
      name: 'Event ID',
      type: new UInt('word')
    }, {
      mask: 0xFE00,
      name: 'Type',
      type: new Enum(types)
    }])
  }, {
    name: 'Contents',
    type: contents
  }]);
}

class Treasures extends Closure {
  constructor (fetch) {
    super();

    const item_enum = new Enum(get_values(fetch('items')));

    this.type = new Reader({
      offset: 0xED82F4,
      warn: 0xED8E5A,
      type: new SplitList({
        size: 0x19E,
        chunk_size: 5,
        offset: 0x00,
        type: new Fork({
          control: new Looker((rom) => {
            const coords = rom.read('word');
            const type = (rom.read('word') & 0xFE00) >> 9;
            return real_types[type] || 'Item';
          }),
          map: {
            Empty: { name: 'Empty', type: get_type(new UInt()) },
            Monster: { name: 'Monster-in-box', type: get_type(new UInt()) },
            Item: { name: 'Item', type: get_type(item_enum) },
            Gold: { name: 'GP (x100)', type: get_type(new UInt('byte', 10)) }
          }
        })
      })
    });
  }
}

module.exports = Treasures;
