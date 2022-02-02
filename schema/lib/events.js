"use strict";

/* TODO: Update this file to new syntax, and get it working */

const {
  Closure,
  List,
  Reader,
  Graph,
  Struct,
  UInt,
  Bits,
  Bool,
  Empty,
  Fork,
  Custom,
  JSONer
} = require('rom-builder').types;

const { get_values } = require('rom-builder');

/* Helpers */

function basic_args (names) {
  return new Struct(names.map(name => ({ name, type: new UInt() })));
}

const object_arg = basic_args(['Object ID']);

const message_args = new Bits([{
  mask: 0x3FFF,
  name: 'Message ID',
  type: new UInt('word')
}, {
  mask: 0x8000,
  name: 'No Window',
  type: new Bool()
}, {
  mask: 0x4000,
  name: 'Bottom Window',
  type: new Bool()
}]);

const battle_args = new Struct([{
  name: 'Formation',
  type: new UInt()
}, {
  name: 'Background',
  type: new Bits([{
    mask: 0x80,
    name: 'Disable Mosaic',
    type: new Bool()
  }, {
    mask: 0x40,
    name: 'Disable Swoosh',
    type: new Bool()
  }, {
    mask: 0x3F,
    name: 'Background ID',
    type: new UInt()
  }])
}]);

const color_args = new Bits([{
  mask: 0xF0,
  name: 'Color',
  type: new UInt()
}, {
  mask: 0x0F,
  name: 'Intensity',
  type: new UInt()
}]);

const map_id = new Bits([{
  mask: 0x01FF,
  name: 'Map ID',
  type: new UInt()
}, {
  mask: 0x3000,
  name: 'Facing',
  type: new Enum(['Up', 'Right', 'Down', 'Left'])
}, {
  mask: 0x0800,
  name: 'Display Name',
  type: new Bool()
}, {
  mask: 0xD700,
  name: 'Data',
  type: new UInt()
}]);

const map_flags = new Bitmask({
  flags: [
    'On Airship',
    'On Chocobo',
    'Unknown 0x04',
    'Unknown 0x08',
    'Unknown 0x10',
    'No Size Update',
    'No Screen Fade',
    'Run Entrance Event'
  ]
});

const map_args = new Struct([{
  name: 'Map',
  type: map_id
}, {
  name: 'Coords',
  type: new UInt('word')
}, {
  name: 'Flags',
  type: map_flags
}]);

// TODO: Handle exiting from Map (and parent script) with 0xFF
const map_script = new List({
  size: (list => list[list.length - 1] || {}).name === 'Return',
  type: new Fork({
    control: new UInt(),
    map: {

    }
  })
});

const map_args_plus_script = new Struct([{
  name: 'Map',
  type: new Custom({
    type: map_id,
    decoder: function (rom) {
      const value = this.type.decode(rom);
      if (!rom._scratch) rom._scratch = {};
      rom._scratch.map_has_script = [
        0x1FF, 0x1FE, 0x2, 0x1, 0x0
      ].indexOf(value & 0x1FF) !== -1;
      return value;
    }
  })
}, {
  name: 'Coords',
  type: new UInt('word')
}, {
  name: 'Flags',
  type: map_flags
}, {
  name: 'Map Script',
  type: new Dynamic({
    get_type: (value, rom, method) => {
      const has_it = method === 'decode' ? rom._scratch.map_has_script : value;
      return has_it ? map_script : new Empty();
    }
  })
}]);

const event_bit_args = (count) => {
  const fields = new Array(count).fill().map((_, i) => {
    return { name: `Event Bit ${i}`, type: new UInt('word') }; 
  }).concat({ name: 'Address', type: new UInt('sword') });

  return new Struct(fields);
};

/* Dynamic */

class Dynamic extends Empty {
  constructor (input) {
    super();
    this.get_type = input.get_type;
  }
  decode (rom) {
    const type = get_type(null, rom, 'decode');
    return type.decode(rom);
  }
  encode (data, rom) {
    const type = get_type(data, rom, 'encode');
    return type.encode(data, rom);
  }
  parse (json) {
    const type = get_type(json, null, 'parse');
    return type.parse(json);
  }
  format (data) {
    const type = get_type(data, null, 'format');
    return type.format(data);
  }
}

