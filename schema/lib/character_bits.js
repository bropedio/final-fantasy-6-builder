"use strict";

const { Bitmask } = require('rom-builder').types;

const character_bitmask = new Bitmask({
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
