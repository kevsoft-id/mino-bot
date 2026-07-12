'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../set/settings');

module.exports = {
  commands:    ['listmember', 'members', 'anggota'],
  category:    'Group',
  description: 'Tampilkan daftar semua member di grup ini 👥',
  usage:       '.listmember',
  groupOnly:   true,

  async handler(sock, m, { groupMetadata, jid, reply }) {
    const { theme } = settings;
    const members = groupMetadata.participants;

    const lines = [
      theme.header, '',
      ` ⬡  👥  ${theme.bold('DAFTAR MEMBER GRUP')}`,
      ` 📛 ${groupMetadata.subject}`,
      ` 👤 Total: ${members.length} anggota`, '',
    ];

    members.forEach((p, i) => {
      const num  = p.id.split('@')[0];
      const role = p.admin === 'superadmin' ? ' 👑' : p.admin ? ' 🔑' : '';
      lines.push(`  ${String(i + 1).padStart(3)}. @${num}${role}`);
    });
    lines.push('', theme.footer);

    // Send as plain text with mentions (avoid spam for large groups)
    if (members.length > 50) {
      return reply([
        theme.header, '',
        ` ⬡  👥  ${theme.bold('INFO GRUP')}`, '',
        `  📛 Nama    : ${groupMetadata.subject}`,
        `  👥 Member  : ${members.length} orang`,
        `  👮 Admin   : ${members.filter(p => p.admin).length} orang`,
        `  📅 Dibuat  : ${new Date(groupMetadata.creation * 1000).toLocaleDateString('id-ID')}`,
        '', theme.footer,
      ].join('\n'));
    }

    await sock.sendMessage(jid, {
      text: lines.join('\n'),
      mentions: members.map(p => p.id),
    }, { quoted: m });
  },
};
