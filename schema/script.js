"use strict";

const { types } = require('rom-builder');
const DTEText = require('./lib/dte_text');
const script_table = require('./lib/script_table');

/* Script */

module.exports = new types.File({
  name: 'Script',
  extension: 'txt',
  type: new types.Reader({
    offset: 0xCCE600,
    type: new types.PointerTable({
      size: 3084,
      offset: 0xCD0000,
      wrap: 0xCE0000,
      warn: 0xCEF100,
      type: new types.Transformer({
        type: new types.Ref('dtes'),
        transform: function (dtes) {
          return new DTEText({
            dtes: dtes,
            table: script_table
          });
        }
      })
    })
  }),
  parser: function (txt) {
    const lines = txt.split('\n').filter(Boolean);
    const valids = lines.filter(line => !/^\s*;/.test(line));
    return this.type.parse(valids);
  },
  formatter: function (dialogues) {
    dialogues = this.type.format(dialogues);
    const duplicates = {};

    return dialogues.map((dialogue, i) => {
      var header = `; #${i}`;

      if (dialogue in duplicates) {
        header += `\n; Duplicates #${duplicates[dialogue]}`;
      } else {
        duplicates[dialogue] = i;
      }

      return `\n${header}\n${dialogue}\n`;
    }).join('');
  }
});

/**
 * TODO: Implement support for validators

function validator (diaglogues, ff6) {
  return dialogues.map(validate_one).filter(Boolean);

  function validate_one (dialogue) {
    var _this = this;
    var full = '';
    var word = '';
    var text = '';
    var error = null;
    var MAX_X = 224; // maybe
    var MAX_Y = 3;

    var coords = {
      x: 0,
      y: 0,
      z: 0,
      w: 0,
      add_text: function (width) {
        this.w += width;
        word += text;
      },
      add_word: function (space) {
        if (error) return;
        var max = this.y == 3 ? 226 : MAX_X;
        if (this.x + this.w > max) {
          this.add_line();
          this.add_word(space);
        } else {
          full += word + (space ? ' ' : '');
          word = '';
          this.x += this.w + (space ? 0x05 : 0);
          this.w = 0;
        }
      },
      add_line: function () {
        full += `[auto-line: ${this.x}+${this.w}]\n`;
        this.y++;
        this.x = 0;

        if (this.y > MAX_Y) {
          error = [
            `X:${this.x}, Y:${this.y}, Z:${this.z}, W:${this.w}`,
            full,
            _this.stringify_one(dialogue)
          ].join('\n');
        }
      },
      add_page: function () {
        full += '\n\n';
        this.w = 0;
        this.x = 0;
        this.y = 0;
        this.z++;
      }
    };

    dialogue.forEach(token => {
      text = token.stringify();
      token.print(coords);
    });

    return error;
  }
}

class CharWidths extends JSONer {
  constructor (ff6) {
    super();

    this.type = new types.Reader({
      offset: 0xC48FC0,
      type: new types.List({
        size: 0x80,
        type: new types.UInt()
      })
    });
  }
  decode (ff6) {
    const char_widths = super.decode(ff6);
    const widths = {
      '{GP}': 0x09 * 7,
      '{item}': 0x0C * 10, // TODO char guess
      '{skill}': 0x0C * 10, // TODO char guess
      '{Terra}': 0x0C * 6,
      '{Locke}': 0x0C * 6,
      '{Cyan}': 0x0C * 6,
      '{Shadow}': 0x0C * 6,
      '{Edgar}': 0x0C * 6,
      '{Sabin}': 0x0C * 6,
      '{Celes}': 0x0C * 6,
      '{Strago}': 0x0C * 6,
      '{Relm}': 0x0C * 6,
      '{Setzer}': 0x0C * 6,
      '{Mog}': 0x0C * 6,
      '{Gau}': 0x0C * 6,
      '{Gogo}': 0x0C * 6,
      '{Umaro}': 0x0C * 6
    };

    char_widths.forEach((width, i) => widths[i] = width);

    return widths;
  }
  encode (widths, ff6) {
    return null;
  }
}

const effects = {
  0x14: (coords, arg) => {
    coords.add_text(arg * 0x05);
    coords.add_word();
  },
  0x00: (coords, arg) => {
    coords.add_word();
  },
  0x01: (coords, arg) => {
    coords.add_word();
    coords.add_line(); 
  },
  0x13: (coords, arg) => {
    coords.add_word();
    coords.add_page();
  },
  0x7F: (coords, arg) => {
    coords.add_word(true);
  },
  default: (coords, width) => {
    coords.add_text(width);
  }
};

*/
