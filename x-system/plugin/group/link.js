'use strict';
const settings = require('../../../settings');

module.exports = {
  commands:  ['link', 'grouplink', 'invitelink'],
  category:  'Group',
  description: 'Dapatkan link invite grup~',
  usage:     '.link',
  groupOnly: true,
  botAdmin:  true,

  async handler(sock, m, { groupMetadata, reply, react }) {
    try {
      await react('🔗');
      const code = await sock.groupInviteCode(m.key.remoteJid);
      const link = `https://chat.whatsapp.com/${code}`;

      await reply([
        `🔗 *LINK GRUP* nya~`,
        ``,
        `📛 *${groupMetadata.subject}*`,
        ``,
        `🌐 ${link}`,
        ``,
        `⚠️ Jangan share sembarangan ya~ UwU`,
        ``,
        settings.footer,
      ].join('\n'));
    } catch {
      await react('❌');
      await reply(`❌ Gagal ambil link grup nya~\nPastikan Mino adalah admin ya UwU`);
    }
  },
};
