'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../settings');
const axios    = require('axios');
const { replyImage } = require('../../../lib/utils');

module.exports = {
  commands:    ['pinterest', 'pin', 'pindl'],
  category:    'Downloader',
  description: 'Search & download gambar dari Pinterest 📌',
  usage:       '.pinterest <keyword>  atau  .pinterest <url>',

  async handler(sock, m, { args, text, reply, react }) {
    const { theme } = settings;
    if (!text) return reply(`❓ Contoh:\n  .pinterest anime girl\n  .pinterest https://pinterest.com/pin/xxx`);

    await react('⏳');
    try {
      const isUrl = text.includes('pinterest.com');
      const apiUrl = isUrl
        ? `https://api.siputzx.my.id/api/d/pinterest?url=${encodeURIComponent(text)}`
        : `https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(text)}`;

      const res  = await axios.get(apiUrl, { timeout: 15000 });
      const data = res.data;

      // Search results — show first image
      if (!isUrl && Array.isArray(data?.data)) {
        const images = data.data.slice(0, 5);
        if (!images.length) { await react('❌'); return reply('❌ Tidak ada hasil untuk: ' + text); }
        await react('✅');
        for (const img of images.slice(0, 3)) {
          const imgUrl = img.images?.orig?.url || img.url || img.image;
          if (imgUrl) await replyImage(sock, m, imgUrl, `📌 ${img.title || text} — ${settings.footer}`);
        }
        return;
      }

      // Direct URL
      const imgUrl = data?.data?.image || data?.image || data?.url;
      if (!imgUrl) { await react('❌'); return reply('❌ Gambar tidak ditemukan.'); }
      await react('✅');
      return replyImage(sock, m, imgUrl, `📌 ${data?.data?.title || text}\n\n${settings.footer}`);
    } catch {
      await react('❌');
      return reply('❌ Gagal mengambil data Pinterest. Coba lagi nanti.');
    }
  },
};
