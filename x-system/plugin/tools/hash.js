'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../settings');
const crypto   = require('crypto');

module.exports = {
  commands:    ['hash', 'enkripsi'],
  category:    'Tools',
  description: 'Hash teks dengan MD5 / SHA1 / SHA256 / SHA512 🔒',
  usage:       '.hash <teks>  |  .hash sha256 <teks>',

  async handler(sock, m, { args, reply }) {
    const { theme } = settings;
    const ALGOS = ['md5', 'sha1', 'sha256', 'sha512'];
    const algoArg = args[0]?.toLowerCase();
    const isSingle = ALGOS.includes(algoArg);
    const input    = isSingle ? args.slice(1).join(' ') : args.join(' ');

    if (!input) return reply(`❓ Contoh:\n  .hash Hello World\n  .hash sha256 Hello World`);

    if (isSingle) {
      const result = crypto.createHash(algoArg).update(input).digest('hex');
      return reply([
        theme.header, '',
        ` ⬡  🔒  ${theme.bold('HASH ' + algoArg.toUpperCase())}`, '',
        `  📥 Input  : ${input.slice(0, 100)}`,
        `  🔑 Result : ${result}`,
        '', theme.footer,
      ].join('\n'));
    }

    const lines = [theme.header, '', ` ⬡  🔒  ${theme.bold('HASH GENERATOR')}`, '',
      `  📥 ${theme.bold('Input:')} ${input.slice(0, 80)}`, '', theme.div, ''];
    for (const algo of ALGOS) {
      const h = crypto.createHash(algo).update(input).digest('hex');
      lines.push(`  ${theme.bullet} ${algo.toUpperCase().padEnd(8)}: ${h}`);
    }
    lines.push('', theme.footer);
    return reply(lines.join('\n'));
  },
};
