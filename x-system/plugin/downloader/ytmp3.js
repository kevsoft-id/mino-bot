'use strict';
const axios    = require('axios');
const settings = require('../../../settings');

module.exports = {
  commands: ['ytmp3', 'yta', 'ytaudio', 'music'],
  category: 'Downloader',
  description: 'Download YouTube video jadi MP3 audio~',
  usage: '.ytmp3 <url_youtube>',

  async handler(sock, m, { args, reply, react }) {
    const url = args[0];
    if (!url) return reply('❓ Masukkan URL YouTube nya~\nContoh: `.ytmp3 https://youtu.be/xxxxx`');
    if (!url.includes('youtu')) return reply('❌ URL harus dari YouTube nya~ (youtu.be atau youtube.com)');

    await react('⏳');
    await reply(`⏳ Mino lagi proses download audio-nya ya~ UwU\nTunggu sebentar...`);

    try {
      // API y2mate style (gunakan API alternatif yang masih jalan)
      const { data } = await axios.get(
        `https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(url)}`,
        { timeout: 30000 }
      );

      if (!data?.data?.dl_url) throw new Error('Gagal mendapatkan link download');

      const info = data.data;
      await react('✅');
      await reply([
        `🎵 *YOUTUBE MP3* nya~`,
        ``,
        `📀 *Judul  :* ${info.title || 'Unknown'}`,
        `⏱️ *Durasi :* ${info.duration || '-'}`,
        `📦 *Size   :* ${info.filesize || '-'}`,
        ``,
        `📥 *Download Link:*`,
        info.dl_url,
        ``,
        `⚠️ Link berlaku sementara ya~ Segera download!`,
        ``,
        settings.footer,
      ].join('\n'));
    } catch {
      await react('❌');
      // Coba API alternatif
      try {
        const { data: d2 } = await axios.get(
          `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${encodeURIComponent(url)}`,
          { timeout: 30000 }
        );
        if (d2?.url) {
          await reply([
            `🎵 *YOUTUBE MP3* nya~`,
            ``,
            `📥 *Download Link:*`,
            d2.url,
            ``,
            `⚠️ Segera download ya~ link bisa expire!`,
            ``,
            settings.footer,
          ].join('\n'));
        } else throw new Error();
      } catch {
        await reply(`❌ Gagal download nya~\nMungkin video private, umur terbatas, atau API sedang down. Coba lagi ya UwU`);
      }
    }
  },
};
