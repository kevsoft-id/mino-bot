'use strict';
const settings = require('../../../settings');

module.exports = {
  commands:  ['setbotname', 'namabot', 'botname'],
  category:  'Owner',
  description: 'Ubah nama profil bot~',
  usage:     '.setbotname <nama baru>',
  ownerOnly: true,

  async handler(sock, m, { text, reply, react }) {
    if (!text) return reply(`📛 Nama bot saat ini: *${settings.botName}*\n\nGunakan: \`.setbotname <nama baru>\``);

    try {
      await react('⏳');
      await sock.updateProfileName(text);
      settings.botName = text;
      await react('✅');
      await reply(`✅ *Nama bot berhasil diubah!*\n\n📛 Nama baru: *${text}*\n\n${settings.footer}`);
    } catch (err) {
      await react('❌');
      await reply(`❌ Gagal ubah nama bot nya~\n${err.message}`);
    }
  },
};
