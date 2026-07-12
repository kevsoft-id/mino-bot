'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../set/settings');

// ── Morse code table ──────────────────────────────────────────
const MORSE = {
  A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',
  J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',
  S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',
  '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....',
  '6':'-....','7':'--...','8':'---..','9':'----.','.':'.-.-.-',',':'--..--',
  '?':'..--..','!':'-.-.--','/':'-..-.','@':'.--.-.','&':'.-...',
};
const MORSE_REV = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

function toMorse(text) {
  return text.toUpperCase().split('').map(c => {
    if (c === ' ') return '   ';
    return MORSE[c] || c;
  }).join(' ');
}
function fromMorse(text) {
  return text.split('   ').map(word =>
    word.split(' ').map(code => MORSE_REV[code] || '?').join('')
  ).join(' ');
}
function toBinary(text) {
  return text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
}
function fromBinary(text) {
  return text.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('');
}
function toHex(text) {
  return text.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
}
function fromHex(text) {
  return text.split(' ').map(h => String.fromCharCode(parseInt(h, 16))).join('');
}
function toReverse(text) { return text.split('').reverse().join(''); }
function toROT13(text) {
  return text.replace(/[a-zA-Z]/g, c => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

const MODES = {
  morse:    { enc: toMorse,   dec: fromMorse, name: 'Morse Code' },
  binary:   { enc: toBinary,  dec: fromBinary, name: 'Binary' },
  hex:      { enc: toHex,     dec: fromHex,    name: 'Hexadecimal' },
  reverse:  { enc: toReverse, dec: toReverse,  name: 'Reverse' },
  rot13:    { enc: toROT13,   dec: toROT13,    name: 'ROT-13 Cipher' },
};

module.exports = {
  commands:    ['encode', 'decode', 'morse', 'binary', 'cipher'],
  category:    'Tools',
  description: 'Encode/decode Morse, Binary, Hex, ROT-13, Reverse 🔐',
  usage:       '.encode morse <teks>  |  .decode binary <teks>',

  async handler(sock, m, { command, args, reply }) {
    const { theme } = settings;
    const isDecode = ['decode', 'dec'].includes(command);
    const modeArg  = args[0]?.toLowerCase();
    const mode     = MODES[modeArg] || MODES[command];
    const input    = mode ? args.slice(1).join(' ') : args.join(' ');

    if (!input) {
      const list = Object.entries(MODES).map(([k, v]) => `  .encode ${k} <teks>`).join('\n');
      return reply([`🔐 *Encode/Decode Tool*`, '', list, '', settings.footer].join('\n'));
    }

    if (!mode) {
      return reply(`❓ Mode tidak dikenal.\nMode tersedia: ${Object.keys(MODES).join(', ')}`);
    }

    let result;
    try { result = isDecode ? mode.dec(input) : mode.enc(input); }
    catch { return reply('❌ Gagal memproses. Periksa input kamu.'); }

    return reply([
      theme.header, '',
      ` ⬡  🔐  ${theme.bold((isDecode ? 'DECODE ' : 'ENCODE ') + mode.name.toUpperCase())}`, '',
      `  📥 Input : ${input.slice(0, 200)}`,
      `  📤 Output: ${result.slice(0, 1000)}`,
      '', theme.footer,
    ].join('\n'));
  },
};
