"use strict";

const { types } = require('rom-builder');

const character_bitmask = new types.Bitmask({
  flags: [
    'Terra',
    'Locke',
    'Cyan',
    'Shadow',
    'Edgar',
    'Sabin',
    'Celes',
    'Strago',
    'Relm',
    'Setzer',
    'Mog',
    'Gau',
    'Gogo',
    'Umaro',
    'Banon',
    'Leo'
  ]
});

module.exports = character_bitmask;
