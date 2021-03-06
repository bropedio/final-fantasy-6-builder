"use strict";

const { types } = require('rom-builder');

// TODO: Fix validation for line length. Or just change asm
//       to always start a new types.line for character names???

class DTEToken extends types.Empty {
  constructor (a, b) {
    super();
    this.value = [
      { name: 'default', data: a },
      { name: 'default', data: b }
    ];
  }
  decode (rom) {
    return this.value;
  }
  encode () {}
  parse () {}
  format () {}
}

class DTEText extends types.TextScript {
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
          type: new types.Empty()
        },
        0x01: {
          name: 'line',
          type: new types.Empty()
        },
        0x10: {
          name: 'pause',
          type: new types.Empty()
        },
        0x11: {
          name: 'wait',
          type: new types.UInt('byte', 10)
        },
        0x12: {
          name: 'frame',
          type: new types.Empty()
        },
        0x13: {
          name: 'page',
          type: new types.Empty()
        },
        0x14: {
          name: 'pad',
          type: new types.UInt('byte', 10)
        },
        0x15: {
          name: 'choice',
          type: new types.Empty()
        },
        0x16: {
          name: 'keyframes',
          type: new types.UInt('byte', 10)
        },
        ...dte_options
      }
    });

    this.dte_lookup = dte_lookup;
  }
  decode (rom) {
    const expanded = [];

    super.decode(rom).forEach(item => {
      if (Array.isArray(item.data)) {
        expanded.push(...item.data);
      } else {
        expanded.push(item);
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
