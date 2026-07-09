'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../settings');
const axios    = require('axios');
const { replyImage, replyList } = require('../../../lib/utils');

const CATEGORIES = [
  'neko','kitsune','shinobu','megumin','waifu','maid','uniform',
  'hug','kiss','pat','slap','cuddle','blush','smile','wave',
  'dance','happy','thumbsup','cry','poke','bite',
];

module.exports = {
  commands:    ['animeimg', 'animepic', 'animegif', 'sfw'],
  category:    'Anime',
  description: 'Kirim gambar/GIF anime SFW random dari nekos.best 🖼️',
  usage:       '.animeimg  |  .animeimg neko  |  .animeimg list',

  async handler(sock, m, { args, prefix, reply, react }) {
    const { theme } = settings;
    const cat = args[0]?.toLowerCase();

    if (!cat || cat === 'list') {
      const rows = CATEGORIES.map(c => ({
        id:          `${prefix}animeimg ${c}`,
        title:       `🌸  ${c}`,
        description: `Kirim gambar ${c}`,
      }));
      return replyList(sock, m, theme.bold('ANIME IMAGE'),
        [theme.header, '', ` ⬡  🌸  ${theme.bold('ANIME IMAGE CATEGORIES')}`, '',
          `  Pilih kategori gambar anime SFW yang ingin dikirim!`, '', theme.footer].join('\n'),
        '🌸 Pilih Kategori', [{ title: '🌸 KATEGORI', rows }], settings.footer, settings.images.thumb);
    }

    const validCat = CATEGORIES.includes(cat) ? cat : 'neko';
    await react('🌸');
    try {
      const res    = await axios.get(`https://nekos.best/api/v2/${validCat}`, { timeout: 8000 });
      const result = res.data.results[0];
      const url    = result.url;
      const anime  = result.anime_name || '';

      await react('✅');
      return replyImage(sock, m, url,
        `🌸 *${validCat.toUpperCase()}*${anime ? `\n🎬 ${anime}` : ''}\n\n${settings.footer}`
      );
    } catch {
      await react('❌');
      return reply(`❌ Gagal mengambil gambar kategori *${validCat}*.`);
    }
  },
};
