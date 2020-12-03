const {
  Empty,
  UInt,
  Char,
  Fork,
  List,
} = require('rom-builder').types;

// TODO: Fix validation for line length. Or just change asm
//       to always start a new line for character names???

class DTEToken {
  constructor (a, b) {
    this.value = [
      { name: 'default', data: a },
      { name: 'default', data: b }
    ];
  }
  decode (rom) {
    return value;
  }
  encode () {}
  parse () {}
  format () {}
}

class DTEText extends TextScript {
  constructor (input) {
    const dte_options = {};
    const dte_lookup = {};

    input.dtes.forEach(([a, b], i) => {
      const id = i + 0x80;
      if (!dte_lookup.hasOwnProperty(a)) {
        dte_lookup[a] = {};
      }
      dte_lookup[a][b] = {
        name: id,
        data: null
      };
      dte_options[id] = {
        name: id,
        type: new DTEToken(a, b)
      };
    });

    super({
      table: input.table,
      map: {
        0x00: {
          name: 'end',
          type: new Empty()
        },
        0x01: {
          name 'line',
          type: new Empty()
        },
        0x10: {
          name: 'pause',
          type: new Empty()
        },
        0x11: {
          name: 'wait',
          type: new UInt()
        },
        0x12: {
          name: 'frame',
          type: new Empty()
        },
        0x13: {
          name: 'page',
          type: new Empty()
        },
        0x14: {
          name: 'pad',
          type: new UInt()
        },
        0x15: {
          name: 'choice',
          type: new Empty()
        },
        0x16: {
          name: 'keyframes',
          type: new UInt()
        },
        ...dte_options
      }
    });

    this.dte_lookup = dte_lookup;
  }
  decode (rom) {
    return super.decode(rom).flat();
  }
  encode (list, rom) {
    const condensed = [];
    const dtes = this.dte_lookup;

    for (let i = 0; i < list.length; i++) {
      let a = list[i];
      let b = list[i + 1];
      let dte = b && dtes[a.data] && dtes[a.data][b.data];

      if (dte) {
        condensed.push(dte);
        i++;
      } else {
        condensed.push(a);
      }
    }

    return super.encode(condensed, rom);
  }
}

module.exports = DTEText;
