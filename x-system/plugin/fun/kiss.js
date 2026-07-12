'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../set/settings');
const axios    = require('axios');
const { replyGif } = require('../../../lib/utils');

module.exports = {
  commands:    ['kiss', 'cium'],
  category:    'Fun',
  description: 'Kirim ciuman anime ke seseorang 😘',
  usage:       '.kiss @user',

  async handler(sock, m, { mentions, pushName, reply }) {
    const target = mentions[0] ? `@${mentions[0].split('@')[0]}` : 'seseorang';
    try {
      const res    = await axios.get('https://nekos.best/api/v2/kiss', { timeout: 8000 });
      const gifUrl = res.data.results[0].url;
      const anime  = res.data.results[0].anime_name || 'anime';
      await replyGif(sock, m, gifUrl,
        `😘 *${pushName}* mencium ${target}!\n🎬 Source: ${anime}\n\n${settings.footer}`
      );
    } catch {
      await reply(`😘 *${pushName}* mencium ${target}! ~kyaa~\n\n${settings.footer}`);
    }
  },
};
