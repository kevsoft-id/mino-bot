'use strict';
const axios    = require('axios');
const settings = require('../../../set/settings');

module.exports = {
  commands: ['ig', 'igdl', 'instagram', 'insta'],
  category: 'Downloader',
  description: 'Download media dari Instagram~',
  usage: '.ig <url_instagram>',

  async handler(sock, m, { args, reply, react }) {
    const url = args[0];
    if (!url) return reply('❓ Masukkan URL post Instagram nya~\nContoh: `.ig https://www.instagram.com/p/xxx`');
    if (!url.includes('instagram.com')) return reply('❌ URL harus dari Instagram nya~');

    await react('⏳');
    await reply(`⏳ Mino lagi ambil media Instagram-nya ya~ UwU`);

    try {
      const { data } = await axios.get(
        `https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(url)}`,
        { timeout: 20000 }
      );

      const medias = data?.data;
      if (!medias || !medias.length) throw new Error('Tidak ada media');

      await react('✅');

      const caption = [
        `📸 *INSTAGRAM DOWNLOADER* nya~`,
        ``,
        `📎 *Total Media:* ${medias.length}`,
        ``,
        ...medias.map((item, i) => `${i + 1}. ${item.url || item.download_url || item}`),
        ``,
        `💡 Klik link untuk download ya~ UwU`,
        ``,
        settings.footer,
      ].join('\n');

      await reply(caption);
    } catch {
      await react('❌');
      await reply([
        `❌ Gagal download dari Instagram nya~`,
        ``,
        `Kemungkinan penyebab:`,
        `• Akun private`,
        `• Post sudah dihapus`,
        `• URL tidak valid`,
        `• API sedang down`,
        ``,
        `Coba lagi ya~ UwU`,
      ].join('\n'));
    }
  },
};
