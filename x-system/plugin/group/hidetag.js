'use strict';
module.exports = {
  commands:  ['hidetag', 'ht', 'everyone2'],
  category:  'Group',
  description: 'Tag semua member tapi tersembunyi~',
  usage:     '.hidetag <teks>',
  groupOnly: true,

  async handler(sock, m, { text, groupMetadata, isAdmin, isOwner, reply }) {
    if (!isAdmin && !isOwner) return reply('❌ Cuma admin yang boleh hidetag nya~');

    const mentions = groupMetadata.participants.map(p => p.id);
    const msg      = text || '📢 Pengumuman~';

    await sock.sendMessage(m.key.remoteJid, {
      text: msg,
      mentions,
    }, { quoted: m });
  },
};
