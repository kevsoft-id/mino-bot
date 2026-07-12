'use strict';
const axios    = require('axios');
const settings = require('../../../set/settings');

module.exports = {
  commands: ['neko', 'nekoimage', 'catgirl'],
  category: 'Fun',
  description: 'Random neko (cat girl) image~',
  usage: '.neko',

  async handler(sock, m, { reply, react }) {
    await react('🐾');

    try {
      const { data } = await axios.get('https://nekos.life/api/v2/img/neko', { timeout: 10000 });
      const imgUrl   = data.url;
      if (!imgUrl) throw new Error('No image');

      const imgBuf = await axios.get(imgUrl, { responseType: 'arraybuffer', timeout: 15000 });

      await sock.sendMessage(m.key.remoteJid, {
        image:   Buffer.from(imgBuf.data),
        caption: `🐾 *Neko Image* nya~\n\nNyaaaa~ kawaii banget! UwU 💕\n\n${settings.footer}`,
      }, { quoted: m });

      await react('🐱');
    } catch {
      try {
        // Fallback ke waifu.pics neko
        const { data } = await axios.get('https://api.waifu.pics/sfw/neko', { timeout: 10000 });
        const imgBuf   = await axios.get(data.url, { responseType: 'arraybuffer', timeout: 15000 });

        await sock.sendMessage(m.key.remoteJid, {
          image:   Buffer.from(imgBuf.data),
          caption: `🐾 *Neko Image* nya~\n\nNyaaaa~ kawaii! UwU 💕\n\n${settings.footer}`,
        }, { quoted: m });
      } catch {
        await react('❌');
        await reply(`❌ Gagal ambil neko image nya~\nCoba lagi ya UwU`);
      }
    }
  },
};
