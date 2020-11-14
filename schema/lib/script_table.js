"use strict";

module.exports = (function build_table () {
  const table = {};

  function char_coder (start, end, offset) {
    for (let op_code = start; op_code < end; op_code++) {
      table[op_code] = String.fromCharCode(op_code + offset);
    }
  }

  function add_group (start, items) {
    items.forEach((item, i) => table[start + i] = item);
  }
  
  add_group(0x00, [
    '[end]',
    '[line]',
    '{Terra}',
    '{Locke}',
    '{Cyan}',
    '{Shadow}',
    '{Edgar}',
    '{Sabin}',
    '{Celes}',
    '{Strago}',
    '{Relm}',
    '{Setzer}',
    '{Mog}',
    '{Gau}',
    '{Gogo}',
    '{Umaro}'
  ]);

  add_group(0x10, ['[pause]']);
  add_group(0x12, ['[frame]']);
  add_group(0x13, ['[page]']);
  add_group(0x15, ['[choice]']);

  add_group(0x19, [
    '{GP}',
    '{item}',
    '{skill}'
  ]);

  char_coder(0x20, 0x3A, +33); // A-Z
  char_coder(0x3A, 0x54, +39); // a-z
  char_coder(0x54, 0x5E, -36); // 0-9

  add_group(0x5E, [
    '!',
    '?',
    '/',
    ':',
    '<close_quote>',
    "'",
    '-',
    '.',
    ',',
    '<ellip>',
    ';',
    '#',
    '+',
    '(',
    ')',
    '%',
    '~',
    '*',
    '@',
    '<glyph 71>',
    '=',
    '"',
    '<glyph 74>',
    '<music_note>',
    '<holy>',
    '<x>',
    '<bolt>',
    '<wind>',
    '<earth>',
    '<ice>',
    '<fire>',
    '<water>',
    '<dark>',
    ' '
  ]);

  return table;
})();
