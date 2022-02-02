"use strict";

const { types } = require('rom-builder');
const LZSS = require('./lib/lzss');

function lzss_grid (height, width) {
  return new LZSS({
    type: new types.Grid({
      height: height,
      width: width || height,
      mapper: (num, reverse) => {
        if (reverse) return parseInt(num, 16);
        return num.toString(16).padStart(2, '0');

        /*
          WOB Tile Conversion Chart
            06: Ocean
            18: Grassland
            1E: Desert
            22: Mountain

            Forest:
            3D 3E 3F
            4D 4E 4F
            5D 5E 5F

            Mountain:
            .. .. ..
            .. 22 23 24
            .. 32 33
               42

            Mountain Peak:


        */
      }
    })
  });
}

module.exports = new types.File({
  name: 'WorldGraphics',
  extension: 'txt',
  type: new types.Reader({
    offset: 0xEEB290,
    type: new types.PointerStruct({
      offset: 0xEEB200,
      pointer_size: 'sword',
      fields: [{
        name: 'Empty_1',
        type: new types.Placeholder('Empty 1')
      }, {
        name: 'Empty_2',
        type: new types.Placeholder('Empty 2')
      }, {
        name: 'World Map Clouds Graphics',
        type: new LZSS()
      }, {
        name: 'World Map Clouds Tiles',
        type: new LZSS()
      }, {
        name: 'Blackjack Graphics',
        type: new LZSS()
      }, {
        name: 'World of Balance Map',
        type: lzss_grid(256)
      }, {
        name: 'World of Balance Graphics',
        type: new LZSS()
      }, {
        name: 'Mine Cart Graphics',
        type: new LZSS()
      }, {
        name: 'Empty_3',
        type: new types.Placeholder('Empty 3')
      }, {
        name: 'Mine Cart Palettes',
        type: new types.JSONer({
          type: new types.List({
            size: 0x200,
            type: new types.UInt('word')
          })
        })
      }, {
        name: 'World of Ruin Graphics', // TODO: Handle swap via USME?
        type: new LZSS()
      }, {
        name: 'Empty_4',
        type: new types.Placeholder('Empty 4')
      }, {
        name: 'World of Ruin Map', // TODO: Handle swap via USME?
        type: lzss_grid(256)
      }, {
        name: 'Serpent Trench Map',
        type: lzss_grid(128)
      }, {
        name: 'Serpent Trench Graphics',
        type: new LZSS()
      }]
    }) // TODO: Finish adding more compressed graphics
  }),
  parser: function (string) {
    let data = {};
    let groups = string.split('\n\n');
    
    for (let i = 0; i < groups.length; i += 2) {
      let name = groups[i].slice(2);
      let value = groups[i + 1];
      data[name] = value;
    }

    return this.type.parse(data);
  },
  formatter: function (raw_data) {
    const data = this.type.format(raw_data);
    const output = [];

    for (let name in data) {
      output.push(`; ${name}`, data[name]);
    }

    return output.join('\n\n');
  }
});
