'use strict';
const axios    = require('axios');
const settings = require('../../../set/settings');
const { randPick } = require('../../../lib/utils');

const CATEGORIES = ['waifu', 'neko', 'shinobu', 'mori-calliope', 'raiden-shogun', 'oppai', 'uniform', 'kamisato-ayaka'];
const SAFE_CATS  = ['waifu', 'neko', 'shinobu', 'mori-calliope', 'raiden-shogun', 'uniform', 'kamisato-ayaka'];

module.exports = {
  commands: ['waifu', 'anime', 'animegirl'],
  category: 'Fun',
  description: 'Random waifu image dari waifu.pics~',
  usage: '.waifu',

  async handler(sock, m, { args, reply, react }) {
    await react('🌸');
    const cat = args[0] && SAFE_CATS.includes(args[0]) ? args[0] : randPick(SAFE_CATS);

    try {
      const { data } = await axios.get(`https://api.waifu.pics/sfw/${cat}`, { timeout: 10000 });
      const imgUrl   = data.url;
      if (!imgUrl) throw new Error('No image URL');

      const imgBuf = await axios.get(imgUrl, { responseType: 'arraybuffer', timeout: 15000 });

      await sock.sendMessage(m.key.remoteJid, {
        image:   Buffer.from(imgBuf.data),
        caption: `🌸 *Waifu ${cat}* nya~\n\nUwU kawaii desu~! 💕\n\n${settings.footer}`,
      }, { quoted: m });

      await react('💕');
    } catch {
      await react('❌');
      await reply(`❌ Gagal ambil waifu image nya~\nCoba lagi ya UwU`);
    }
  },
};
