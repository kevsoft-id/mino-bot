'use strict';
const axios    = require('axios');
const settings = require('../../../set/settings');

module.exports = {
  commands: ['ytmp4', 'ytv', 'ytvideo'],
  category: 'Downloader',
  description: 'Download YouTube video jadi MP4~',
  usage: '.ytmp4 <url_youtube>',

  async handler(sock, m, { args, reply, react }) {
    const url = args[0];
    if (!url) return reply('❓ Masukkan URL YouTube nya~\nContoh: `.ytmp4 https://youtu.be/xxxxx`');
    if (!url.includes('youtu')) return reply('❌ URL harus dari YouTube nya~');

    await react('⏳');
    await reply(`⏳ Mino lagi proses download video-nya ya~\nBisa lama tergantung ukuran video UwU`);

    try {
      const { data } = await axios.get(
        `https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(url)}`,
        { timeout: 40000 }
      );

      if (!data?.data?.dl_url) throw new Error('Gagal mendapatkan link download');

      const info = data.data;
      await react('✅');
      await reply([
        `🎬 *YOUTUBE MP4* nya~`,
        ``,
        `🎥 *Judul  :* ${info.title || 'Unknown'}`,
        `⏱️ *Durasi :* ${info.duration || '-'}`,
        `📦 *Kualitas:* ${info.quality || '360p'}`,
        ``,
        `📥 *Download Link:*`,
        info.dl_url,
        ``,
        `⚠️ Link berlaku sementara ~ Segera download!`,
        ``,
        settings.footer,
      ].join('\n'));
    } catch {
      await react('❌');
      try {
        const { data: d2 } = await axios.get(
          `https://api.ryzendesu.vip/api/downloader/ytmp4?url=${encodeURIComponent(url)}`,
          { timeout: 40000 }
        );
        if (d2?.url) {
          await reply([
            `🎬 *YOUTUBE MP4* nya~`,
            ``,
            `📥 *Download Link:*`,
            d2.url,
            ``,
            settings.footer,
          ].join('\n'));
        } else throw new Error();
      } catch {
        await reply(`❌ Gagal download video nya~\nMungkin video terlalu panjang/private, atau API down. Coba lagi ya UwU`);
      }
    }
  },
};
