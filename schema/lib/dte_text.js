const {
  Empty,
  UInt,
  Char,
  List,
} = require('rom-builder').types;

class DTEText extends List {
  constructor (input) {
    super({
      size: list => list.length && list[list.length - 1].id === 0,
      type: new Fork({
        control: new UInt(),
        map: {
          default: {
            name: 'static',
            type: new Empty()
          },
          0x11: {
            name: 'wait',
            type: new UInt()
          },
          0x14: {
            name: 'pad',
            type: new UInt()
          },
          0x16: {
            name: 'keyframes',
            type: new UInt()
          }
        }
      })
    });

    this.fork_map = { // TODO: Align with "map" object above
      end: 0x00,
      line: 0x01,
      pause: 0x10,
      frame: 0x12,
      page: 0x13,
      choice: 0x15,
      wait: 0x11,
      pad: 0x14,
      keyframes: 0x16
    };
    this.dte_map = {};
    this.dte_lookup = {};
    this.char_type = new Char(input.table);

    input.dtes.forEach(([a, b], i) => {
      const id = i + 0x80;
      this.dte_map[id] = [{ id: a }, { id: b }];
      if (!this.dte_lookup.hasOwnProperty(a)) {
        this.dte_lookup[a] = {};
      }
      this.dte_lookup[a][b] = { id };
    });
  }
  decode (rom) {
    const list = super.decode(rom);
    const expanded = [];

    list.forEach(obj => {
      if (this.dte_map[obj.id]) {
        expanded.push(...this.dte_map[obj.id]);
      } else {
        expanded.push(obj);
      }
    });

    return expanded;
  }
  encode (list, rom) {
    const condensed = [];
    const dtes = this.dte_lookup;

    for (let i = 0; i < list.length; i++) {
      let a = list[i];
      let b = list[i + 1];
      let dte = b && dtes[a.id] && dtes[a.id][b.id];

      if (dte) {
        condensed.push(dte);
        i++;
      } else {
        condensed.push(a);
      }
    }

    return super.encode(condensed, rom);
  }
  parse (string) {
    const list = string.split(/(?![^\[<{]*[\]>}])/).filter(Boolean).map(token => {
      if (token[0] === '[') {
        const [name, data] = token.slice(1, -1).split(':');
        return {
          id: this.fork_map[name],
          name: name,
          data: parseInt(data)
        };
      } else {
        return {
          id: this.char_type.parse(token)
        };
      }
    });

    return list;
  }
  format (list) {
    return list.map(obj => {
      if (obj.data == null) {
        return this.char_type.format(obj.id);
      } else {
        return `[${obj.name}:${obj.data}]`;
      }
    }).join('');
  }
}

module.exports = DTEText;
