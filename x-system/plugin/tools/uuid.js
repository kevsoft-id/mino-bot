'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../settings');
const crypto   = require('crypto');

module.exports = {
  commands:    ['uuid', 'nanoid', 'genid'],
  category:    'Tools',
  description: 'Generate UUID v4 / NanoID acak 🆔',
  usage:       '.uuid  |  .uuid 5  |  .uuid nano',

  async handler(sock, m, { args, reply }) {
    const { theme } = settings;
    const isNano = args[0] === 'nano';
    const count  = Math.min(parseInt(args.find(a => /^\d+$/.test(a))) || 5, 20);

    function nanoid(n = 21) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
      return Array.from(crypto.randomBytes(n)).map(b => chars[b % 64]).join('');
    }

    const ids = Array.from({ length: count }, () =>
      isNano ? nanoid(21) : crypto.randomUUID()
    );

    return reply([
      theme.header, '',
      ` ⬡  🆔  ${theme.bold(isNano ? 'NANOID GENERATOR' : 'UUID v4 GENERATOR')}`, '',
      ...ids.map((id, i) => `  ${i + 1}. \`${id}\``),
      '',
      `  💡 .uuid nano  — untuk format NanoID (21 char)`,
      `  💡 .uuid 10    — generate 10 UUID sekaligus`,
      '', theme.footer,
    ].join('\n'));
  },
};
