'use strict';
const settings = require('../../../settings');

module.exports = {
  commands:  ['mute', 'unmute'],
  category:  'Group',
  description: 'Mute/unmute grup (hanya admin yang bisa chat)~',
  usage:     '.mute | .unmute',
  groupOnly: true,
  adminOnly: true,
  botAdmin:  true,

  async handler(sock, m, { command, reply, react }) {
    const isMute = command === 'mute';
    try {
      await react('⏳');
      await sock.groupSettingUpdate(m.key.remoteJid, isMute ? 'announcement' : 'not_announcement');
      await react('✅');
      await reply(isMute
        ? `🔇 *Grup di-mute!* Sekarang hanya admin yang bisa mengirim pesan nya~\n\n${settings.footer}`
        : `🔊 *Grup di-unmute!* Semua member bisa chat lagi ya~ UwU\n\n${settings.footer}`
      );
    } catch {
      await react('❌');
      await reply(`❌ Gagal ${isMute ? 'mute' : 'unmute'} grup nya~\nPastikan Mino adalah admin ya UwU`);
    }
  },
};
