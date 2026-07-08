'use strict';
const settings = require('../../../settings');

module.exports = {
  commands:  ['block', 'unblock', 'blokir', 'unblokir'],
  category:  'Owner',
  description: 'Blokir/unblokir pengguna~',
  usage:     '.block @tag | .unblock @tag',
  ownerOnly: true,

  async handler(sock, m, { command, mentions, quotedSender, args, reply, react }) {
    const target = mentions[0] || quotedSender ||
      (args[0] ? (args[0].replace(/\D/g, '') + '@s.whatsapp.net') : null);

    if (!target) return reply(`❓ Tag atau masukkan nomor yang mau di-${command} ya~`);

    const isBlock = command === 'block' || command === 'blokir';
    const action  = isBlock ? 'block' : 'unblock';
    const name    = `@${target.split('@')[0]}`;

    try {
      await react('⏳');
      await sock.updateBlockStatus(target, action);
      await react('✅');
      await reply(isBlock
        ? `🚫 *${name} berhasil diblokir!* nya~\nMereka tidak bisa mengirim pesan ke bot lagi UwU\n\n${settings.footer}`
        : `✅ *${name} berhasil di-unblokir!* nya~\nMereka bisa chat lagi sekarang UwU\n\n${settings.footer}`
      );
    } catch (err) {
      await react('❌');
      await reply(`❌ Gagal ${isBlock ? 'blokir' : 'unblokir'} pengguna nya~\n${err.message}`);
    }
  },
};
