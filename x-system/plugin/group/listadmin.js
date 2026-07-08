'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../settings');
const { replyImage } = require('../../../lib/utils');

module.exports = {
  commands:    ['listadmin', 'admins', 'admin'],
  category:    'Group',
  description: 'Tampilkan daftar admin di grup ini 👮',
  usage:       '.listadmin',
  groupOnly:   true,

  async handler(sock, m, { groupMetadata, jid, reply }) {
    const { theme } = settings;
    const admins = groupMetadata.participants.filter(p => p.admin);

    const lines = [
      theme.header, '',
      ` ⬡  👮  ${theme.bold('DAFTAR ADMIN GRUP')}`,
      ` 📛 ${groupMetadata.subject}`, '',
    ];

    admins.forEach((a, i) => {
      const num  = a.id.split('@')[0];
      const role = a.admin === 'superadmin' ? '👑 Creator' : '🔑 Admin';
      lines.push(`  ${i + 1}. @${num}  ${role}`);
    });

    lines.push('');
    lines.push(`  Total: ${admins.length} admin dari ${groupMetadata.participants.length} member`);
    lines.push('', theme.footer);

    await sock.sendMessage(jid, {
      text: lines.join('\n'),
      mentions: admins.map(a => a.id),
    }, { quoted: m });
  },
};
