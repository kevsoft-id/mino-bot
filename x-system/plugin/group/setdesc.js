'use strict';
const settings = require('../../../set/settings');

module.exports = {
  commands:  ['setdesc', 'setdeskripsi', 'changedesc'],
  category:  'Group',
  description: 'Ubah deskripsi grup~',
  usage:     '.setdesc <deskripsi baru>',
  groupOnly: true,
  adminOnly: true,
  botAdmin:  true,

  async handler(sock, m, { text, reply, react }) {
    if (!text) return reply('❓ Masukkan deskripsi baru ya~\nContoh: `.setdesc Selamat datang di grup ini!`');

    try {
      await react('⏳');
      await sock.groupUpdateDescription(m.key.remoteJid, text);
      await react('✅');
      await reply(`✅ *Deskripsi grup berhasil diubah!* nya~\n\n📝 Deskripsi baru:\n${text}\n\n${settings.footer}`);
    } catch {
      await react('❌');
      await reply(`❌ Gagal ubah deskripsi grup nya~\nPastikan Mino adalah admin ya UwU`);
    }
  },
};
