'use strict';
const axios    = require('axios');
const settings = require('../../../set/settings');

module.exports = {
  commands: ['cekweb', 'checkweb', 'isup', 'cekurl'],
  category: 'Tools',
  description: 'Cek apakah sebuah website sedang aktif~',
  usage: '.cekweb <url>',

  async handler(sock, m, { args, reply, react }) {
    let url = args[0];
    if (!url) return reply('❓ Masukkan URL website nya~\nContoh: `.cekweb google.com`');
    if (!url.startsWith('http')) url = 'https://' + url;

    await react('🔍');
    const start = Date.now();

    try {
      const resp = await axios.get(url, {
        timeout: 10000,
        validateStatus: () => true,
        maxRedirects: 5,
      });
      const ms     = Date.now() - start;
      const status = resp.status;
      const isUp   = status >= 200 && status < 400;

      await react(isUp ? '✅' : '⚠️');
      await reply([
        `🌐 *CEK WEBSITE* nya~`,
        ``,
        `🔗 *URL    :* ${url}`,
        ``,
        `${isUp ? '🟢 *Status  :* ONLINE ✅' : '🔴 *Status  :* BERMASALAH ⚠️'}`,
        `📊 *HTTP   :* ${status} ${resp.statusText || ''}`,
        `⏱️ *Respons :* ${ms}ms`,
        ``,
        ms < 500  ? `⚡ Sangat cepat nya~!` :
        ms < 1500 ? `✅ Normal~` :
        ms < 3000 ? `⚠️ Agak lambat nih UwU` :
                    `🐢 Lambat banget nya~`,
        ``,
        settings.footer,
      ].join('\n'));
    } catch (err) {
      const ms = Date.now() - start;
      await react('❌');
      await reply([
        `🌐 *CEK WEBSITE* nya~`,
        ``,
        `🔗 *URL    :* ${url}`,
        ``,
        `🔴 *Status  :* OFFLINE / TIDAK BISA DIAKSES ❌`,
        `⏱️ *Waktu   :* ${ms}ms`,
        `💬 *Error   :* ${err.code || err.message}`,
        ``,
        `Kemungkinan website down atau URL salah nya~ UwU`,
        ``,
        settings.footer,
      ].join('\n'));
    }
  },
};
