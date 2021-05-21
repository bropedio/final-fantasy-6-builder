"use strict";

const {
  Closure,
  List,
  Bits,
  UInt
} = require('rom-builder').types;

class CondensedList extends Closure {
  constructor (input) {
    super();

    this.splits = input.splits;
    this.piece = Math.pow(2, 8 / input.splits) - 1;
    this.full_size = input.full_size;
    this.type = new List({
      size: input.size || input.full_size / input.splits,
      type: new Bits(Array(input.splits).fill().map((_, i) => {
        return {
          mask: this.piece << (i * 8 / input.splits),
          name: i,
          type: input.type || new UInt()
        };
      }))
    });
  }
  parse (list) {
    const parsed = [];

    for (let i = 0; i < list.length; i += this.splits) {
      let item = {};
      parsed.push(item);

      for (let j = 0; j < this.splits; j++) {
        item[j] = list[i + j];
      }
    }

    return super.parse(parsed);
  }
  format (data) {
    return super.format(data).reduce((list, item) => {
      const item_list = Object.keys(item).sort().map(key => item[key]);
      return list.concat(item_list);
    }, []);
  }
}

module.exports = CondensedList;
