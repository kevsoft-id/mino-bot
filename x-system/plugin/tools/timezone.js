'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const axios    = require('axios');
const settings = require('../../../settings');

const POPULAR_ZONES = {
  'wib':       'Asia/Jakarta',
  'wita':      'Asia/Makassar',
  'wit':       'Asia/Jayapura',
  'jakarta':   'Asia/Jakarta',
  'bali':      'Asia/Makassar',
  'london':    'Europe/London',
  'tokyo':     'Asia/Tokyo',
  'paris':     'Europe/Paris',
  'dubai':     'Asia/Dubai',
  'sydney':    'Australia/Sydney',
  'newyork':   'America/New_York',
  'new york':  'America/New_York',
  'losangeles':'America/Los_Angeles',
  'beijing':   'Asia/Shanghai',
  'singapore': 'Asia/Singapore',
  'seoul':     'Asia/Seoul',
  'moscow':    'Europe/Moscow',
  'berlin':    'Europe/Berlin',
  'india':     'Asia/Kolkata',
  'jakarta':   'Asia/Jakarta',
};

module.exports = {
  commands:    ['timezone', 'waktunegara', 'jam', 'worldtime', 'waktudunia'],
  category:    'Tools',
  description: 'Cek waktu di berbagai zona atau kota di dunia',
  usage:       '.timezone {kota/zona}  |  .timezone list',

  async handler(sock, m, { args, text, reply, react }) {
    const { theme } = settings;

    if (!text || text === 'list') {
      const list = Object.entries(POPULAR_ZONES).slice(0, 12).map(([k, v]) =>
        `    ${theme.bullet} .timezone ${k}`
      ).join('\n');

      const now = new Date();
      const wib = now.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' });
      const wita = now.toLocaleTimeString('id-ID', { timeZone: 'Asia/Makassar', hour: '2-digit', minute: '2-digit' });
      const wit = now.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jayapura', hour: '2-digit', minute: '2-digit' });

      return reply([
        theme.header, '',
        ` ⬡  🌍  ${theme.bold('WORLD TIMEZONE')}`, '',
        `    🇮🇩 WIB  (Jakarta)  : ${wib}`,
        `    🇮🇩 WITA (Makassar) : ${wita}`,
        `    🇮🇩 WIT  (Jayapura) : ${wit}`,
        '',
        `    ${theme.bold('Cek kota lain:')}`,
        list,
        `    ${theme.bullet} .timezone {nama kota lainnya}`,
        '',
        theme.footer,
      ].join('\n'));
    }

    await react('🕐');

    const query = text.toLowerCase().trim();
    const tzKey = POPULAR_ZONES[query] || text.trim();

    try {
      const now = new Date();
      const timeStr = now.toLocaleString('id-ID', {
        timeZone: tzKey,
        weekday:  'long',
        year:     'numeric',
        month:    'long',
        day:      'numeric',
        hour:     '2-digit',
        minute:   '2-digit',
        second:   '2-digit',
      });

      // Get UTC offset
      const utcOffset = new Intl.DateTimeFormat('en', {
        timeZone: tzKey, timeZoneName: 'short',
      }).formatToParts(now).find(p => p.type === 'timeZoneName')?.value || '';

      await react('✅');
      await reply([
        `🕐 *WORLD TIME*`,
        ``,
        `📍 Zona : *${tzKey}*`,
        `🕐 Waktu: *${timeStr}*`,
        `🌐 Zona : ${utcOffset}`,
        ``,
        settings.footer,
      ].join('\n'));
    } catch (err) {
      await react('❌');
      // Try worldtimeapi
      try {
        const { data } = await axios.get(`https://worldtimeapi.org/api/timezone`, { timeout: 8000 });
        const matches = data.filter(z => z.toLowerCase().includes(query)).slice(0, 5);
        if (matches.length) {
          await reply([
            `❓ Zona "${query}" tidak ditemukan. Coba salah satu ini:`,
            matches.map(z => `  • .timezone ${z}`).join('\n'),
          ].join('\n'));
        } else {
          await reply(`❌ Zona waktu "${text}" tidak ditemukan\nContoh yang valid: Asia/Jakarta, Europe/London`);
        }
      } catch {
        await reply(`❌ Timezone "${text}" tidak valid\nGunakan format: Asia/Jakarta, Europe/London, dll`);
      }
    }
  },
};
