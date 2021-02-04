"use strict";

const {
  JSONer,
  ParallelList,
  List,
  UInt,
  Struct,
  Reader,
  PointerTable,
  IndexTable,
} = require('rom-builder').types;

const DTEText = require('./lib/dte_text');
const script_table = require('./lib/script_table');

/* Locations */

class Locations extends JSONer {
  constructor (fetch) {
    super();

    this.type = new Reader({
      offset: 0xED8F00,
      type: new List({
        size: 0x19F, // Many more locations than names...
        type: new Struct([{
          name: 'Name',
          type: new IndexTable({
            table_offset: 0xE68400, 
            table_warn: null,
            data_offset: 0xCEF100,
            data_warn: 0xCEF470, // Note: lots of empty space after here...
            type: new DTEText({
              dtes: fetch('dtes').data,
              table: script_table
            })
          })
        }, {
          name: 'Layer Effects',
          type: new UInt()
        }, {
          name: 'Battle and BG3',
          type: new UInt()
        }, {
          name: 'Unused Maybe',
          type: new UInt()
        }, {
          name: 'Tile Properties',
          type: new UInt()
        }, {
          name: 'Battle Flags',
          type: new UInt()
        }, {
          name: 'Window Mask',
          type: new UInt()
        }, {
          name: 'Tilesets',
          type: new List({
            size: 6,
            type: new UInt()
          })
        }, {
          name: 'Tilemaps',
          type: new List({
            size: 4,
            type: new UInt()
          })
        }, {
          name: 'Sprite Index',
          type: new UInt()
        }, {
          name: 'BG2 LeftShift',
          type: new UInt()
        }, {
          name: 'BG2 UpShift',
          type: new UInt()
        }, {
          name: 'BG3 LeftShift',
          type: new UInt()
        }, {
          name: 'BG3 UpShift',
          type: new UInt()
        }, {
          name: 'BG Scroll Mode',
          type: new UInt()
        }, {
          name: 'BG1/BG2 Dimensions',
          type: new UInt()
        }, {
          name: 'BG3 Dimensions',
          type: new UInt()
        }, {
          name: 'Palette Index',
          type: new UInt()
        }, {
          name: 'Palette Animation Index',
          type: new UInt()
        }, {
          name: 'BG Animations',
          type: new UInt()
        }, {
          name: 'Music Track',
          type: new UInt()
        }, {
          name: 'Unused Maybe 2',
          type: new UInt()
        }, {
          name: 'Layer Mask Right',
          type: new UInt()
        }, {
          name: 'Layer Mask Bottom',
          type: new UInt()
        }, {
          name: 'Color Math Mode',
          type: new UInt()
        }])
      })
    });
  }
}

module.exports = Locations;
