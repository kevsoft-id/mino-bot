'use strict';
const settings = require('../../../set/settings');

module.exports = {
  commands:  ['setname', 'setnama', 'namagrup'],
  category:  'Group',
  description: 'Ganti nama grup~',
  usage:     '.setname <nama baru>',
  groupOnly: true,
  adminOnly: true,
  botAdmin:  true,

  async handler(sock, m, { text, reply, react }) {
    if (!text) return reply('❓ Masukkan nama baru untuk grup ya~\nContoh: `.setname Grup Kece 2026`');
    if (text.length > 25) return reply('❌ Nama grup maksimal 25 karakter ya nya~');

    try {
      await react('⏳');
      await sock.groupUpdateSubject(m.key.remoteJid, text);
      await react('✅');
      await reply(`✅ *Nama grup berhasil diubah!* nya~\n\n📛 Nama baru: *${text}*\n\n${settings.footer}`);
    } catch {
      await react('❌');
      await reply(`❌ Gagal ubah nama grup nya~\nPastikan Mino adalah admin ya UwU`);
    }
  },
};
