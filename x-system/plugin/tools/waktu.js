'use strict';
const settings = require('../../../settings');
const moment   = require('moment-timezone');

const TIMEZONES = {
  'jakarta':    'Asia/Jakarta',
  'wib':        'Asia/Jakarta',
  'makassar':   'Asia/Makassar',
  'wita':       'Asia/Makassar',
  'jayapura':   'Asia/Jayapura',
  'wit':        'Asia/Jayapura',
  'tokyo':      'Asia/Tokyo',
  'japan':      'Asia/Tokyo',
  'london':     'Europe/London',
  'paris':      'Europe/Paris',
  'new york':   'America/New_York',
  'sydney':     'Australia/Sydney',
  'dubai':      'Asia/Dubai',
  'singapore':  'Asia/Singapore',
  'beijing':    'Asia/Shanghai',
  'china':      'Asia/Shanghai',
  'seoul':      'Asia/Seoul',
  'korea':      'Asia/Seoul',
  'moscow':     'Europe/Moscow',
};

module.exports = {
  commands: ['waktu', 'time', 'jam', 'timezone'],
  category: 'Tools',
  description: 'Cek waktu saat ini di berbagai zona waktu~',
  usage: '.waktu [kota/zona]',

  async handler(sock, m, { text, reply, react }) {
    await react('⏰');

    if (!text) {
      // Tampilkan waktu WIB, WITA, WIT dan beberapa kota populer
      const zones = [
        ['🇮🇩 WIB (Jakarta)',    'Asia/Jakarta'],
        ['🇮🇩 WITA (Makassar)', 'Asia/Makassar'],
        ['🇮🇩 WIT (Jayapura)',  'Asia/Jayapura'],
        ['🇸🇬 Singapore',       'Asia/Singapore'],
        ['🇯🇵 Tokyo',           'Asia/Tokyo'],
        ['🇦🇪 Dubai',           'Asia/Dubai'],
        ['🇬🇧 London',          'Europe/London'],
        ['🇺🇸 New York',        'America/New_York'],
      ];

      const timeList = zones.map(([label, tz]) => {
        const t = moment().tz(tz).format('HH:mm:ss • DD MMM YYYY');
        return `${label}\n   🕐 \`${t}\``;
      }).join('\n\n');

      return reply([
        `⏰ *ZONA WAKTU* nya~`,
        ``,
        timeList,
        ``,
        `💡 Ketik \`.waktu <kota>\` untuk zona spesifik`,
        `Contoh: \`.waktu tokyo\``,
        ``,
        settings.footer,
      ].join('\n'));
    }

    const key = text.toLowerCase().trim();
    const tz  = TIMEZONES[key];

    if (!tz) {
      try {
        // Coba langsung sebagai timezone string
        const t = moment().tz(text).format('HH:mm:ss • dddd, DD MMMM YYYY');
        return reply([
          `⏰ *WAKTU DI ${text.toUpperCase()}* nya~`,
          ``,
          `🕐 ${t}`,
          ``,
          settings.footer,
        ].join('\n'));
      } catch {
        return reply(`❌ Zona waktu "${text}" tidak ditemukan nya~\nCoba: jakarta, tokyo, london, new york, dll.`);
      }
    }

    const t   = moment().tz(tz).format('HH:mm:ss • dddd, DD MMMM YYYY');
    const day = moment().tz(tz).format('dddd');

    await reply([
      `⏰ *WAKTU DI ${key.toUpperCase()}* nya~`,
      ``,
      `🕐 \`${t}\``,
      `📅 Hari: *${day}*`,
      `🌍 Zone: \`${tz}\``,
      ``,
      settings.footer,
    ].join('\n'));
  },
};
