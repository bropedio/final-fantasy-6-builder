"use strict";

const {
  Closure,
  Reader,
  List,
  Struct,
  UInt,
  Bool,
  Bits,
  Enum
} = require('rom-builder').types;

const SplitList = require('./split_list');

/* NPCs */

const sprite = new Enum({
  0x00: 'Terra',
  0x01: 'Locke',
  0x02: 'Cyan',
  0x03: 'Shadow',
  0x04: 'Edgar',
  0x05: 'Sabin',
  0x06: 'Celes',
  0x07: 'Strago',
  0x08: 'Relm',
  0x09: 'Setzer',
  0x0A: 'Mog',
  0x0B: 'Gau',
  0x0C: 'Gogo',
  0x0D: 'Umaro',
  0x0E: 'Imperial Soldier',
  0x0F: 'Imp',
  0x10: 'General Leo',
  0x11: 'Duncan, Banon',
  0x12: 'Esper Terra',
  0x13: 'Doma Guard, Merchant',
  0x14: 'Ghost',
  0x15: 'Kefka',
  0x16: 'Emperor Gestahl',
  0x17: 'Gau\'s Father, Gungho, Mayor of Thamasa, Elder of Narshe',
  0x18: 'Auctioneer, Young Man, Duane',
  0x19: 'Dog',
  0x1A: 'Celes as Maria, Statue of the Queen',
  0x1B: 'Maestro, Scholar, Prince Ralse, Scholar',
  0x1C: 'Draco',
  0x1D: 'Arvis',
  0x1E: 'Returner, Airship Crew, Guy with Goggles',
  0x1F: 'Ultros',
  0x20: 'Dressed-Up Gau',
  0x21: 'South Figaro Dancer, Dancer/Young Woman',
  0x22: 'Figaro Chancellor, Heavily-Armored Guy in Opera',
  0x23: 'Clyde',
  0x24: 'Old Woman, Old Woman, Matron of Figaro',
  0x25: 'Lola, Young Woman, Elayne/Madonna',
  0x26: 'Young Boy, Owain',
  0x27: 'Young Girl',
  0x28: 'Bird',
  0x29: 'Rachel',
  0x2A: 'Katarin',
  0x2B: 'Opera Impresario',
  0x2C: 'Esper Elder',
  0x2D: 'Yura',
  0x2E: 'Sigfried',
  0x2F: 'Cid',
  0x30: 'Maduin',
  0x31: 'Baram, Pirate',
  0x32: 'Vargas, Dadaluma',
  0x33: 'Sr Behemoth, Vomammoth',
  0x34: 'Narshe Guard',
  0x35: 'Train Conductor',
  0x36: 'Older Shopkeeper / Sailor',
  0x37: 'Esper Fairy',
  0x38: 'Esper Wolf, Lone Wolf',
  0x39: 'Dragon',
  0x3A: 'Fish',
  0x3B: 'Opera Guard, Figaro Guard',
  0x3C: 'Daryl',
  0x3D: 'Hidon, Chupon',
  0x3E: 'Gestahl\'s Royal Guard, Cultist, Wrexsoul',
  0x3F: 'Ramuh',
  0x40: 'Figaro Guard - Riding Sprite',
  0x41: 'Celes chained',
  0x42: 'Gau dressed red and surprised',
  0x43: 'Gau dressed blue and surprised',
  0x44: 'King of Doma (dead)',
  0x45: 'Inferno',
  0x46: 'Enemy Esper of Odin (top half)',
  0x47: 'Skull Torch/Statue',
  0x48: 'Ifrit',
  0x49: 'Phantom',
  0x4A: 'Shiva',
  0x4B: 'Unicorn',
  0x4C: 'Bismark',
  0x4D: 'Carbunkl',
  0x4E: 'Shoat',
  0x4F: 'Owzer, left half',
  0x50: 'Owzer, right half',
  0x51: 'Airship',
  0x52: 'Figaro Guard (lying)',
  0x53: 'Number 024',
  0x54: 'Painting Frame, Chest',
  0x55: 'Enemy Esper of Odin (bottom half)',
  0x56: 'Atma',
  0x57: 'Statue',
  0x58: 'Flower bouquet',
  0x59: 'Envelope',
  0x5A: 'Plant',
  0x5B: 'Magicite',
  0x5C: 'Instruction Book',
  0x5D: 'Baby',
  0x5E: 'Question Mark',
  0x5F: 'Exclamation Point',
  0x60: 'Slave Crown',
  0x61: '4-Ton Weight',
  0x62: 'Bird with a bandana',
  0x63: 'Eyes in the Dark',
  0x64: 'Bandana',
  0x65: 'Invisible Wall/Event trigger',
  0x66: 'Bird flying left',
  0x67: 'Bird flying up',
  0x68: 'Security checkpoint',
  0x69: 'Three small sparkles',
  0x6A: 'Sparkling chest',
  0x6B: 'Setzer\'s Coin',
  0x6C: 'Rat',
  0x6D: 'Turtle',
  0x6E: 'Flying bird',
  0x6F: 'Save Point',
  0x70: 'Flame',
  0x71: 'Explosion',
  0x72: 'Leaf 1 (Tentacle boss)',
  0x73: 'Leaf 2 (Tentacle boss)',
  0x74: 'Big Switch',
  0x75: 'Floor Switch/Teleport',
  0x76: 'Rock',
  0x77: 'Crane Hook C',
  0x78: 'Elevator',
  0x79: 'Flying Esper Terra, left part',
  0x7A: 'Null',
  0x7B: 'Terra with hair flying in wind, lower part',
  0x7C: 'Diving Helmet',
  0x7D: 'Guardian A',
  0x7E: 'Guardian B',
  0x7F: 'Guardian C',
  0x80: 'Crane Hook B',
  0x81: 'Guardian D',
  0x82: 'Guardian E',
  0x83: 'Guardian F',
  0x84: 'Crane Hook A',
  0x85: 'Magitek Factory Machine',
  0x86: 'Sealed Gate A',
  0x87: 'Sealed Gate B',
  0x88: 'Sealed Gate C',
  0x89: 'Imperial Air Force',
  0x8A: 'Leo\'s Sword',
  0x8B: 'Magitek Train Car A',
  0x8C: 'Magitek Train Car B',
  0x8D: 'Magitek Train Car C',
  0x8E: 'Magitek Train Car D',
  0x8F: 'Crane\'s on Imperial Castle A',
  0x90: 'Crane\'s on Imperial Castle B',
  0x91: 'Crane\'s on Imperial Castle C',
  0x92: 'Owzer\'s possessed painting A',
  0x93: 'Owzer\'s possessed painting B',
  0x94: 'Owzer\'s possessed painting C',
  0x95: 'Falcon A',
  0x96: 'Falcon B',
  0x97: 'Falcon C',
  0x98: 'Flying Esper Terra, right part',
  0x99: 'Tritoch',
  0x9A: 'Odin',
  0x9B: 'Goddess',
  0x9C: 'Fiend',
  0x9D: 'Demon',
  0x9E: 'Goddess bottom left',
  0x9F: 'Goddess bottom right',
  0xA0: 'Demon/Fiend bottom A',
  0xA1: 'Demon/Fiend bottom B',
  0xA2: 'Terra with hair flying in wind, upper part',
  0xA3: 'Terra with hair flying in wind, tiny right part',
  0xA4: 'Bird flying sideways'
});

