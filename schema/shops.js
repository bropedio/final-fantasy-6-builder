"use strict";

const { types } = require('rom-builder');

module.exports = new types.File({
  name: 'Shops',
  extension: 'json',
  type: new types.Reader({
    offset: 0xC47AC0,
    type: new types.List({
      size: 0x80,
      type: new types.Struct([{
        name: 'Flags',
        type: new types.Bits([{
          name: 'Type',
          mask: 0x07,
          type: new types.Enum([
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
          type: new types.UInt()
        }])
      }, {
        name: 'Inventory',
        type: new types.List({
          size: 8,
          type: new types.RefEnum({
            ref: 'items',
            path: ['Name']
          })
        })
      }])
    })
  })
});
