"use strict";

const { types } = require('rom-builder');

module.exports = new types.File({
  name: 'Colosseum',
  extension: 'json',
  type: new types.Reader({
    offset: 0xDFB600,
    type: new types.List({
      size: 0x100,
      type: new types.Struct([{
        name: 'Opponent',
        type: new types.RefEnum({
          ref: 'monsters',
          path: ['Name']
        })
      }, {
        name: 'Unknown',
        type: new types.UInt()
      }, {
        name: 'Prize',
        type: new types.RefEnum({
          ref: 'items',
          path: ['Name']
        })
      }, {
        name: 'Hidden',
        type: new types.Enum({ 0x00: 'False', 0xFF: 'True' })
      }])
    })
  }),
  initializer: function (api) {
    this.item_names = api.fetch('items').map(item => item.Name.trim()); 
    this.type.initialize(api);
  },
  parser: function (json) {
    return this.type.parse(json.map(wrap => wrap.item));
  },
  formatter: function (data) {
    return this.type.format(data).map((item, i) => {
      return {
        id: this.item_names[i],
        index: i.toString(16),
        item: item
      };
    });
  }
});
