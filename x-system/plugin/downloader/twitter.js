'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../set/settings');
const axios    = require('axios');
const { replyImage } = require('../../../lib/utils');

module.exports = {
  commands:    ['twitter', 'twdl', 'xdl'],
  category:    'Downloader',
  description: 'Download video dari Twitter / X 🐦',
  usage:       '.twitter <url>',

  async handler(sock, m, { args, reply, react }) {
    const { theme } = settings;
    const url = args[0];
    if (!url || !url.includes('twitter.com') && !url.includes('x.com') && !url.includes('t.co')) {
      return reply(`❓ Masukkan URL Twitter/X yang valid.\nContoh: .twitter https://twitter.com/user/status/xxx`);
    }
    await react('⏳');
    try {
      const res  = await axios.get(`https://api.siputzx.my.id/api/d/twitter?url=${encodeURIComponent(url)}`, { timeout: 20000 });
      const data = res.data?.data || res.data;
      if (!data) return reply('❌ Gagal mengambil data. Pastikan URL valid dan video tersedia.');

      const videoUrl = data.video || data.url || data.mp4;
      if (!videoUrl) return reply('❌ Video tidak ditemukan atau akun private.');

      await react('✅');
      await replyImage(sock, m, data.thumbnail || settings.images.thumb,
        [theme.header, '',
          ` ⬡  🐦  ${theme.bold('TWITTER DOWNLOADER')}`, '',
          `  📝 ${(data.description || data.text || 'Twitter Video').slice(0, 100)}`,
          '',
          `  🎬 Video URL:`,
          `  ${videoUrl}`,
          '', theme.footer].join('\n')
      );
    } catch {
      await react('❌');
      return reply('❌ Gagal download. Coba lagi atau gunakan URL lain.');
    }
  },
};
