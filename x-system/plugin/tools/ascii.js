'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../set/settings');

// Simple ASCII art generator using block characters
const BLOCK_CHARS = {
  A: ['▄█▄', '█ █', '███', '█ █', '█ █'],
  B: ['██ ', '█ █', '██ ', '█ █', '██ '],
  C: [' ██', '█  ', '█  ', '█  ', ' ██'],
  D: ['██ ', '█ █', '█ █', '█ █', '██ '],
  E: ['███', '█  ', '██ ', '█  ', '███'],
  F: ['███', '█  ', '██ ', '█  ', '█  '],
  G: [' ██', '█  ', '█ █', '█ █', ' ██'],
  H: ['█ █', '█ █', '███', '█ █', '█ █'],
  I: ['███', ' █ ', ' █ ', ' █ ', '███'],
  J: ['███', '  █', '  █', '█ █', ' █ '],
  K: ['█ █', '██ ', '█  ', '██ ', '█ █'],
  L: ['█  ', '█  ', '█  ', '█  ', '███'],
  M: ['█ █', '███', '█ █', '█ █', '█ █'],
  N: ['█ █', '██ ', '███', ' ██', '█ █'],
  O: [' █ ', '█ █', '█ █', '█ █', ' █ '],
  P: ['██ ', '█ █', '██ ', '█  ', '█  '],
  Q: [' █ ', '█ █', '█ █', '███', ' ██'],
  R: ['██ ', '█ █', '██ ', '█ █', '█ █'],
  S: [' ██', '█  ', ' █ ', '  █', '██ '],
  T: ['███', ' █ ', ' █ ', ' █ ', ' █ '],
  U: ['█ █', '█ █', '█ █', '█ █', ' █ '],
  V: ['█ █', '█ █', '█ █', ' █ ', ' █ '],
  W: ['█ █', '█ █', '█ █', '███', '█ █'],
  X: ['█ █', ' █ ', ' █ ', ' █ ', '█ █'],
  Y: ['█ █', '█ █', ' █ ', ' █ ', ' █ '],
  Z: ['███', '  █', ' █ ', '█  ', '███'],
  '0': [' █ ', '█ █', '█ █', '█ █', ' █ '],
  '1': [' █ ', '██ ', ' █ ', ' █ ', '███'],
  '2': [' █ ', '█ █', '  █', ' █ ', '███'],
  '3': ['██ ', '  █', ' █ ', '  █', '██ '],
  '4': ['█ █', '█ █', '███', '  █', '  █'],
  '5': ['███', '█  ', '██ ', '  █', '██ '],
  '6': [' █ ', '█  ', '██ ', '█ █', ' █ '],
  '7': ['███', '  █', ' █ ', '█  ', '█  '],
  '8': [' █ ', '█ █', ' █ ', '█ █', ' █ '],
  '9': [' █ ', '█ █', ' ██', '  █', ' █ '],
  ' ': ['   ', '   ', '   ', '   ', '   '],
  '!': [' █ ', ' █ ', ' █ ', '   ', ' █ '],
  '?': ['██ ', '  █', ' █ ', '   ', ' █ '],
};

function textToAscii(text) {
  const chars = text.toUpperCase().split('').slice(0, 10);
  const rows  = ['', '', '', '', ''];
  for (const ch of chars) {
    const art = BLOCK_CHARS[ch] || BLOCK_CHARS['?'];
    for (let i = 0; i < 5; i++) {
      rows[i] += (art[i] || '   ') + ' ';
    }
  }
  return rows.join('\n');
}

const BIG_STYLES = {
  block: (t) => textToAscii(t),
  // NOTE: target glyphs are astral (surrogate-pair) code points — must
  // iterate/index by code point via Array.from, not String.split(''),
  // or the mapping desyncs and produces "�" garbage.
  bold:  (t) => Array.from(t).map(c => {
    const map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const uni = Array.from('𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵');
    const i = map.indexOf(c);
    return i >= 0 ? uni[i] : c;
  }).join(''),
  italic: (t) => Array.from(t).map(c => {
    const map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const uni = Array.from('𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻');
    const i = map.indexOf(c);
    return i >= 0 ? uni[i] : c;
  }).join(''),
};

module.exports = {
  commands:    ['ascii', 'asciifont', 'bigtext', 'textart'],
  category:    'Tools',
  description: 'Konversi teks ke ASCII art / font unik',
  usage:       '.ascii {teks}  |  .ascii block {teks}  |  .ascii bold {teks}  |  .ascii italic {teks}',

  async handler(sock, m, { args, text, reply, react }) {
    const { theme } = settings;

    if (!text) {
      return reply([
        theme.header, '',
        ` ⬡  🎨  ${theme.bold('ASCII ART GENERATOR')}`, '',
        `    ${theme.bullet} .ascii {teks}          → block art`,
        `    ${theme.bullet} .ascii bold {teks}     → huruf tebal`,
        `    ${theme.bullet} .ascii italic {teks}   → huruf miring`,
        `    ${theme.bullet} .ascii block {teks}    → blok besar`,
        '',
        `    📝 Contoh: .ascii KEVSOFT`,
        `    📝 Contoh: .ascii bold MinoBot`,
        '',
        theme.footer,
      ].join('\n'));
    }

    const styles = ['block', 'bold', 'italic'];
    let style  = 'block';
    let phrase = text;

    if (styles.includes(args[0]?.toLowerCase())) {
      style  = args[0].toLowerCase();
      phrase = args.slice(1).join(' ');
    }

    if (!phrase) return reply('❓ Masukkan teks setelah style\nContoh: .ascii bold HELLO');
    if (phrase.length > 15 && style === 'block') {
      phrase = phrase.slice(0, 15);
    }

    await react('🎨');

    const result = BIG_STYLES[style](phrase);

    await reply([
      `🎨 *ASCII ART — ${style.toUpperCase()}*`,
      ``,
      `\`\`\``,
      result,
      `\`\`\``,
      ``,
      settings.footer,
    ].join('\n'));
  },
};
