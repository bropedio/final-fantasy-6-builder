"use strict";

class LZSS {
  constructor (input) {
    this.type = input.type;
  }
  decode (rom) {
    const end_offset = rom.offset() + rom.read('word');
    const dictionary = new Uint8Array(0x800);
    const data = [];

    function add_data (value) {
      const dictionary_index = (data.length + 0x7DE) & 0x7FF;
      dictionary[dictionary_index] = value;
      data.push(value);
    }

    let control, counter;

    while (rom.offset() < end_offset) {
      if (!counter) {
        control = rom.read();
        counter = 8;
      }

      if (control & 0x01) {
        add_data(rom.read());
      } else {
        let info = rom.read('word');
        let match_index = info & 0x7FF;
        let match_length = (info >>> 11) + 3;

        while (match_length--) {
          add_data(dictionary[match_index & 0x7FF]);
          match_index++;
        }
      }

      control >>>= 1;
      counter--;
    }

    return data;
  }
  encode (source_data, rom) {
    const length_offset = rom.offset();
    rom.offset(rom.offset() + 2);

    const buffer_offset = 0x7DE;
    const dictionary = new Uint8Array(0x800 + source_data.length);

    dictionary.set(source_data, 0x800);
    let dictionary_index = 0x800;
    let control_offset, control, bitmask;
    refresh_control();

    function refresh_control () {
      control_offset = rom.offset();
      control = 0x00;
      bitmask = 0x01;
    }

    function write_control () {
      rom.jsr(control_offset, () => rom.write(control));
    }

    function next_bit (on) {
      if (on) {
        control |= bitmask;
      }

      if (bitmask === 0x80) {
        write_control();
        refresh_control();
      } else {
        bitmask <<= 1;
      }
    }

    while (dictionary_index < dictionary.length) {
      let best_match_length = 2;
      let best_match_index = null;
      let max_length = Math.min(34, dictionary.length - dictionary_index);

      for (let shift = 1; shift <= 0x800; shift++) {
        let match_length = 0;

        while (match_length <= max_length) {
          let source_byte = dictionary[dictionary_index + match_length];
          let match_byte = dictionary[dictionary_index + match_length - shift];
          if (source_byte !== match_byte) break;

          match_length++;
        }

        if (match_length > best_match_length) {
          best_match_length = match_length;
          best_match_index = dictionary_index - shift;
        }
      }

      if (best_match_index != null) {
        let stored_length = best_match_length - 3;
        let real_match_index = (best_match_index + buffer_offset) & 0x7FF;
        let info = (stored_length << 11) | real_match_index;
        rom.write(info, 'word');
        next_bit(false);
        dictionary_index += best_match_length;
      } else {
        rom.write(dictionary[dictionary_index]);
        next_bit(true);
        dictionary_index += 1;
      }
    }

    if (bitmask !== 0x01) {
      write_control();
    }

    const full_length = rom.offset() - length_offset;
    rom.jsr(length_offset, () => rom.write(full_length, 'word'));
  }
  parse (json) {
    return this.type.parse(json);
  }
  format (data) {
    return this.type.format(data);
  }
}

module.exports = LZSS;
