"use strict";

const { types } = require('rom-builder');

module.exports = new types.File({
  name: 'CharacterAI',
  extension: 'json',
  type: new types.Reader({
    offset: 0xD0FD00,
    type: new types.List({
      size: 32,
      type: new types.Struct([{
        name: 'Flags',
        type: new types.Bitmask({
          flags: [
            'Unknown-0x01',
            'Unknown-0x02',
            'Unknown-0x04',
            'Unknown-0x08',
            'Unknown-0x10',
            'Unknown-0x20',
            'Unknown-0x40',
            'Hide Party'
          ]
        })
      }, {
        name: 'Battle Background',
        type: new types.UInt()
      }, {
        name: 'Targetable Characters', 
        type: new types.UInt()
      }, {
        name: 'Song',
        type: new types.UInt()
      }, {
        name: 'Characters',
        type: new types.List({
          size: 4,
          type: new types.Struct([{
            name: 'Character ID',
            type: new types.UInt()
          }, {
            name: 'Sprite',
            type: new types.UInt()
          }, {
            name: 'AI Script ID',
            type: new types.UInt()
          }, {
            name: 'X Position',
            type: new types.UInt()
          }, {
            name: 'Y Position',
            type: new types.UInt()
          }])
        })
      }])
    })
  })
});
