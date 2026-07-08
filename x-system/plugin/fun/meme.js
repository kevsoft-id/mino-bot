'use strict';
const axios    = require('axios');
const settings = require('../../../settings');

module.exports = {
  commands: ['meme', 'memes', 'randomememe'],
  category: 'Fun',
  description: 'Random meme dari Reddit~',
  usage: '.meme',

  async handler(sock, m, { reply, react }) {
    await react('😂');

    const subreddits = ['memes', 'dankmemes', 'me_irl', 'funny'];
    const sub = subreddits[Math.floor(Math.random() * subreddits.length)];

    try {
      const { data } = await axios.get(
        `https://meme-api.com/gimme/${sub}`,
        { timeout: 10000 }
      );

      if (!data.url || data.nsfw) throw new Error('No safe meme');

      const imgBuf = await axios.get(data.url, { responseType: 'arraybuffer', timeout: 15000 });

      await sock.sendMessage(m.key.remoteJid, {
        image:   Buffer.from(imgBuf.data),
        caption: [
          `😂 *MEME* nya~`,
          ``,
          `📝 *${data.title}*`,
          ``,
          `👍 ${data.ups?.toLocaleString() || 0} upvotes`,
          `📌 r/${data.subreddit}`,
          ``,
          settings.footer,
        ].join('\n'),
      }, { quoted: m });

      await react('😂');
    } catch {
      await react('❌');
      await reply(`❌ Gagal ambil meme nya~\nCoba lagi ya UwU`);
    }
  },
};
