'use strict';
const axios    = require('axios');
const settings = require('../../../settings');

const WEATHER_EMOJI = {
  'Clear': '☀️', 'Clouds': '☁️', 'Rain': '🌧️', 'Drizzle': '🌦️',
  'Thunderstorm': '⛈️', 'Snow': '❄️', 'Mist': '🌫️', 'Fog': '🌁',
  'Haze': '😶‍🌫️', 'Smoke': '💨', 'Tornado': '🌪️',
};

module.exports = {
  commands: ['cuaca', 'weather', 'langit'],
  category: 'Tools',
  description: 'Cek info cuaca suatu kota~',
  usage: '.cuaca <nama kota>',

  async handler(sock, m, { text, reply, react }) {
    if (!text) return reply('❓ Masukkan nama kota nya~\nContoh: `.cuaca Jakarta`');

    await react('🌤️');

    try {
      // Menggunakan wttr.in yang free dan tidak butuh API key
      const { data } = await axios.get(
        `https://wttr.in/${encodeURIComponent(text)}?format=j1`,
        { timeout: 10000 }
      );

      const current  = data.current_condition[0];
      const area     = data.nearest_area[0];
      const cityName = area.areaName[0].value;
      const country  = area.country[0].value;
      const desc     = current.weatherDesc[0].value;
      const temp     = current.temp_C;
      const feels    = current.FeelsLikeC;
      const humidity = current.humidity;
      const wind     = current.windspeedKmph;
      const uv       = current.uvIndex;
      const visibility = current.visibility;

      const emoji = WEATHER_EMOJI[desc] || '🌡️';

      await react('✅');
      await reply([
        `🌤️ *INFO CUACA* nya~`,
        ``,
        `📍 *Lokasi  :* ${cityName}, ${country}`,
        ``,
        `${emoji} *Kondisi  :* ${desc}`,
        `🌡️ *Suhu    :* ${temp}°C (Terasa ${feels}°C)`,
        `💧 *Kelembaban:* ${humidity}%`,
        `💨 *Angin   :* ${wind} km/h`,
        `👁️ *Visibilitas:* ${visibility} km`,
        `☀️ *UV Index :* ${uv}`,
        ``,
        `📅 Diperbarui: ${new Date().toLocaleString('id-ID', { timeZone: settings.timezone })}`,
        ``,
        settings.footer,
      ].join('\n'));
    } catch {
      await react('❌');
      await reply(`❌ Kota "${text}" tidak ditemukan nya~\nCoba nama kota dalam bahasa Inggris ya UwU`);
    }
  },
};
