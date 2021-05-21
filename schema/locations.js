"use strict";

const {
  JSONer,
  ParallelList,
  List,
  Bits,
  Bool,
  UInt,
  Enum,
  EnumWord,
  Struct,
  Reader,
  PointerTable,
  IndexTable,
} = require('rom-builder').types;

const { get_values } = require('rom-builder');

const DTEText = require('./lib/dte_text');
const IndexList = require('./lib/index_list');
const CondensedList = require('./lib/condensed_list');
const script_table = require('./lib/script_table');
const NPCs = require('./lib/npcs');
const Treasures = require('./lib/treasures');
const location_names = require('./lib/location_names');

/* Locations */

class Locations extends JSONer {
  constructor (fetch) {
    super();

    const formation_enum = new EnumWord(get_values(fetch('formations'), form => {
      return Array(6).fill().map((_, i) => {
        const name = form.Enemies[`Monster-${i+1} ID`];
        return name === '-' ? null : name;
      }).filter(Boolean).join(',');
    }));

    const base_location = new Reader({
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

    this.type = new ParallelList([{
      name: 'Data',
      type: base_location
    }, {
      name: 'Encounter Rate',
      type: new Reader({
        offset: 0xCF5880,
        type: new CondensedList({
          splits: 4,
          full_size: 0x19F,
          type: new Enum(['Normal', 'Fewer', 'More', 'Most']) // TODO
        })
      })
    }, {
      name: 'Packs',
      type: new Reader({
        offset: 0xCF5600,
        type: new List({
          size: 0x19F,
          type: new IndexList({
            offset: 0xCF4800,
            chunk: 8,
            warn: 0xCF5000,
            type: new List({
              size: 4,
              type: new Bits([{
                mask: 0x7FFF,
                name: 'Formation',
                type: formation_enum
              }, {
                mask: 0x8000,
                name: 'Random?',
                type: new Bool()
              }])
            })
          })
        })
      })
    }, {
      name: 'Treasures',
      type: new Treasures(fetch)
    }, {
      name: 'NPCs',
      type: new NPCs(fetch)
    }]);
  }

  parse (json) {
    return this.type.parse(JSON.parse(json).map(wrap => wrap.item));
  }
  format (data) {
    return JSON.stringify(this.type.format(data).map((item, i) => {
      return { id: location_names[i], item: item };
    }), null, 4);
  }
}

module.exports = Locations;
