'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../settings');

module.exports = {
  commands:    ['base64', 'b64'],
  category:    'Tools',
  description: 'Encode / decode Base64 teks 🔐',
  usage:       '.base64 encode <teks>  |  .base64 decode <teks>',

  async handler(sock, m, { args, reply }) {
    const { theme } = settings;
    const mode = args[0]?.toLowerCase();
    const input = args.slice(1).join(' ');

    if (!mode || !['encode', 'decode', 'enc', 'dec', 'e', 'd'].includes(mode) || !input) {
      return reply([
        `🔐 *Base64 Tool*`,
        ``,
        `Encode: .base64 encode <teks>`,
        `Decode: .base64 decode <teks>`,
        ``,
        settings.footer,
      ].join('\n'));
    }

    const isEncode = ['encode', 'enc', 'e'].includes(mode);
    let result;
    try {
      result = isEncode
        ? Buffer.from(input, 'utf8').toString('base64')
        : Buffer.from(input, 'base64').toString('utf8');
    } catch {
      return reply('❌ Input tidak valid untuk decode Base64.');
    }

    return reply([
      theme.header, '',
      ` ⬡  🔐  ${theme.bold('BASE64 ' + (isEncode ? 'ENCODE' : 'DECODE'))}`, '',
      `  📥 ${theme.bold('Input')} :`,
      `  ${input.slice(0, 200)}`,
      '',
      `  📤 ${theme.bold('Output')}:`,
      `  ${result.slice(0, 1000)}`,
      '', theme.footer,
    ].join('\n'));
  },
};
