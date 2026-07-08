'use strict';
const settings = require('../../../settings');

module.exports = {
  commands:  ['demote', 'turunadmin', 'dem'],
  category:  'Group',
  description: 'Turunkan admin grup menjadi member biasa~',
  usage:     '.demote @tag',
  groupOnly: true,
  adminOnly: true,
  botAdmin:  true,

  async handler(sock, m, { mentions, quotedSender, reply, react }) {
    const target = mentions[0] || quotedSender;
    if (!target) return reply('❓ Tag atau reply pesan admin yang mau diturunkan ya~');

    try {
      await react('⏳');
      await sock.groupParticipantsUpdate(m.key.remoteJid, [target], 'demote');
      await react('✅');
      await reply([
        `📉 *@${target.split('@')[0]} diturunkan dari Admin!*`,
        ``,
        `😔 Sayang sekali ya~ tapi mungkin ini yang terbaik UwU`,
        ``,
        settings.footer,
      ].join('\n'));
    } catch {
      await react('❌');
      await reply(`❌ Gagal demote admin nya~\nPastikan Mino adalah admin ya UwU`);
    }
  },
};
