'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../set/settings');
const axios    = require('axios');
const { replyGif } = require('../../../lib/utils');

module.exports = {
  commands:    ['hug', 'peluk'],
  category:    'Fun',
  description: 'Kirim pelukan anime ke seseorang 🤗',
  usage:       '.hug @user',

  async handler(sock, m, { mentions, pushName, reply }) {
    const target = mentions[0] ? `@${mentions[0].split('@')[0]}` : 'semua';
    try {
      const res    = await axios.get('https://nekos.best/api/v2/hug', { timeout: 8000 });
      const gifUrl = res.data.results[0].url;
      const anime  = res.data.results[0].anime_name || 'anime';
      await replyGif(sock, m, gifUrl,
        `🤗 *${pushName}* memeluk ${target}!\n🎬 Source: ${anime}\n\n${settings.footer}`
      );
    } catch {
      await reply(`🤗 *${pushName}* memeluk ${target}! ~OwO~\n\n${settings.footer}`);
    }
  },
};
