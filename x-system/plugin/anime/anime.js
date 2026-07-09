'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../settings');
const axios    = require('axios');
const { replyImage, replyList } = require('../../../lib/utils');

module.exports = {
  commands:    ['anime', 'carianimie', 'searchanime'],
  category:    'Anime',
  description: 'Cari informasi anime dari database MyAnimeList 🌸',
  usage:       '.anime <judul>  contoh: .anime One Piece',

  async handler(sock, m, { text, args, prefix, reply, react }) {
    const { theme } = settings;
    if (!text) return reply(`❓ Masukkan judul anime.\nContoh: .anime Naruto`);

    await react('🌸');
    try {
      const res    = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(text)}&limit=5&sfw=true`, { timeout: 10000 });
      const list   = res.data.data;
      if (!list?.length) { await react('❌'); return reply(`❌ Anime "${text}" tidak ditemukan.`); }

      const top = list[0];
      const caption = [
        theme.header, '',
        ` ⬡  🌸  ${theme.bold('ANIME INFO')}`, '',
        `  🎬 ${theme.bold(top.title)}`,
        `  🈲 ${top.title_japanese || '-'}`,
        '',
        `  📊 Score    : ⭐ ${top.score || 'N/A'}  (${(top.scored_by || 0).toLocaleString()} votes)`,
        `  📈 Rank     : #${top.rank || 'N/A'}  |  Popularity: #${top.popularity || 'N/A'}`,
        `  📅 Aired    : ${top.aired?.string || 'TBA'}`,
        `  📺 Type     : ${top.type || '-'}  |  ${top.episodes || '?'} episodes`,
        `  🎬 Status   : ${top.status || '-'}`,
        `  📁 Studio   : ${top.studios?.map(s => s.name).join(', ') || '-'}`,
        `  🏷️  Genre    : ${top.genres?.map(g => g.name).slice(0, 5).join(', ') || '-'}`,
        '',
        `  📝 Sinopsis:`,
        `  ${(top.synopsis || '-').replace(/\[Written.*\]/g, '').slice(0, 300)}...`,
        '', theme.footer,
      ].join('\n');

      await react('✅');

      // If multiple results, show list for navigation
      if (list.length > 1) {
        const rows = list.map(a => ({
          id:          `${prefix}anime ${a.title}`,
          title:       `${a.title.slice(0, 60)}`,
          description: `⭐${a.score || 'N/A'}  •  ${a.type || '-'}  •  ${a.episodes || '?'} eps`,
        }));
        await replyImage(sock, m, top.images?.jpg?.large_image_url || settings.images.thumb, caption);
        return replyList(sock, m, theme.bold('HASIL PENCARIAN'), 
          `${theme.header}\n\n 📋 Ditemukan ${list.length} hasil untuk "${text}":\n\n${theme.footer}`,
          '🌸 Pilih Anime', [{ title: '🌸 HASIL ANIME', rows }], settings.footer, null);
      }

      return replyImage(sock, m, top.images?.jpg?.large_image_url || settings.images.thumb, caption);
    } catch {
      await react('❌');
      return reply('❌ Gagal mengambil data. Coba lagi nanti.');
    }
  },
};
