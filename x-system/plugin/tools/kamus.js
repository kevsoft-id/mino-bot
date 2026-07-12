'use strict';
const axios    = require('axios');
const settings = require('../../../set/settings');
const { truncate } = require('../../../lib/utils');

// Kamus sederhana built-in (fallback)
const KAMUS = {
  'serendipity': 'Menemukan sesuatu yang menyenangkan secara tidak sengaja',
  'ephemeral':   'Sesuatu yang hanya bertahan untuk waktu yang singkat',
  'melancholy':  'Perasaan sedih yang mendalam dan panjang',
  'nostalgia':   'Kerinduan pada masa lalu yang menyenangkan',
  'procrastinate': 'Menunda-nunda pekerjaan atau tugas',
  'resilience':  'Kemampuan untuk bangkit dari kesulitan',
  'ambiguous':   'Memiliki dua makna atau lebih yang membingungkan',
  'eloquent':    'Mampu mengungkapkan pikiran dengan jelas dan menarik',
};

module.exports = {
  commands: ['kamus', 'arti', 'define'],
  category: 'Tools',
  description: 'Cari arti kata di kamus~',
  usage: '.kamus <kata>',

  async handler(sock, m, { text, reply, react }) {
    if (!text) return reply('❓ Masukkan kata yang mau dicari artinya nya~\nContoh: `.kamus resilience`');

    await react('📖');

    const kata = text.toLowerCase().trim();

    // Coba built-in dulu
    if (KAMUS[kata]) {
      return reply([
        `📖 *KAMUS* nya~`,
        ``,
        `🔤 *Kata  :* ${text}`,
        `📝 *Arti  :* ${KAMUS[kata]}`,
        ``,
        settings.footer,
      ].join('\n'));
    }

    try {
      // Free Dictionary API
      const { data } = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(kata)}`,
        { timeout: 10000 }
      );

      const entry = data[0];
      const meanings = entry.meanings.slice(0, 2).map(m => {
        const defs = m.definitions.slice(0, 2).map((d, i) => `  ${i + 1}. ${truncate(d.definition, 120)}`).join('\n');
        return `*${m.partOfSpeech}*\n${defs}`;
      }).join('\n\n');

      await react('✅');
      await reply([
        `📖 *KAMUS* nya~`,
        ``,
        `🔤 *Kata  :* ${entry.word}`,
        entry.phonetic ? `🔊 *Fonetik:* ${entry.phonetic}` : '',
        ``,
        `📝 *Definisi:*`,
        meanings,
        ``,
        settings.footer,
      ].filter(Boolean).join('\n'));
    } catch {
      await react('❌');
      await reply(`❌ Kata "${text}" tidak ditemukan di kamus nya~\nCoba kata dalam bahasa Inggris UwU`);
    }
  },
};
