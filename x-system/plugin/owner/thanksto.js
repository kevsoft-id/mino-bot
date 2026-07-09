'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../settings');

module.exports = {
  commands:    ['thanksto', 'credits', 'about', 'tentang', 'credit'],
  category:    'Owner',
  description: 'Informasi tentang bot dan developer',
  usage:       '.thanksto  |  .about',

  async handler(sock, m, { reply, react }) {
    const { theme } = settings;
    await react('💙');

    await reply([
      theme.header,
      '',
      ` ⬡  💙  ${theme.bold('ABOUT & CREDITS')}`,
      '',
      `    📦 *Bot Name* : ${settings.botName}`,
      `    🔢 *Version*  : ${settings.botVersion}`,
      `    📝 *Deskripsi*: ${settings.botDesc}`,
      `    🌐 *Website*  : ${settings.webUrl}`,
      '',
      ` ⬡  👤  ${theme.bold('DEVELOPER')}`,
      '',
      `    🧑‍💻 *Kevin* (KevSoft-ID)`,
      `    🐙 GitHub : github.com/kevsoft-id`,
      `    💬 Tag    : @kevsoft_id`,
      '',
      ` ⬡  🙏  ${theme.bold('THANKS TO')}`,
      '',
      `    • @whiskeysockets/baileys — WA Connection`,
      `    • OpenRouter — AI Integration`,
      `    • ElevenLabs — Text to Speech`,
      `    • Pollinations.ai — AI Image`,
      `    • Google TTS — Free Voice Note`,
      `    • BMKG — Earthquake Data`,
      `    • Aladhan API — Prayer Times`,
      `    • CoinGecko — Crypto Prices`,
      `    • Dev.to API — Developer Articles`,
      `    • NPM Registry — Package Info`,
      `    • Wikipedia — Knowledge Base`,
      `    • MyMemory — Translation`,
      `    • Hastebin — Code Paste`,
      '',
      ` ⬡  📊  ${theme.bold('STATISTIK')}`,
      '',
      `    📌 Plugin aktif: ${global.plugins?.size || 0}`,
      `    ⏱️  Uptime: ${formatUptime(process.uptime())}`,
      `    💾 Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)} MB`,
      '',
      theme.footer,
    ].join('\n'));
  },
};

function formatUptime(sec) {
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  return [d && `${d}h`, h && `${h}j`, m && `${m}m`, `${s}d`].filter(Boolean).join(' ');
}
