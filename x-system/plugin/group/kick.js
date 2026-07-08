'use strict';
const settings = require('../../../settings');

module.exports = {
  commands:  ['kick', 'keluarkan', 'remove'],
  category:  'Group',
  description: 'Keluarkan member dari grup~',
  usage:     '.kick @tag',
  groupOnly: true,
  adminOnly: true,
  botAdmin:  true,

  async handler(sock, m, { mentions, quotedSender, isOwner, reply, react }) {
    const target = mentions[0] || quotedSender;
    if (!target) return reply('❓ Tag atau reply pesan member yang mau dikeluarkan ya~');

    const targetName = `@${target.split('@')[0]}`;

    try {
      await react('⏳');
      await sock.groupParticipantsUpdate(m.key.remoteJid, [target], 'remove');
      await react('✅');
      await reply([
        `👢 *${targetName} telah dikeluarkan dari grup!*`,
        ``,
        `📋 Dikeluarkan oleh admin~`,
        `🐾 Sampai jumpa nya~ UwU`,
        ``,
        settings.footer,
      ].join('\n'));
    } catch {
      await react('❌');
      await reply(`❌ Gagal mengeluarkan ${targetName} nya~\nPastikan Mino adalah admin ya UwU`);
    }
  },
};
