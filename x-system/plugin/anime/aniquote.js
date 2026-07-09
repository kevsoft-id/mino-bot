'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../settings');
const axios    = require('axios');

const FALLBACK_QUOTES = [
  { quote: 'Jika kamu tidak menyerah, kamu tidak akan kalah.', character: 'Gintoki Sakata', anime: 'Gintama' },
  { quote: 'Orang yang bertanya akan malu sesaat, tapi orang yang tidak bertanya akan malu selamanya.', character: 'Misaki Ayuzawa', anime: 'Kaichou wa Maid-sama' },
  { quote: 'Ketika kamu menyerah, saat itulah permainan berakhir.', character: 'Mitsuyoshi Anzai', anime: 'Slam Dunk' },
  { quote: 'Hidupku milikku. Jangan putuskan takdirku atas kehendakmu.', character: 'Erza Scarlet', anime: 'Fairy Tail' },
  { quote: 'Kesakitan mengajarkan kita bahwa kita masih hidup.', character: 'Nico Robin', anime: 'One Piece' },
  { quote: 'Rasa sakit itu tak terelakkan, namun penderitaan itu pilihan.', character: 'Kaneki Ken', anime: 'Tokyo Ghoul' },
  { quote: 'Mimpi bukanlah sesuatu yang kamu lihat saat tidur, mimpi adalah sesuatu yang mencegahmu tidur.', character: 'Zenitsu', anime: 'Kimetsu no Yaiba' },
  { quote: 'Terlepas dari siapa musuhmu, kamu harus maju.', character: 'Eren Yeager', anime: 'Attack on Titan' },
  { quote: 'Seseorang tidak akan bisa mengerti sakitnya orang lain.', character: 'Naruto Uzumaki', anime: 'Naruto' },
  { quote: 'Kita tidak tahu apa yang akan terjadi di masa depan, tapi itu bukan alasan untuk menyerah hari ini.', character: 'Edward Elric', anime: 'Fullmetal Alchemist' },
];

module.exports = {
  commands:    ['aniquote', 'animequote', 'aquote'],
  category:    'Anime',
  description: 'Kutipan inspiratif dari tokoh anime terkenal 💬',
  usage:       '.aniquote',

  async handler(sock, m, { reply, react }) {
    const { theme } = settings;
    await react('🌸');
    let q;
    try {
      const res = await axios.get('https://animechan.io/api/v1/quotes/random', { timeout: 6000 });
      const d   = res.data?.data || res.data;
      if (d?.content && d?.character?.name) {
        q = { quote: d.content, character: d.character.name, anime: d.anime?.name || '?' };
      }
    } catch {}
    if (!q) q = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];

    await react('✅');
    return reply([
      theme.header, '',
      ` ⬡  💬  ${theme.bold('ANIME QUOTE')}`, '',
      `  ❝`,
      `  ${q.quote}`,
      `  ❞`,
      '',
      `  — ${theme.bold(q.character)}`,
      `     ${q.anime}`,
      '', theme.footer,
    ].join('\n'));
  },
};
