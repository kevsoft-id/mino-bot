'use strict';
const axios    = require('axios');
const settings = require('../../../settings');
const { truncate } = require('../../../lib/utils');

module.exports = {
  commands: ['wiki', 'wikipedia', 'cari'],
  category: 'Tools',
  description: 'Cari informasi di Wikipedia Indonesia~',
  usage: '.wiki <query>',

  async handler(sock, m, { text, reply, react }) {
    if (!text) return reply('❓ Masukkan kata kunci pencarian ya~\nContoh: `.wiki kucing`');

    await react('🔍');

    try {
      const url = `https://id.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(text)}`;
      const { data } = await axios.get(url, { timeout: 10000 });

      if (!data.extract) return reply(`❌ Artikel "${text}" tidak ditemukan di Wikipedia nya~`);

      const summary = truncate(data.extract, 800);

      await react('✅');
      await reply([
        `📚 *WIKIPEDIA* nya~`,
        ``,
        `📖 *${data.title}*`,
        ``,
        summary,
        ``,
        `🔗 ${data.content_urls?.desktop?.page || ''}`,
        ``,
        settings.footer,
      ].join('\n'));
    } catch (err) {
      await react('❌');
      if (err.response?.status === 404) {
        await reply(`❌ Artikel "${text}" tidak ditemukan di Wikipedia nya~`);
      } else {
        await reply(`❌ Gagal mengambil data Wikipedia nya~\n${err.message}`);
      }
    }
  },
};
