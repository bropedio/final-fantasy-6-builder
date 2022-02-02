"use strict";

const { types } = require('rom-builder');
const SplitList = require('./split_list');

/* Treasures */

const real_types = {
  0x04: 'Empty',
  0x10: 'Monster',
  0x20: 'Item',
  0x40: 'Gold'
};

const chest_types = { ...real_types };

for (let i = 0; i < 256; i++) {
  chest_types[i] = chest_types[i] || `0x${i.toString(16)}`;
}

function get_type (contents) {
  return new types.Struct([{
    name: 'Coordinates',
    type: new types.UInt('word')
  }, {
    name: 'Data',
    type: new types.Bits([{
      mask: 0x01FF,
      name: 'Event ID',
      type: new types.UInt('word')
    }, {
      mask: 0xFE00,
      name: 'Type',
      type: new types.Enum(chest_types)
    }])
  }, {
    name: 'Contents',
    type: contents
  }]);
}

const item_enum = new types.RefEnum({
  ref: 'items',
  path: ['Name']
});

module.exports = new types.Reader({
  offset: 0xED82F4,
  warn: 0xED8E5A,
  type: new SplitList({
    size: 0x19E,
    chunk_size: 5,
    offset: 0x00,
    type: new types.Fork({
      control: new types.Looker((rom) => {
        const coords = rom.read('word');
        const type = (rom.read('word') & 0xFE00) >> 9;
        return real_types[type] || 'Item';
      }),
      map: {
        Empty: { name: 'Empty', type: get_type(new types.UInt()) },
        Monster: { name: 'Monster-in-box', type: get_type(new types.UInt()) },
        Item: { name: 'Item', type: get_type(item_enum) },
        Gold: { name: 'GP (x100)', type: get_type(new types.UInt('byte', 10)) }
      }
    })
  })
});
