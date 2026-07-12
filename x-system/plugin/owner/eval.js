'use strict';

// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../set/settings');
const util = require('util');

module.exports = {
  commands:  ['eval', 'ev', 'exec'],
  category:  'Owner',
  description: 'Evaluasi kode JavaScript — OWNER ONLY',
  usage:     '.eval <kode>',
  ownerOnly: true,

  async handler(sock, m, { text, reply, react }) {
    const { theme } = settings;
    if (!text) {
      return reply([
        theme.header,
        '',
        ` ⬡  ⚙️  ${theme.bold('JS EVAL')}`,
        '',
        `    ${theme.bullet} ${theme.bold('Usage')}  : .eval <kode JS>`,
        `    ${theme.bullet} ${theme.bold('Contoh')} : .eval 2 + 2`,
        `    ${theme.bullet} ${theme.bold('Contoh')} : .eval return global.plugins.size`,
        '',
        `    ⚠️  Akses penuh ke runtime bot — gunakan dengan hati-hati.`,
        '',
        theme.footer,
      ].join('\n'));
    }

    await react('⚙️');
    const start = Date.now();

    try {
      // eslint-disable-next-line no-eval
      let result = await eval(`(async () => { ${text} })()`);
      const ms   = Date.now() - start;

      if (typeof result !== 'string') {
        result = util.inspect(result, { depth: 3, maxArrayLength: 50 });
      }

      const output = String(result).slice(0, 2000);

      await react('✅');
      await reply([
        theme.header,
        '',
        ` ⬡  ✅  ${theme.bold('EVAL — OK')}`,
        '',
        ` ${theme.bold('Input')} :`,
        `\`\`\``,
        text.slice(0, 300),
        `\`\`\``,
        '',
        ` ${theme.bold('Output')} :`,
        `\`\`\``,
        output,
        `\`\`\``,
        '',
        `    ⏱️  ${ms}ms`,
        '',
        theme.footer,
      ].join('\n'));
    } catch (err) {
      const ms = Date.now() - start;
      await react('❌');
      await reply([
        theme.header,
        '',
        ` ⬡  ❌  ${theme.bold('EVAL — ERROR')}`,
        '',
        ` ${theme.bold('Input')} :`,
        `\`\`\``,
        text.slice(0, 300),
        `\`\`\``,
        '',
        ` ${theme.bold('Error')} :`,
        `\`\`\``,
        err.message,
        `\`\`\``,
        '',
        `    ⏱️  ${ms}ms`,
        '',
        theme.footer,
      ].join('\n'));
    }
  },
};
