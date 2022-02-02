"use strict";

const { types } = require('rom-builder')
const table = require('./lib/name_table');

module.exports = new types.File({
  name: 'CommandNames',
  extension: 'json',
  type: new types.Reader({
    offset: 0xD8CEA0,
    type: new types.List({
      size: 32,
      type: new types.Text(7, table)
    }) 
  })
});
