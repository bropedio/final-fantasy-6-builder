"use strict";

const {
  Closure,
  Reader,
  List,
  Struct,
  UInt,
  Bool,
  Bits,
  Enum
} = require('rom-builder').types;

class SplitList {
  constructor (input) {
    this.size = input.size;
    this.type = input.type;
    this.chunk_size = input.chunk_size;
    this.data_offset = this.size * 2 + 2;

    this.pointer_list = new List({
      size: this.size + 1,
      type: new UInt('word')
    });
  }
  decode (rom) {
    const pointers = this.pointer_list.decode(rom);
    let index = 0;
    const main_list = new List({
      size: list => {
        index = list.length;
        return list.length >= this.size;
      },
      type: new List({
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
    }, [this.data_offset]);

    this.pointer_list.encode(pointers, rom);

    const flat_list = list.flat();
    const main_list = new List({
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