// TODO: Eventually, this should nest inside "maps.js"
class NPCs extends Closure {
  constructor (fetch) {
    super();

    this.type = new Reader({
      offset: 0xC41A10,
      warn: 0xC46AC0, // Spell Data starts here
      type: new SplitList({
        size: 0x1A0,
        chunk_size: 9,
        offset: 0x1A0 * 2 + 2,
        type: new Struct([{
          name: 'Event Address',
          type: new UInt('word')
        }, {
          name: 'Event Misc',
          type: new Bits([{
            mask: 0x0003,
            name: 'Event Bank',
            type: new UInt()
          }, {
            mask: 0x001C,
            name: 'Palette',
            type: new UInt()
          }, {
            mask: 0x0020,
            name: 'Background Scrolls',
            type: new Bool()
          }, {
            mask: 0xFFC0,
            name: 'Visibility Event Bit',
            type: new UInt('word')
          }])
        }, {
          name: 'Position Data',
          type: new Bits([{
            mask: 0x007F,
            name: 'X Position',
            type: new UInt()
          }, {
            mask: 0x0080,
            name: 'Show rider in vehicle',
            type: new Bool()
          }, {
            mask: 0x3F00,
            name: 'Y Position',
            type: new UInt()
          }, {
            mask: 0xC000,
            name: 'Speed',
            type: new UInt()
          }])
        }, {
          name: 'Sprite',
          type: sprite
        }, {
          name: 'Miscellaneous',
          type: new Bits([{
            mask: 0x000F,
            name: 'Movement Type',
            type: new UInt()
          }, {
            mask: 0x0030,
            name: 'Map Layer',
            type: new UInt()
          }, {
            mask: 0x00C0,
            name: 'Vehicle',
            type: new UInt()
          }, {
            mask: 0x0300,
            name: 'Start Direction',
            type: new UInt()
          }, {
            mask: 0x0400,
            name: 'No Graphic Change',
            type: new Bool()
          }, {
            mask: 0x1800,
            name: 'Background Layer',
            type: new UInt()
          }, {
            mask: 0x2000,
            name: 'Unknown 0x20',
            type: new Bool()
          }, {
            mask: 0x4000,
            name: 'Mirror',
            type: new Bool()
          }, {
            mask: 0x8000,
            name: 'Unknown 0x80',
            type: new Bool()
          }])
        }])
      })
    });
  }
}

module.exports = NPCs;