/* Queue Type */

const graphic_index_ops = new Array(0x80).fill().reduce((ops, _, i) => {
  ops[i] = { name: `Set graphic to ${i}`, type: new Empty() };
  return ops;
}, {});

const simple_move_ops = new Array(0x20).fill().reduce((ops, _, i) => {
  const direction = ['up', 'right', 'down', 'left'][i & 0x03];
  const steps = (i & 0x1C) >> 2;
  ops[i + 0x80] = {
    name: `Move ${direction} ${steps} step(s)`,
    type: new Empty()
  };
  return ops;
}, {});

const other_move_ops = new Array(0x0C).fill().reduce((ops, _, i) => {
  const direction = [
    'UR','DR','DL','UL','RUU','RRU','RRD','RDD','LDD','LLD','LLU','LUU'
  ][i];
  ops[i + 0xA0] = {
    name: `Move ${direction} 1 step`,
    type: new Empty()
  };
  return ops;
}, {});

const speed_ops = new Array(0x16).fill().reduce((ops, _, i) => {
  const speed = i - 0xC0;
  ops[i + 0xB0] = {
    name: `Set speed to ${speed}`,
    type: new Empty()
  };
  return ops;
}, {});

const action_op = new Fork({
  control: new UInt(),
  map: {
    ...graphic_index_ops,
    ...simple_move_ops,
    ...other_move_ops,
    ...speed_ops,
    0xC6: {
      name: 'Enable walking',
      type: new Empty()
    },
    0xC7: {
      name: 'Disable walking',
      type: new Empty()
    },
    0xC8: {
      name: 'Set layering priority',
      type: new UInt()
    },
    0xC9: {
      name: 'Place on vehicle',
      type: basic_args(['Vehicle'])
    },
    0xCC: {
      name: 'Face up',
      type: new Empty()
    },
    0xCD: {
      name: 'Face right',
      type: new Empty()
    },
    0xCE: {
      name: 'Face down',
      type: new Empty()
    },
    0xCF: {
      name: 'Face left',
      type: new Empty()
    },
    0xD0: {
      name: 'Unhide',
      type: new Empty()
    },
    0xD1: {
      name: 'Hide',
      type: new Empty()
    },
    0xD5: {
      name: 'Set position',
      type: basic_args(['X', 'Y'])
    },
    0xD7: {
      name: 'Center on screen',
      type: new Empty()
    },
    0xDC: {
      name: 'Jump (low)',
      type: new Empty()
    },
    0xDD: {
      name: 'Jump (high)',
      type: new Empty()
    },
    0xE0: {
      name: 'Pause',
      type: basic_args(['Frames'])
    },
    0xE1: {
      name: 'Set $1E80 Event Bit',
      type: basic_args(['Bit ID'])
    },
    0xE2: {
      name: 'Set $1EA0 Event Bit',
      type: basic_args(['Bit ID'])
    },
    0xE3: {
      name: 'Set $1EC0 Event Bit',
      type: basic_args(['Bit ID'])
    },
    0xE4: {
      name: 'Clear $1E80 Event Bit',
      type: basic_args(['Bit ID'])
    },
    0xE5: {
      name: 'Clear $1EA0 Event Bit',
      type: basic_args(['Bit ID'])
    },
    0xE6: {
      name: 'Clear $1EC0 Event Bit',
      type: basic_args(['Bit ID'])
    },
    0xF9: {
      name: 'Jump to subroutine',
      type: new UInt('sword')
    },
    0xFA: {
      name: '50% Branch back',
      type: basic_args(['Bytes'])
    },
    0xFB: {
      name: '50% Branch ahead',
      type: basic_args(['Bytes'])
    },
    0xFC: {
      name: 'Branch back',
      type: basic_args(['Bytes'])
    },
    0xFD: {
      name: 'Branch ahead',
      type: basic_args(['Bytes'])
    },
    0xFF: {
      name: 'Return',
      type: new Empty()
    }
  }
});

