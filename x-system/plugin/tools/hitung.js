'use strict';
const settings = require('../../../settings');

module.exports = {
  commands: ['hitung', 'calc', 'kalkulator', 'math'],
  category: 'Tools',
  description: 'Kalkulator matematika canggih nya~',
  usage: '.hitung <ekspresi>',

  async handler(sock, m, { text, reply, react }) {
    if (!text) return reply('❓ Masukkan ekspresi matematika nya~\nContoh: `.hitung 2 + 2 * 3`\nContoh: `.hitung sqrt(144)`\nContoh: `.hitung sin(30) * pi`');

    await react('🔢');

    try {
      // Gunakan mathjs kalau ada, fallback ke Function()
      let result;
      try {
        const math = require('mathjs');
        result = math.evaluate(text);
        // Batasi desimal
        if (typeof result === 'number' && !Number.isInteger(result)) {
          result = parseFloat(result.toFixed(10));
        }
      } catch {
        // Fallback evaluasi sederhana
        const sanitized = text.replace(/[^0-9+\-*/().%\s]/g, '');
        // eslint-disable-next-line no-new-func
        result = Function(`'use strict'; return (${sanitized})`)();
      }

      if (typeof result === 'object') result = result.toString();

      await react('✅');
      await reply([
        `🔢 *KALKULATOR* nya~`,
        ``,
        `📝 *Input  :* \`${text}\``,
        `💡 *Hasil  :* \`${result}\``,
        ``,
        settings.footer,
      ].join('\n'));
    } catch (err) {
      await react('❌');
      await reply(`❌ Ekspresi tidak valid nya~\nError: ${err.message}`);
    }
  },
};
