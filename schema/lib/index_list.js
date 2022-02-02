"use strict";

const { types } = require('rom-builder');

class IndexList extends types.Closure {
  constructor (input) {
    super(input);
    this.offset = input.offset;
    this.warn = input.warn;
    this.chunk = input.chunk;
    this.index = new types.UInt();
  }
  initialize (api) {
    this.values = [];
    this.indexes = {};
    this.map = {};
    this.index.initialize(api);
    super.initialize(api);
  }
  add_to_map (key, data) {
    if (!this.map[key]) {
      this.map[key] = this.values.length;
      this.values.push(data);
    }
  }
  decode (rom) {
    const index = this.index.decode(rom);

    if (!this.indexes[index]) {
      const reader = new types.Reader({
        offset: this.offset + index * this.chunk,
        type: this.type
      });

      const data = reader.decode(rom);
      const key = JSON.stringify(data);
      this.indexes[index] = data;
      this.add_to_map(key, data);
    }

    return this.indexes[index];
  }
  encode (data, rom) {
    if (this.values != null) {
      const reader = new types.Reader({
        offset: this.offset,
        warn: this.warn,
        type: new types.List({
          size: this.values.length,
          type: this.type
        })
      });

      reader.encode(this.values, rom);
      this.values = null;
    }

    const index = this.map[JSON.stringify(data)];
    if (index == null) throw new Error('Data not found');

    this.index.encode(index, rom);
  }
  parse (json) {
    const data = this.type.parse(json);
    const key = JSON.stringify(data);
    this.add_to_map(key, data);

    return data;
  }
  format (data) {
    return this.type.format(data);
  }
}

module.exports = IndexList;
