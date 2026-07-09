'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../settings');
const axios    = require('axios');
const { replyImage, replyList } = require('../../../lib/utils');

// waifu.im tags
const TAGS = [
  'waifu','maid','marin-kitagawa','mori-calliope','raiden-shogun',
  'oppai','selfies','uniform','elf','kawaii','fox-girl',
];

module.exports = {
  commands:    ['waifu2', 'randomwaifu', 'anime-girl'],
  category:    'Anime',
  description: 'Gambar waifu berkualitas tinggi dari waifu.im 💕',
  usage:       '.waifu2  |  .waifu2 maid  |  .waifu2 list',

  async handler(sock, m, { args, prefix, reply, react }) {
    const { theme } = settings;
    const tag = args[0]?.toLowerCase();

    if (!tag || tag === 'list') {
      const rows = TAGS.map(t => ({
        id:          `${prefix}waifu2 ${t}`,
        title:       `💕  ${t}`,
        description: `Kirim gambar waifu tag: ${t}`,
      }));
      return replyList(sock, m, theme.bold('WAIFU GALLERY'),
        [theme.header, '', ` ⬡  💕  ${theme.bold('WAIFU GALLERY')}`, '',
          `  Pilih kategori waifu favoritmu!`, '', theme.footer].join('\n'),
        '💕 Pilih Tag', [{ title: '💕 WAIFU TAGS', rows }], settings.footer, settings.images.thumb);
    }

    const validTag = TAGS.includes(tag) ? tag : 'waifu';
    await react('💕');
    try {
      const res  = await axios.get(
        `https://api.waifu.im/search?included_tags=${validTag}&is_nsfw=false`,
        { timeout: 8000 }
      );
      const img = res.data.images?.[0];
      if (!img) throw new Error('no image');
      const caption = [
        `💕 *Waifu — ${validTag.toUpperCase()}*`,
        `⭐ Favourites: ${img.favourites || 0}`,
        `🏷️  Tags: ${img.tags?.map(t => t.name).join(', ')}`,
        ``, settings.footer,
      ].join('\n');
      await react('✅');
      return replyImage(sock, m, img.url, caption);
    } catch {
      await react('❌');
      return reply(`❌ Gagal mengambil gambar waifu. Coba lagi nanti.`);
    }
  },
};
