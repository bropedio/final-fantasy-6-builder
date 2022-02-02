"use strict";

const { types } = require('rom-builder');

class SplitList extends types.Closure {
  constructor (input) {
    super(input);
    this.size = input.size;
    this.chunk_size = input.chunk_size;
    this.offset = input.offset

    this.pointer_list = new types.List({
      size: this.size + 1,
      type: new types.UInt('word')
    });
  }
  initialize (api) {
    this.pointer_list.initialize(api);
    super.initialize(api);
  }
  decode (rom) {
    const pointers = this.pointer_list.decode(rom);
    let index = 0;
    const main_list = new types.List({
      size: list => {
        index = list.length;
        return list.length >= this.size;
      },
      type: new types.List({
        type: this.type,
        size: list => {
          const section = pointers[index + 1] - pointers[index];
          const size = section / this.chunk_size;
          return list.length >= size;
        }
      })
    });

    return main_list.decode(rom);
  }
  encode (list, rom) {
    const pointers = list.reduce((pointers, sublist) => {
      const start = pointers[pointers.length - 1];
      pointers.push(sublist.length * this.chunk_size + start);
      return pointers;
    }, [this.offset]);

    this.pointer_list.encode(pointers, rom);

    const flat_list = list.flat();
    const main_list = new types.List({
      size: flat_list.length,
      type: this.type
    });

    return main_list.encode(flat_list, rom);
  }
  parse (array) {
    return array.map((item, i) => {
      return item.map(subitem => this.type.parse(subitem));
    });
  }
  format (list) {
    return list.map(item => {
      return item.map(subitem => this.type.format(subitem));
    });
  }
}

module.exports = SplitList;
