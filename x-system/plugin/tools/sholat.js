'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const axios    = require('axios');
const settings = require('../../../set/settings');

module.exports = {
  commands:    ['sholat', 'jadwalsholat', 'sholattime', 'prayer', 'jamaah'],
  category:    'Tools',
  description: 'Jadwal sholat berdasarkan kota',
  usage:       '.sholat {kota}',

  async handler(sock, m, { text, reply, react }) {
    const { theme } = settings;

    if (!text) {
      return reply([
        theme.header, '',
        ` ⬡  🕌  ${theme.bold('JADWAL SHOLAT')}`, '',
        `    ${theme.bullet} Masukkan nama kota`,
        `    ${theme.bullet} Contoh: .sholat Jakarta`,
        `    ${theme.bullet} .sholat Surabaya`,
        `    ${theme.bullet} .sholat Bandung`,
        '',
        theme.footer,
      ].join('\n'));
    }

    await react('🕌');

    try {
      const city    = text.trim();
      const now     = new Date();
      const month   = now.getMonth() + 1;
      const year    = now.getFullYear();
      const day     = now.getDate();

      const { data } = await axios.get(
        `https://api.aladhan.com/v1/timingsByCity`,
        {
          params: { city, country: 'Indonesia', method: 11, month, year },
          timeout: 12000,
        }
      );

      if (data.code !== 200) throw new Error('Kota tidak ditemukan');

      const t = data.data.timings;
      const d = data.data.date.readable;

      await react('✅');
      await reply([
        theme.header, '',
        ` ⬡  🕌  ${theme.bold('JADWAL SHOLAT')}`, '',
        `    📍 *Kota*  : ${city}`,
        `    📅 *Tanggal*: ${d}`,
        '',
        `    🌅 *Subuh*  : ${t.Fajr}`,
        `    🌄 *Syuruq* : ${t.Sunrise}`,
        `    ☀️  *Dzuhur* : ${t.Dhuhr}`,
        `    🌤️  *Ashar*  : ${t.Asr}`,
        `    🌇 *Maghrib*: ${t.Maghrib}`,
        `    🌙 *Isya*   : ${t.Isha}`,
        `    🕛 *Imsak*  : ${t.Imsak}`,
        '',
        `    _Metode: Kemenag RI_`,
        '',
        theme.footer,
      ].join('\n'));
    } catch (err) {
      await react('❌');
      await reply(`❌ Jadwal sholat untuk "${text}" tidak ditemukan\nCoba nama kota dalam bahasa Indonesia/Inggris`);
    }
  },
};
