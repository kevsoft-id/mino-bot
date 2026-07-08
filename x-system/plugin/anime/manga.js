'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../../settings');
const axios    = require('axios');
const { replyImage, replyList } = require('../../../../lib/utils');

module.exports = {
  commands:    ['manga', 'carimanga'],
  category:    'Anime',
  description: 'Cari informasi manga dari MyAnimeList 📚',
  usage:       '.manga <judul>  contoh: .manga Naruto',

  async handler(sock, m, { text, args, prefix, reply, react }) {
    const { theme } = settings;
    if (!text) return reply(`❓ Masukkan judul manga.\nContoh: .manga One Piece`);

    await react('📚');
    try {
      const res  = await axios.get(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(text)}&limit=5`, { timeout: 10000 });
      const list = res.data.data;
      if (!list?.length) { await react('❌'); return reply(`❌ Manga "${text}" tidak ditemukan.`); }

      const top     = list[0];
      const caption = [
        theme.header, '',
        ` ⬡  📚  ${theme.bold('MANGA INFO')}`, '',
        `  📖 ${theme.bold(top.title)}`,
        `  🈲 ${top.title_japanese || '-'}`,
        '',
        `  📊 Score    : ⭐ ${top.score || 'N/A'}  (${(top.scored_by || 0).toLocaleString()} votes)`,
        `  📈 Rank     : #${top.rank || 'N/A'}`,
        `  📅 Published: ${top.published?.string || 'Ongoing'}`,
        `  📘 Type     : ${top.type || '-'}  |  ${top.chapters || '?'} chapters  |  ${top.volumes || '?'} vol`,
        `  🏷️  Genre    : ${top.genres?.map(g => g.name).slice(0, 5).join(', ') || '-'}`,
        '',
        `  📝 Sinopsis:`,
        `  ${(top.synopsis || '-').replace(/\[Written.*\]/g, '').slice(0, 300)}...`,
        '', theme.footer,
      ].join('\n');

      await react('✅');
      if (list.length > 1) {
        const rows = list.map(a => ({
          id:          `${prefix}manga ${a.title}`,
          title:       a.title.slice(0, 60),
          description: `⭐${a.score || 'N/A'}  •  ${a.type || '-'}  •  ${a.chapters || '?'} ch`,
        }));
        await replyImage(sock, m, top.images?.jpg?.large_image_url || settings.images.thumb, caption);
        return replyList(sock, m, theme.bold('HASIL MANGA'),
          `${theme.header}\n\n 📋 Ditemukan ${list.length} hasil untuk "${text}":\n\n${theme.footer}`,
          '📚 Pilih Manga', [{ title: '📚 HASIL MANGA', rows }], settings.footer, null);
      }
      return replyImage(sock, m, top.images?.jpg?.large_image_url || settings.images.thumb, caption);
    } catch {
      await react('❌');
      return reply('❌ Gagal mengambil data. Coba lagi nanti.');
    }
  },
};
