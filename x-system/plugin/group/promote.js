'use strict';
const settings = require('../../../set/settings');

module.exports = {
  commands:  ['promote', 'jadiadmin', 'prom'],
  category:  'Group',
  description: 'Jadikan member sebagai admin grup~',
  usage:     '.promote @tag',
  groupOnly: true,
  adminOnly: true,
  botAdmin:  true,

  async handler(sock, m, { mentions, quotedSender, reply, react }) {
    const target = mentions[0] || quotedSender;
    if (!target) return reply('❓ Tag atau reply pesan member yang mau dijadikan admin ya~');

    try {
      await react('⏳');
      await sock.groupParticipantsUpdate(m.key.remoteJid, [target], 'promote');
      await react('✅');
      await reply([
        `👑 *@${target.split('@')[0]} sekarang jadi Admin!*`,
        ``,
        `🎉 Selamat atas kenaikan jabatan nya~`,
        `Gunakan power admin dengan bijak ya UwU`,
        ``,
        settings.footer,
      ].join('\n'));
    } catch {
      await react('❌');
      await reply(`❌ Gagal promote member nya~\nPastikan Mino adalah admin ya UwU`);
    }
  },
};
