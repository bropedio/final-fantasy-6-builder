/* Final Fantasy 6 Builder */

const { build_short } = require('rom-builder');
const action = process.argv[2];
const rom_path = process.argv[3] || './roms/test.sfc';
return build_short(action, rom_path);
