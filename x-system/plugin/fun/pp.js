'use strict';
const settings = require('../../../set/settings');

module.exports = {
  commands: ['pp', 'foto', 'profil', 'avatar'],
  category: 'Fun',
  description: 'Lihat foto profil seseorang~',
  usage: '.pp @tag atau .pp (reply pesan)',

  async handler(sock, m, { mentions, quotedSender, args, reply, react }) {
    await react('📸');

    const target = mentions[0] || quotedSender ||
      (args[0] ? (args[0].replace(/\D/g, '') + '@s.whatsapp.net') : m.key.remoteJid);

    try {
      const url = await sock.profilePictureUrl(target, 'image');
      const axios = require('axios');
      const buf   = await axios.get(url, { responseType: 'arraybuffer', timeout: 10000 });

      await sock.sendMessage(m.key.remoteJid, {
        image:   Buffer.from(buf.data),
        caption: `📸 *Foto Profil* nya~\n\n👤 @${target.split('@')[0]}\n\n${settings.footer}`,
        mentions: [target],
      }, { quoted: m });

      await react('✅');
    } catch {
      await react('❌');
      await reply(`❌ Gagal ambil foto profil nya~\nMungkin tidak ada foto profil atau privasi dibatasi UwU`);
    }
  },
};
