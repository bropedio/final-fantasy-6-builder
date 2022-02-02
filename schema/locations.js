"use strict";

const { types } = require('rom-builder');

const DTEText = require('./lib/dte_text');
const IndexList = require('./lib/index_list');
const CondensedList = require('./lib/condensed_list');
const script_table = require('./lib/script_table');
const npc_reader = require('./lib/npcs');
const tile_data_reader = require('./lib/tile_data');
const treasure_reader = require('./lib/treasures');
const location_names = require('./lib/location_names');

/* Locations */

const base_location = new types.Reader({
  offset: 0xED8F00,
  type: new types.List({
    size: 0x19F, // Many more locations than names...
    type: new types.Struct([{
      name: 'Name',
      type: new types.IndexTable({
        table_offset: 0xE68400, 
        table_warn: null,
        data_offset: 0xCEF100,
        data_warn: 0xCEF470, // Note: lots of empty space after here...
        type: new DTEText({
          dtes: [], // Location names don't actually support DTEs
          table: script_table
        })
      })
    }, {
      name: 'Layer Effects',
      type: new types.UInt()
    }, {
      name: 'Battle and BG3',
      type: new types.UInt()
    }, {
      name: 'Unused Maybe',
      type: new types.UInt()
    }, {
      name: 'Tile Properties',
      type: new types.UInt()
    }, {
      name: 'Battle Flags',
      type: new types.UInt()
    }, {
      name: 'Window Mask',
      type: new types.UInt()
    }, {
      name: 'Tilesets',
      type: new types.List({
        size: 6,
        type: new types.UInt()
      })
    }, {
      name: 'Tilemaps',
      type: new types.List({
        size: 4,
        type: new types.UInt()
      })
    }, {
      name: 'Sprite Index',
      type: new types.UInt()
    }, {
      name: 'BG2 LeftShift',
      type: new types.UInt()
    }, {
      name: 'BG2 UpShift',
      type: new types.UInt()
    }, {
      name: 'BG3 LeftShift',
      type: new types.UInt()
    }, {
      name: 'BG3 UpShift',
      type: new types.UInt()
    }, {
      name: 'BG Scroll Mode',
      type: new types.UInt()
    }, {
      name: 'BG1/BG2 Dimensions',
      type: new types.UInt()
    }, {
      name: 'BG3 Dimensions',
      type: new types.UInt()
    }, {
      name: 'Palette Index',
      type: new types.UInt()
    }, {
      name: 'Palette Animation Index',
      type: new types.UInt()
    }, {
      name: 'BG Animations',
      type: new types.UInt()
    }, {
      name: 'Music Track',
      type: new types.UInt()
    }, {
      name: 'Unused Maybe 2',
      type: new types.UInt()
    }, {
      name: 'Layer Mask Right',
      type: new types.UInt()
    }, {
      name: 'Layer Mask Bottom',
      type: new types.UInt()
    }, {
      name: 'Color Math Mode',
      type: new types.UInt()
    }])
  })
});


module.exports = new types.File({
  name: 'Locations',
  extension: 'json',
  type: new types.ParallelList([{
    name: 'Data',
    type: base_location
  }, {
    name: 'Encounter Rate',
    type: new types.Reader({
      offset: 0xCF5880,
      type: new CondensedList({
        splits: 4,
        full_size: 0x19F,
        type: new types.Enum(['Normal', 'Fewer', 'More', 'Most']) // TODO
      })
    })
  }, {
    name: 'Packs',
    type: new types.Reader({
      offset: 0xCF5600,
      type: new types.List({
        size: 0x19F,
        type: new IndexList({
          offset: 0xCF4800,
          chunk: 8,
          warn: 0xCF5000,
          type: new types.List({
            size: 4,
            type: new types.Bits([{
              mask: 0x7FFF,
              name: 'Formation',
              type: new types.Transformer({
                type: new types.Ref('formations'),
                transform: function (formations) {
                  const seen = new Set();

                  return new types.EnumWord(formations.map((form, f) => {
                    const value = Array(6).fill().map((_, i) => {
                      const name = form.Enemies[`Monster-${i+1} ID`];
                      return name === '-' ? null : name;
                    }).filter(Boolean).join(',');

                    if (seen.has(value)) {
                      return `${f}:${value}`;
                    } else {
                      seen.add(value);
                      return value;
                    }
                  }));
                }
              })
            }, {
              mask: 0x8000,
              name: 'Random?',
              type: new types.Bool()
            }])
          })
        })
      })
    })
  }, {
    name: 'Treasures',
    type: treasure_reader
  }, {
    name: 'NPCs',
    type: npc_reader
  }, {
    name: 'Tile Data',
    type: tile_data_reader
  }]),
  parser: function (json) {
    return this.type.parse(json.map(wrap => wrap.item));
  },
  formatter: function (data) {
    return this.type.format(data).map((item, i) => {
      return { id: location_names[i], item: item };
    });
  }
});
