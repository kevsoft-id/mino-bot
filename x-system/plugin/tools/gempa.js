'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const axios    = require('axios');
const settings = require('../../../set/settings');

module.exports = {
  commands:    ['gempa', 'bmkg', 'earthquake', 'gempabumi'],
  category:    'Tools',
  description: 'Info gempa terbaru dari BMKG Indonesia',
  usage:       '.gempa',

  async handler(sock, m, { reply, react }) {
    const { theme } = settings;
    await react('🌏');

    try {
      const [autoRes, listRes] = await Promise.all([
        axios.get('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json', { timeout: 10000 }),
        axios.get('https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json', { timeout: 10000 }),
      ]);

      const latest   = autoRes.data?.Infogempa?.gempa;
      const recent   = listRes.data?.Infogempa?.gempa?.slice(0, 4) || [];

      if (!latest) throw new Error('Data gempa tidak tersedia');

      const mag    = parseFloat(latest.Magnitude || 0);
      const magEmoji = mag >= 6 ? '🔴' : mag >= 5 ? '🟠' : mag >= 4 ? '🟡' : '🟢';

      const recentList = recent.map((g, i) =>
        `    ${i + 1}. M${g.Magnitude} — ${g.Wilayah?.slice(0, 40) || '-'} (${g.Tanggal})`
      ).join('\n');

      await react('✅');
      await reply([
        theme.header, '',
        ` ⬡  🌏  ${theme.bold('GEMPA TERBARU (BMKG)')}`, '',
        ` ${magEmoji}  ${theme.bold('Gempa Terakhir:')}`,
        '',
        `    📅 Tanggal : ${latest.Tanggal} ${latest.Jam}`,
        `    📊 Magnitudo: M${latest.Magnitude} SR`,
        `    📍 Lokasi  : ${latest.Wilayah}`,
        `    🌊 Kedalaman: ${latest.Kedalaman}`,
        `    🗺️  Koordinat: ${latest.Lintang}, ${latest.Bujur}`,
        `    ⚠️  Potensi : ${latest.Potensi}`,
        '',
        ` ⬡  📋  ${theme.bold('4 GEMPA TERAKHIR:')}`,
        '',
        recentList || '    (data tidak tersedia)',
        '',
        `    _Sumber: BMKG (bmkg.go.id)_`,
        '',
        theme.footer,
      ].join('\n'));
    } catch (err) {
      await react('❌');
      await reply(`❌ Gagal ambil data gempa BMKG:\n${err.message}`);
    }
  },
};
