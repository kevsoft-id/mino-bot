'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../set/settings');
const { replyList } = require('../../../lib/utils');

// ─── Unicode font map table ──────────────────────────────────
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const FONTS = {
  bold:        '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵',
  italic:      '𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡',
  bolditalic:  '𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿',
  mono:        '𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿',
  script:      '𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏0123456789',
  fraktur:     '𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷0123456789',
  doublestruck:'𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡',
};
const FONT_LABELS = {
  bold:         '𝗕𝗼𝗹𝗱 Sans-Serif',
  italic:       '𝘐𝘵𝘢𝘭𝘪𝘤',
  bolditalic:   '𝙈𝙤𝙣𝙤𝙨𝙥𝙖𝙘𝙚',
  mono:         '𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎',
  script:       '𝒮𝒸𝓇𝒾𝓅𝓉',
  fraktur:      '𝔉𝔯𝔞𝔨𝔱𝔲𝔯',
  doublestruck: '𝔻𝕠𝕦𝕓𝕝𝕖-𝕊𝕥𝕣𝕦𝕔𝕜',
};

function convert(text, fontKey) {
  const map = FONTS[fontKey];
  if (!map) return text;
  // NOTE: font glyphs are astral (surrogate-pair) code points — split/index
  // by code point via Array.from, not String.split(''), or output garbles.
  const glyphs = Array.from(map);
  return Array.from(text).map(c => {
    const i = ALPHA.indexOf(c);
    return i >= 0 ? glyphs[i] : c;
  }).join('');
}

// Extra styles using decoration chars
function vaporwave(text) {
  return text.split('').map(c => {
    const code = c.charCodeAt(0);
    if (code >= 33 && code <= 126) return String.fromCharCode(code + 0xFEE0);
    if (code === 32) return '\u3000';
    return c;
  }).join('');
}
function zalgo(text) {
  const z = ['̈','̣','̤','̥','̦','̟','͆','̽','̾','̿','̀','́','͂','̃'];
  return text.split('').map(c => c + z[Math.floor(Math.random() * z.length)] + z[Math.floor(Math.random() * z.length)]).join('');
}
function bubble(text) {
  const b = 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ';
  const B = 'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ';
  return text.split('').map(c => {
    if (c >= 'a' && c <= 'z') return b[c.charCodeAt(0) - 97];
    if (c >= 'A' && c <= 'Z') return B[c.charCodeAt(0) - 65];
    return c;
  }).join('');
}

const ALL_STYLES = [
  { key: 'bold',         fn: t => convert(t, 'bold'),         label: '𝗕𝗼𝗹𝗱' },
  { key: 'italic',       fn: t => convert(t, 'italic'),       label: '𝘐𝘵𝘢𝘭𝘪𝘤' },
  { key: 'mono',         fn: t => convert(t, 'mono'),         label: '𝙼𝚘𝚗𝚘' },
  { key: 'script',       fn: t => convert(t, 'script'),       label: '𝒮𝒸𝓇𝒾𝓅𝓉' },
  { key: 'fraktur',      fn: t => convert(t, 'fraktur'),      label: '𝔉𝔯𝔞𝔨𝔱𝔲𝔯' },
  { key: 'doublestruck', fn: t => convert(t, 'doublestruck'), label: '𝔻𝕠𝕦𝕓𝕝𝕖' },
  { key: 'vaporwave',    fn: vaporwave,                        label: 'Ｖａｐｏｒ' },
  { key: 'bubble',       fn: bubble,                           label: 'ⓑⓤⓑⓑⓛⓔ' },
  { key: 'zalgo',        fn: zalgo,                            label: 'Z̸a̶l̸g̵o̷' },
];

module.exports = {
  commands:    ['fonts', 'font', 'aesthetic', 'fancy'],
  category:    'Fun',
  description: 'Convert teks ke berbagai gaya font Unicode keren ✨',
  usage:       '.fonts <teks>  |  .fonts bold <teks>',

  async handler(sock, m, { args, text, reply }) {
    const { theme } = settings;
    if (!text) return reply('❓ Contoh:\n  .fonts Hello World\n  .fonts bold Hello');

    const styleArg = ALL_STYLES.find(s => s.key === args[0]?.toLowerCase());
    const inputText = styleArg ? args.slice(1).join(' ') : text;

    if (!inputText) return reply('❓ Masukkan teks yang ingin diubah.');

    if (styleArg) {
      return reply([
        theme.header, '',
        ` ⬡  ✨  ${theme.bold('FONT CONVERTER')}`, '',
        `  🔤 Original  : ${inputText}`,
        `  ✨ ${styleArg.label.padEnd(10)}: ${styleArg.fn(inputText)}`,
        '', theme.footer,
      ].join('\n'));
    }

    // Show all styles
    const lines = [
      theme.header, '',
      ` ⬡  ✨  ${theme.bold('FONT CONVERTER')}`, '',
      `  🔤 ${theme.bold('Input:')} ${inputText}`,
      '', theme.div, '',
    ];
    for (const s of ALL_STYLES) {
      lines.push(`  ${s.label.padEnd(14)}: ${s.fn(inputText)}`);
    }
    lines.push('', theme.footer);
    return reply(lines.join('\n'));
  },
};
