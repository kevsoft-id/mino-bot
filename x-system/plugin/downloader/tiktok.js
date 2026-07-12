'use strict';
const axios    = require('axios');
const settings = require('../../../set/settings');

module.exports = {
  commands: ['tiktok', 'tt', 'ttdl'],
  category: 'Downloader',
  description: 'Download video TikTok tanpa watermark~',
  usage: '.tiktok <url_tiktok>',

  async handler(sock, m, { args, reply, react }) {
    const url = args[0];
    if (!url) return reply('❓ Masukkan URL TikTok nya~\nContoh: `.tiktok https://vm.tiktok.com/xxx`');
    if (!url.includes('tiktok') && !url.includes('vm.tiktok')) {
      return reply('❌ URL harus dari TikTok nya~ (tiktok.com atau vm.tiktok.com)');
    }

    await react('⏳');
    await reply(`⏳ Mino lagi download TikTok tanpa watermark ya~ UwU`);

    const APIs = [
      `https://api.siputzx.my.id/api/d/tiktok?url=${encodeURIComponent(url)}`,
      `https://api.ryzendesu.vip/api/downloader/ttdl?url=${encodeURIComponent(url)}`,
    ];

    for (const apiUrl of APIs) {
      try {
        const { data } = await axios.get(apiUrl, { timeout: 20000 });
        const videoUrl = data?.data?.play || data?.data?.wmplay || data?.video?.noWatermark || data?.url;

        if (videoUrl) {
          const title  = data?.data?.title || data?.title || 'TikTok Video';
          const author = data?.data?.author?.nickname || data?.author || '-';
          const likes  = data?.data?.digg_count?.toLocaleString() || '-';

          await react('✅');
          await reply([
            `🎵 *TIKTOK DOWNLOADER* nya~`,
            ``,
            `👤 *Pembuat :* ${author}`,
            `📝 *Caption :* ${String(title).slice(0, 100)}`,
            `❤️ *Likes   :* ${likes}`,
            ``,
            `📥 *Link Video (No WM):*`,
            videoUrl,
            ``,
            `✨ Tanpa watermark nya~ UwU`,
            ``,
            settings.footer,
          ].join('\n'));
          return;
        }
      } catch {}
    }

    await react('❌');
    await reply(`❌ Gagal download TikTok nya~\nPastikan link valid dan video masih ada ya UwU`);
  },
};
