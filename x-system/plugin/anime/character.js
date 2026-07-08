'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../../settings');
const axios    = require('axios');
const { replyImage, replyList } = require('../../../../lib/utils');

module.exports = {
  commands:    ['character', 'chara', 'animechar'],
  category:    'Anime',
  description: 'Cari info karakter anime/manga dari database 🎭',
  usage:       '.character <nama>  contoh: .character Naruto',

  async handler(sock, m, { text, prefix, reply, react }) {
    const { theme } = settings;
    if (!text) return reply(`❓ Masukkan nama karakter.\nContoh: .character Levi Ackerman`);

    await react('🎭');
    try {
      const res  = await axios.get(`https://api.jikan.moe/v4/characters?q=${encodeURIComponent(text)}&limit=5`, { timeout: 10000 });
      const list = res.data.data;
      if (!list?.length) { await react('❌'); return reply(`❌ Karakter "${text}" tidak ditemukan.`); }

      const top     = list[0];
      const animes  = top.anime?.slice(0, 3).map(a => a.anime.title).join(', ') || '-';
      const mangas  = top.manga?.slice(0, 2).map(a => a.manga.title).join(', ') || '-';
      const caption = [
        theme.header, '',
        ` ⬡  🎭  ${theme.bold('ANIME CHARACTER')}`, '',
        `  👤 ${theme.bold(top.name)}`,
        `  🈲 ${top.name_kanji || '-'}`,
        '',
        `  💖 Favorit  : ${(top.favorites || 0).toLocaleString()} orang`,
        `  📺 Anime    : ${animes}`,
        `  📖 Manga    : ${mangas}`,
        '',
        `  📝 About:`,
        `  ${(top.about || '-').slice(0, 300)}`,
        '', theme.footer,
      ].join('\n');

      await react('✅');
      const imgUrl = top.images?.jpg?.image_url;

      if (list.length > 1) {
        const rows = list.map(c => ({
          id:          `${prefix}character ${c.name}`,
          title:       c.name.slice(0, 60),
          description: `💖 ${c.favorites} favs  •  ${c.anime?.slice(0, 1).map(a => a.anime.title).join('') || '-'}`,
        }));
        await replyImage(sock, m, imgUrl || settings.images.thumb, caption);
        return replyList(sock, m, theme.bold('HASIL KARAKTER'),
          `${theme.header}\n\n 📋 Ditemukan ${list.length} karakter:\n\n${theme.footer}`,
          '🎭 Pilih Karakter', [{ title: '🎭 HASIL', rows }], settings.footer, null);
      }
      return replyImage(sock, m, imgUrl || settings.images.thumb, caption);
    } catch {
      await react('❌');
      return reply('❌ Gagal mengambil data. Coba lagi nanti.');
    }
  },
};
