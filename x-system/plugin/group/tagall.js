'use strict';
const settings = require('../../../set/settings');

module.exports = {
  commands:  ['tagall', 'everyone', 'everyone'],
  category:  'Group',
  description: 'Tag semua member di grup~',
  usage:     '.tagall [pesan]',
  groupOnly: true,
  adminOnly: false,

  async handler(sock, m, { text, groupMetadata, isAdmin, isOwner, reply }) {
    if (!isAdmin && !isOwner) return reply('❌ Cuma admin yang boleh tagall nya~');

    const members  = groupMetadata.participants;
    const mentions = members.map(p => p.id);

    const header = text || `🐾 Hai semua~ ada pengumuman nih! Mino manggil kalian semua UwU`;
    const list   = members.map((p, i) => `${i + 1}. @${p.id.split('@')[0]}`).join('\n');

    await sock.sendMessage(m.key.remoteJid, {
      text: `${header}\n\n${list}\n\n${settings.footer}`,
      mentions,
    }, { quoted: m });
  },
};
