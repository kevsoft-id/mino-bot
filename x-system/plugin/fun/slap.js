'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../settings');
const axios    = require('axios');
const { replyGif } = require('../../../lib/utils');

module.exports = {
  commands:    ['slap', 'tampar', 'gaplok'],
  category:    'Fun',
  description: 'Tampar seseorang dengan penuh kasih sayang 👋',
  usage:       '.slap @user',

  async handler(sock, m, { mentions, pushName, reply }) {
    const target = mentions[0] ? `@${mentions[0].split('@')[0]}` : 'seseorang';
    try {
      const res    = await axios.get('https://nekos.best/api/v2/slap', { timeout: 8000 });
      const gifUrl = res.data.results[0].url;
      const anime  = res.data.results[0].anime_name || 'anime';
      await replyGif(sock, m, gifUrl,
        `👋 *${pushName}* menampar ${target}! PAAKK!!\n🎬 Source: ${anime}\n\n${settings.footer}`
      );
    } catch {
      await reply(`👋 *${pushName}* PAAKK!! menampar ${target}! 💀\n\n${settings.footer}`);
    }
  },
};
