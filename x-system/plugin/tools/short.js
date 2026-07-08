'use strict';
const axios    = require('axios');
const settings = require('../../../settings');

module.exports = {
  commands: ['short', 'tinyurl', 'persingkat', 'shorturl'],
  category: 'Tools',
  description: 'Persingkat URL yang panjang~',
  usage: '.short <url>',

  async handler(sock, m, { args, reply, react }) {
    const url = args[0];
    if (!url) return reply('❓ Masukkan URL yang mau dipersingkat nya~\nContoh: `.short https://contoh-url-panjang.com/path`');
    if (!url.startsWith('http')) return reply('❌ URL harus diawali http:// atau https:// nya~');

    await react('⏳');

    try {
      const { data } = await axios.get(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`,
        { timeout: 10000 }
      );

      if (!data || !data.startsWith('http')) throw new Error('Respons tidak valid');

      await react('✅');
      await reply([
        `🔗 *URL SHORTENER* nya~`,
        ``,
        `📎 *Original :*`,
        `${url}`,
        ``,
        `✂️ *Shortened:*`,
        `*${data}*`,
        ``,
        `💡 Lebih pendek kan? UwU~`,
        ``,
        settings.footer,
      ].join('\n'));
    } catch (err) {
      await react('❌');
      await reply(`❌ Gagal mempersingkat URL nya~\n${err.message}`);
    }
  },
};