class ActionQueue extends Empty {
  constructor () {
    super();
    this.op = action_op;
    this.control = new Bits([{
      mask: 0x80,
      name: 'Sync',
      type: new Bool()
    }, {
      mask: 0x7F,
      name: 'Length',
      type: new UInt()
    }]);
  }
  op_list (length) {
    return new List({
      size: length,
      type: this.op
    });
  }
  decode (rom) {
    const { Sync, Length } = this.control.decode(rom);
    return {
      Sync,
      Ops: this.op_list(Length).decode(rom)
    };
  }
  encode (data, rom) {
    const { Sync, Ops } = data;
    const Length = Ops.length;
    this.control.encode({ Sync, Length }, rom);
    this.op_list(Length).encode(Ops, rom);  
  }
  parse (json) {
    const { Ops, Sync } = json;
    const op_list = this.op_list(Ops.length);
    return {
      Ops: op_list.parse(Ops),
      Sync: (new Bool()).parse(Sync)
    };
  }
  format (data) {
    const { Ops, Sync } = data;
    const op_list = this.op_list(Ops.length);
    return {
      Ops: op_list.format(Ops),
      Sync: (new Bool()).format(Sync)
    };
  }
}

/* Events */

class Events extends JSONer {
  constructor (fetch) {
    super();

    const script = fetch('script');
    const dialogues = script.scheme.type.format(script.data);

    const event_script = new List({
      size: list => /^Return/.test((list[list.length - 1] || {}).name),
      type: new Fork({
        //foo: true, TODO: Remove handling from rom-builder
        control: new UInt(),
        map: {
          default: {
            name: 'Move Object',
            use_control: true,
            type: new Struct([{
              name: 'Object ID',
              type: new UInt()
            }, {
              name: 'Data',
              type: new ActionQueue()

            }])
          },
          0x35: {
            name: 'Unknown 0x35',
            type: object_arg
          },
          0x36: {
            name: 'Disable Passthrough',
            type: object_arg
          },
          0x37: {
            name: 'Assign Graphics',
            type: basic_args(['Object ID', 'Graphics'])
          },
          0x38: {
            name: 'Hold Screen',
            type: new Empty()
          },
          0x39: {
            name: 'Free Screen',
            type: new Empty()
          },
          0x3A: {
            name: 'Enable Movement',
            type: new Empty()
          },
          0x3B: {
            name: 'Party Ready Stance',
            type: new Empty()
          },
          0x3C: {
            name: 'Set Party',
            type: new List({
              size: 4,
              type: new UInt()
            })
          },
          0x3D: {
            name: 'Create Object',
            type: object_arg
          },
          0x3E: {
            name: 'Destroy Object',
            type: object_arg
          },
          0x3F: {
            name: 'Assign Character to Party',
            type: basic_args(['Party', 'Character'])
          },
          0x40: {
            name: 'Assign Properties to Character',
            type: basic_args(['Character', 'Properties'])
          },
          0x41: {
            name: 'Show Object',
            type: object_arg
          },
          0x42: {
            name: 'Hide Object',
            type: object_arg
          },
          0x43: {
            name: 'Assign Palette to Character',
            type: basic_args(['Character', 'Palette'])
          },
          0x44: {
            name: 'Place Character on Vehicle',
            type: basic_args(['Character', 'Vehicle'])
          },
          0x45: {
            name: 'Refresh Objects',
            type: new Empty()
          },
          0x46: {
            name: 'Make Party Active',
            type: basic_args(['Party'])
          },
          0x47: {
            name: 'Reset Lead Character',
            type: new Empty()
          },
          0x48: {
            name: 'Display Message',
            type: message_args
          },
          0x49: {
            name: 'Wait for Keypress',
            type: new Empty()
          },
          0x4A: {
            name: 'Unknown 0x4A',
            type: new Empty()
          },
          0x4B: {
            name: 'Display Message and Wait',
            type: new Custom({
              type: message_args,
              decoder: function (rom) {
                const value = this.type.decode(rom);
                const message = dialogues[value['Message ID']];
                const choices = message.match(/\[choice\]/g);
                if (choices) {
                  if (!rom._scratch) rom._scratch = {};
                  rom._scratch.choice_count = choices.length;
                }
                return value;
              }
            })
          },
          0x4C: {
            name: 'Invoke Battle (Centered)',
            type: battle_args
          },
          0x4D: {
            name: 'Invoke Battle',
            type: battle_args
          },
          0x4E: {
            name: 'Invoke Random Battle',
            type: new Empty()
          },
          0x4F: {
            name: 'Exit Location',
            type: new Empty()
          },
          0x50: {
            name: 'Tint Screen',
            type: basic_args(['Color'])
          },
          0x51: {
            name: 'Modify Background Color',
            type: basic_args(['Type', 'ColorLow', 'ColorHi'])
          },
          0x52: {
            name: 'Tint Characters',
            type: basic_args(['Color'])
          },
          0x53: {
            name: 'Modify Sprite Color',
            type: basic_args(['Type', 'ColorLow', 'ColorHi'])
          },
          0x54: {
            name: 'End Command Effects Modified Colors',
            type: new Empty()
          },
          0x55: {
            name: 'Flash Screen',
            type: color_args
          },
          0x56: {
            name: 'Increase Color',
            type: color_args
          },
          0x57: {
            name: 'Decrease Color',
            type: color_args
          },
          0x58: {
            name: 'Shake Screen',
            type: basic_args(['Data'])
          },
          0x59: {
            name: 'Unfade Screen',
            type: basic_args(['Speed'])
          },
          0x5A: {
            name: 'Fade Screen',
            type: basic_args(['Speed'])
          },
          0x5B: {
            name: 'Unknown 0x5B',
            type: new Empty()
          },
          0x5C: {
            name: 'Pause During Fade',
            type: new Empty()
          },
          0x5D: {
            name: 'Scroll Layer 1',
            type: basic_args(['Data-1', 'Data-2'])
          },
          0x5E: {
            name: 'Scroll Layer 2',
            type: basic_args(['Data-1', 'Data-2'])
          },
          0x5F: {
            name: 'Scroll Layer 3',
            type: basic_args(['Data-1', 'Data-2'])
          },
          0x60: {
            name: 'Change BG Layer Palette',
            type: basic_args(['Layer', 'Palette'])
          },
          0x61: {
            name: 'Colorize Range',
            type: basic_args(['A', 'B', 'C'])
          },
          0x62: {
            name: 'Mosaic Screen',
            type: basic_args(['A'])
          },
          0x63: {
            name: 'Spotlight',
            type: basic_args(['Radius'])
          },
          0x64: {
            name: 'Unknown 0x64',
            type: basic_args(['A', 'B'])
          },
          0x65: {
            name: 'Unknown 0x65',
            type: basic_args(['A', 'B'])
          },
          0x66: {
            name: 'Unknown 0x66',
            type: basic_args(['A', 'B', 'C', 'D'])
          },
          0x67: {
            name: 'Unknown 0x67',
            type: basic_args(['A', 'B', 'C', 'D'])
          },
          0x68: {
            name: 'Unknown 0x68',
            type: basic_args(['A', 'B', 'C', 'D'])
          },
          0x69: {
            name: 'Unknown 0x69',
            type: basic_args(['A', 'B', 'C', 'D'])
          },
          0x6A: {
            name: 'Load Map (after fade)', // TODO: Handle optional map scripting
            type: map_args
          },
          0x6B: {
            name: 'Load Map (instantly)', // TODO: Handle map scripting
            type: map_args
          },
          0x6C: {
            name: 'Load Parent Map',
            type: map_args
          },
          0x6D: {
            name: 'Unknown 0x6D',
            type: basic_args(['A'])
          },
          0x6E: {
            name: 'Unknown 0x6E',
            type: basic_args(['A', 'B'])
          },
          0x6F: {
            name: 'Unknown 0x6F',
            type: basic_args(['A', 'B', 'C', 'D', 'E'])
          },
          0x70: {
            name: 'Scroll Layer 1 - Alt',
            type: basic_args(['Data-1', 'Data-2'])
          },
          0x71: {
            name: 'Scroll Layer 2 - Alt',
            type: basic_args(['Data-1', 'Data-2'])
          },
          0x72: {
            name: 'Scroll Layer 3 - Alt',
            type: basic_args(['Data-1', 'Data-2'])
          },
          0x73: {
            name: 'Replace Tiles (instantly)',
            type: basic_args(['A', 'B', 'C', 'D'])
          },
          0x74: {
            name: 'Replace Tiles (wait)',
            type: basic_args(['A', 'B', 'C', 'D'])
          },
          0x75: {
            name: 'Refresh Map after Change',
            type: new Empty()
          },
          0x76: {
            name: 'Unknown 0x76',
            type: basic_args(['A', 'B'])
          },
          0x77: {
            name: 'Level Averaging',
            type: basic_args(['Character'])
          },
          0x78: {
            name: 'Enable Passthrough',
            type: basic_args(['Object ID'])
          },
          0x79: {
            name: 'Place Party on Map',
            type: new Struct([{
              name: 'Party',
              type: new UInt()
            }, {
              name: 'Map',
              type: map_id
            }])
          },
          0x7A: {
            name: 'Change Object Event Trigger',
            type: basic_args(['Object ID', 'Low', 'Hi', 'Bank'])
          },
          0x7B: {
            name: 'Activate Backup Party',
            type: new Empty()
          },
          0x7C: {
            name: 'Enable Event Activation',
            type: basic_args(['Object ID'])
          },
          0x7D: {
            name: 'Disable Event Activation',
            type: basic_args(['Object ID'])
          },
          0x7E: {
            name: 'Move Party',
            type: basic_args(['X', 'Y'])
          },
          0x7F: {
            name: 'Change Actor to Default Name',
            type: basic_args(['Actor Slot', 'Default Name'])
          },
          0x80: {
            name: 'Add Item to Inventory',
            type: basic_args(['Item'])
          },
          0x81: {
            name: 'Remove Item from Inventory',
            type: basic_args(['Item'])
          },
          0x82: {
            name: 'Store Backup Party',
            type: new Empty()
          },
          0x83: {
            name: 'Unknown 0x83',
            type: new Empty()
          },
          0x84: {
            name: 'Gain GP',
            type: new UInt('word')
          },
          0x85: {
            name: 'Lose GP',
            type: new UInt('word')
          },
          0x86: {
            name: 'Gain Esper',
            type: basic_args(['Esper'])
          },
          0x87: {
            name: 'Lose Esper',
            type: basic_args(['Esper'])
          },
          0x88: {
            name: 'Remove Statuses',
            type: basic_args(['Character', 'StatusMask-1', 'StatusMask-2'])
          },
          0x89: {
            name: 'Inflict Statuses',
            type: basic_args(['Character', 'StatusMask-1', 'StatusMask-2'])
          },
          0x8A: {
            name: 'Toggle Statuses',
            type: basic_args(['Character', 'StatusMask-1', 'StatusMask-2'])
          },
          0x8B: {
            name: 'Modify HP',
            type: basic_args(['Character', 'HP Change'])
          },
          0x8C: {
            name: 'Modify MP',
            type: basic_args(['Character', 'MP Change'])
          },
          0x8D: {
            name: 'Unequip Character',
            type: basic_args(['Character'])
          },
          0x8E: {
            name: 'Invoke Battle (monster-in-box)',
            type: new Empty()
          },
          0x8F: {
            name: 'Unlock all Bushido',
            type: new Empty()
          },
          0x90: {
            name: 'Learn Bum Rush',
            type: new Empty()
          },
          0x91: {
            name: 'Pause (15)',
            type: new Empty()
          },
          0x92: {
            name: 'Pause (30)',
            type: new Empty()
          },
          0x93: {
            name: 'Pause (45)',
            type: new Empty()
          },
          0x94: {
            name: 'Pause (60)',
            type: new Empty()
          },
          0x95: {
            name: 'Pause (120)',
            type: new Empty()
          },
          0x96: {
            name: 'Restore from Fade',
            type: new Empty()
          },
          0x97: {
            name: 'Fade to Black',
            type: new Empty()
          },
          0x98: {
            name: 'Invoke Name Change',
            type: basic_args(['Character'])
          },
          0x99: {
            name: 'Invoke Party Selection',
            type: basic_args(['How Many', 'Forced-A', 'Forced-B'])
          },
          0x9A: {
            name: 'Invoke Colosseum Menu',
            type: new Empty()
          },
          0x9B: {
            name: 'Invoke Shop',
            type: basic_args(['Shop ID'])
          },
          0x9C: {
            name: 'Optimize Equipment',
            type: basic_args(['Character'])
          },
          0x9D: {
            name: 'Invoke Final Battle Menu',
            type: new Empty()
          },
          0x9E: {
            name: 'Unknown 0x9E',
            type: new Empty()
          },
          0x9F: {
            name: 'Unknown 0x9F',
            type: new Empty()
          },
          0xA0: {
            name: 'Set Countdown Timer',
            type: basic_args(['A', 'B', 'C', 'D', 'E'])
          },
          0xA1: {
            name: 'Reset Timer',
            type: basic_args(['Timer ID'])
          },
          0xA2: {
            name: 'Unknown 0xA2',
            type: new Empty()
          },
          0xA3: {
            name: 'Unknown 0xA3',
            type: new Empty()
          },
          0xA4: {
            name: 'Unknown 0xA4',
            type: new Empty()
          },
          0xA5: {
            name: 'Unknown 0xA5',
            type: new Empty()
          },
          0xA6: {
            name: 'Delete Pyramids',
            type: new Empty()
          },
          0xA7: {
            name: 'Create Pyramid',
            type: basic_args(['Object ID'])
          },
          0xA8: {
            name: 'Floating Continent Ascends',
            type: new Empty()
          },
          0xA9: {
            name: 'Title Screen',
            type: new Empty()
          },
          0xAA: {
            name: 'Snowfield Intro',
            type: new Empty()
          },
          0xAB: {
            name: 'Game Loading Screen',
            type: new Empty()
          },
          0xAC: {
            name: 'Unknown 0xAC',
            type: new Empty()
          },
          0xAD: {
            name: 'End of World',
            type: new Empty()
          },
          0xAE: {
            name: 'Minecart Ride',
            type: new Empty()
          },
          0xAF: {
            name: 'Invoke Colosseum Battle',
            type: new Empty()
          },
          0xB0: {
            name: 'Start Loop',
            type: basic_args(['Iterator'])
          },
          0xB1: {
            name: 'End Loop',
            type: new Empty()
          },
          0xB2: {
            name: 'JSR',
            type: new UInt('sword')
          },
          0xB3: {
            name: 'JSR Loop',
            type: new Struct([{
              name: 'Iterator',
              type: new UInt()
            }, {
              name: 'Address',
              type: new UInt('sword')
            }])
          },
          0xB4: {
            name: 'Pause',
            type: basic_args(['Duration'])
          },
          0xB5: {
            name: 'Pause (15*Duration)',
            type: basic_args(['Duration'])
          },
          0xB6: {
            name: 'Dialogue Choice Branch',
            type: new Dynamic({
              get_type: (value, rom) => {
                return new List({
                  size: value ? value.length : rom._scratch.choice_count || 1,
                  type: new UInt('sword')
                });
              }
            })
          },
          0xB7: {
            name: 'Branch If Battle Bit',
            type: new Struct([{
              name: 'Bit ID',
              type: new UInt()
            }, {
              name: 'Address',
              type: new UInt('sword')
            }])
          },
          0xB8: {
            name: 'Set Battle Bit',
            type: basic_args(['Bit ID'])
          },
          0xB9: {
            name: 'Clear Battle Bit',
            type: basic_args(['Bit ID'])
          },
          0xBA: {
            name: 'Unknown 0xBA',
            type: basic_args(['A'])
          },
          0xBB: {
            name: 'Unknown 0xBB',
            type: new Empty()
          },
          0xBC: {
            name: 'If Event Bit, Return',
            type: new UInt('word')
          },
          0xBD: {
            name: 'Branch 50%',
            type: new UInt('sword')
          },
          0xBE: {
            name: 'Caseword Conditional Chain',
            type: new Struct([{
              name: 'Count',
              type: new Custom({
                type: new UInt(),
                decoder: function (rom) {
                  const value = this.type.decode(rom);
                  if (!rom._scratch) rom._scratch = {};
                  rom._scratch.chain_length = value;
                  return value;
                }
              })
            }, {
              name: 'Conditionals',
              type: new Dynamic({
                get_type: (data, rom, method) => {
                  return new List({
                    size: data ? data.length : rom._scratch.chain_length,
                    type: new Struct([{
                      name: 'Address',
                      type: new UInt('word')
                    }, {
                      name: 'Data',
                      type: new Bits([{
                        mask: 0x0F,
                        name: 'Bank',
                        type: new UInt()
                      }, {
                        mask: 0xF0,
                        name: 'Bit',
                        type: new UInt()
                      }])
                    }])
                  });
                }
              })
            }])
          },
          0xBF: {
            name: 'Ending Airship Cutscene',
            type: new Empty()
          },
          0xC0: {
            name: 'Branch if 1/1 Event Bits',
            type: event_bit_args(1)
          },
          0xC1: {
            name: 'Branch if 2/2 Event Bits',
            type: event_bit_args(2)
          },
          0xC2: {
            name: 'Branch if 3/3 Event Bits',
            type: event_bit_args(3)
          },
          0xC3: {
            name: 'Branch if 4/4 Event Bits',
            type: event_bit_args(4)
          },
          0xC4: {
            name: 'Branch if 5/5 Event Bits',
            type: event_bit_args(5)
          },
          0xC5: {
            name: 'Branch if 6/6 Event Bits',
            type: event_bit_args(6)
          },
          0xC6: {
            name: 'Branch if 7/7 Event Bits',
            type: event_bit_args(7)
          },
          0xC7: {
            name: 'Branch if 8/8 Event Bits',
            type: event_bit_args(8)
          },
          0xC8: {
            name: 'Branch if 1/1 Event Bits (dup)',
            type: event_bit_args(1)
          },
          0xC9: {
            name: 'Branch if 1/2 Event Bits',
            type: event_bit_args(2)
          },
          0xCA: {
            name: 'Branch if 1/3 Event Bits',
            type: event_bit_args(3)
          },
          0xCB: {
            name: 'Branch if 1/4 Event Bits',
            type: event_bit_args(4)
          },
          0xCC: {
            name: 'Branch if 1/5 Event Bits',
            type: event_bit_args(5)
          },
          0xCD: {
            name: 'Branch if 1/6 Event Bits',
            type: event_bit_args(6)
          },
          0xCE: {
            name: 'Branch if 1/7 Event Bits',
            type: event_bit_args(7)
          },
          0xCF: {
            name: 'Branch if 1/8 Event Bits',
            type: event_bit_args(8)
          },
          0xD0: {
            name: 'Set Event Bit ($1E80)',
            type: basic_args(['Bit ID'])
          },
          0xD1: {
            name: 'Clear Event Bit ($1E80)',
            type: basic_args(['Bit ID'])
          },
          0xD2: {
            name: 'Set Event Bit ($1EA0)',
            type: basic_args(['Bit ID'])
          },
          0xD3: {
            name: 'Clear Event Bit ($1EA0)',
            type: basic_args(['Bit ID'])
          },
          0xD4: {
            name: 'Set Event Bit ($1EC0)',
            type: basic_args(['Bit ID'])
          },
          0xD5: {
            name: 'Clear Event Bit ($1EC0)',
            type: basic_args(['Bit ID'])
          },
          0xD6: {
            name: 'Set Event Bit ($1EE0)',
            type: basic_args(['Bit ID'])
          },
          0xD7: {
            name: 'Clear Event Bit ($1EE0)',
            type: basic_args(['Bit ID'])
          },
          0xD8: {
            name: 'Set Event Bit ($1F00)',
            type: basic_args(['Bit ID'])
          },
          0xD9: {
            name: 'Clear Event Bit ($1F00)',
            type: basic_args(['Bit ID'])
          },
          0xDA: {
            name: 'Set Event Bit ($1F20)',
            type: basic_args(['Bit ID'])
          },
          0xDB: {
            name: 'Clear Event Bit ($1F20)',
            type: basic_args(['Bit ID'])
          },
          0xDC: {
            name: 'Set Event Bit ($1F40)',
            type: basic_args(['Bit ID'])
          },
          0xDD: {
            name: 'Clear Event Bit ($1F40)',
            type: basic_args(['Bit ID'])
          },
          0xDE: {
            name: 'Load Caseword (active party)',
            type: new Empty()
          },
          0xDF: {
            name: 'Load Caseword (new character)',
            type: new Empty()
          },
          0xE0: {
            name: 'Load Caseword (encountered characters)',
            type: new Empty()
          },
          0xE1: {
            name: 'Load Caseword (controlled characters)',
            type: new Empty()
          },
          0xE2: {
            name: 'Load Caseword (party leader)',
            type: new Empty()
          },
          0xE3: {
            name: 'Load Caseword (available characters)',
            type: new Empty()
          },
          0xE4: {
            name: 'Load Caseword (active party)',
            type: new Empty()
          },
          0xE5: {
            name: 'Unknown 0xE5',
            type: new Empty()
          },
          0xE6: {
            name: 'Unknown 0xE6',
            type: new Empty()
          },
          0xE7: {
            name: 'Show Portrait',
            type: basic_args(['Character'])
          },
          0xE8: {
            name: 'Set Word',
            type: basic_args(['Word Index', 'Lo', 'Hi'])
          },
          0xE9: {
            name: 'Increment Word',
            type: basic_args(['Word Index', 'Lo', 'Hi'])
          },
          0xEA: {
            name: 'Decrement Word',
            type: basic_args(['Word Index', 'Lo', 'Hi'])
          },
          0xEB: {
            name: 'Compare Word',
            type: basic_args(['Word Index', 'Lo', 'Hi'])
          },
          0xEC: {
            name: 'Unknown 0xEC',
            type: new Empty()
          },
          0xED: {
            name: 'Unknown 0xED',
            type: basic_args(['A', 'B', 'C'])
          },
          0xEE: {
            name: 'Unknown 0xEE',
            type: new Empty()
          },
          0xEF: {
            name: 'Play Song',
            type: basic_args(['Song ID', 'Volume'])
          },
          0xF0: {
            name: 'Play Song (full volume)',
            type: basic_args(['Song ID'])
          },
          0xF1: {
            name: 'Fade in Song',
            type: basic_args(['Song ID', 'Transition Time'])
          },
          0xF2: {
            name: 'Fade out Current Song',
            type: basic_args(['Transition Time'])
          },
          0xF3: {
            name: 'Fade in Current Song',
            type: basic_args(['Transition Time'])
          },
          0xF4: {
            name: 'Play Sound (simple)',
            type: basic_args(['Sound ID'])
          },
          0xF5: {
            name: 'Play Sound',
            type: basic_args(['Sound ID', 'Transition Time', 'Pan'])
          },
          0xF6: {
            name: 'Modify Song',
            type: basic_args(['A', 'B', 'C'])
          },
          0xF7: {
            name: 'End Song Loop',
            type: new Empty()
          },
          0xF8: {
            name: 'Unknown 0xF8',
            type: new Empty()
          },
          0xF9: {
            name: 'Pause until Music Marking',
            type: basic_args(['Marking'])
          },
          0xFA: {
            name: 'Stop Song',
            type: new Empty()
          },
          0xFB: {
            name: 'Add Echo to Sound',
            type: new Empty()
          },
          0xFC: {
            name: 'Unknown 0xFC',
            type: new Empty()
          },
          0xFD: {
            name: 'NOP',
            type: new Empty()
          },
          0xFE: {
            name: 'Return',
            type: new Empty()
          },
          0xFF: {
            name: 'Return All',
            type: new Empty()
          }
        }
      })
    });

    this.type = new Reader({
      offset: 0xCA009D, // TODO: Fix issue with early partial scripts
      type: new List({
        size: list => {
          const last_script = list[list.length - 1];
          const last_op = last_script && last_script[last_script.length - 1];
          return last_op && last_op.name === 'Return All';
        },
        type: event_script
      })
    });
  }
}

module.exports = Events;
