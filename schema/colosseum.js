"use strict";

const {
  Reader,
  List,
  Struct,
  Enum,
  UInt,
  Fixed,
  Closure
} = require('rom-builder').types;

const get_values = require('rom-builder').get_values;

class Trades extends Closure {
  constructor (fetch) {
    super();

    const item_names = get_values(fetch('items'));
    const item_enum = new Enum(item_names);
    const monster_names = get_values(fetch('monsters'));
    const monster_enum = new Enum(monster_names);
    this.item_names = item_names;

    this.type = new Reader({
      offset: 0xDFB600,
      type: new List({
        size: 0x100,
        type: new Struct([{
          name: 'Opponent',
          type: monster_enum
        }, {
          name: 'Unknown',
          type: new UInt()
        }, {
          name: 'Prize',
          type: item_enum
        }, {
          name: 'Hidden',
          type: new Enum({ 0x00: 'False', 0xFF: 'True' })
        }])
      })
    });
  }
  parse (json) {
    return super.parse(JSON.parse(json).map(wrap => wrap.item));
  }
  format (data) {
    return JSON.stringify(super.format(data).map((item, i) => {
      return { id: this.item_names[i], index: i.toString(16), item: item };
    }), null, 4);
  }
}

module.exports = Trades;
