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

const types = {
  0x00: 'Empty',
  0x02: 'Monster',
  0x04: 'Item',
  0x08: 'Gold'
};

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
      mask: 0xF000,
      name: 'Type',
      type: new Enum(types)
    }, {
      mask: 0x0E00,
      name: 'Unused Data',
      type: new UInt()
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
        size: 0x19F,
        chunk_size: 5,
        type: new Fork({
          control: new Looker((rom) => {
            const coords = rom.read('word');
            const type = (rom.read('word') & 0xF000) >> 12;
            return types[type];
          }),
          map: {
            Empty: { name: 'Empty', type: get_type(new Fixed(0x00)) },
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
