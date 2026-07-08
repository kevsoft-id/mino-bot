'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../settings');
const axios    = require('axios');
const { replyImage } = require('../../../lib/utils');

module.exports = {
  commands:    ['facebook', 'fbdl', 'fb'],
  category:    'Downloader',
  description: 'Download video dari Facebook 📘',
  usage:       '.facebook <url>',

  async handler(sock, m, { args, reply, react }) {
    const { theme } = settings;
    const url = args[0];
    if (!url || !url.includes('facebook.com') && !url.includes('fb.com') && !url.includes('fb.watch')) {
      return reply(`❓ Masukkan URL Facebook yang valid.\nContoh: .facebook https://fb.watch/xxx`);
    }
    await react('⏳');
    try {
      const res  = await axios.get(`https://api.siputzx.my.id/api/d/facebook?url=${encodeURIComponent(url)}`, { timeout: 20000 });
      const data = res.data?.data || res.data;
      if (!data) return reply('❌ Gagal mengambil data. Pastikan URL valid.');

      const videoUrl = data.hd || data.sd || data.url;
      if (!videoUrl) return reply('❌ Video tidak ditemukan atau konten private.');

      await react('✅');
      return replyImage(sock, m, settings.images.thumb,
        [theme.header, '',
          ` ⬡  📘  ${theme.bold('FACEBOOK DOWNLOADER')}`, '',
          `  📝 ${(data.title || 'Facebook Video').slice(0, 100)}`,
          '',
          data.hd  ? `  🎬 HD  : ${data.hd}`  : '',
          data.sd  ? `  🎬 SD  : ${data.sd}`  : '',
          (!data.hd && !data.sd) ? `  🎬 URL : ${videoUrl}` : '',
          '', theme.footer].filter(Boolean).join('\n')
      );
    } catch {
      await react('❌');
      return reply('❌ Gagal download. Coba lagi atau gunakan URL lain.');
    }
  },
};
