'use strict';
const settings = require('../../../settings');

// Simpan per-group setting
const antilinkData = {}; // groupJid -> boolean

function isLink(text) {
  return /(https?:\/\/|www\.|bit\.ly|tinyurl|t\.me|wa\.me|chat\.whatsapp\.com)/i.test(text);
}

module.exports = {
  commands:  ['antilink', 'al'],
  category:  'Group',
  description: 'Toggle anti link di grup~',
  usage:     '.antilink on/off',
  groupOnly: true,
  adminOnly: true,

  async handler(sock, m, { args, jid, isOwner, isAdmin, reply, react }) {
    if (!args[0]) {
      const status = antilinkData[jid] ? '🟢 ON' : '🔴 OFF';
      return reply(`🔗 *Anti Link* saat ini: *${status}*\n\nGunakan: \`.antilink on\` atau \`.antilink off\``);
    }

    const mode = args[0].toLowerCase();
    if (!['on', 'off'].includes(mode)) return reply('❓ Ketik `.antilink on` atau `.antilink off` ya~');

    antilinkData[jid] = mode === 'on';
    await react('✅');
    await reply([
      `🔗 *Anti Link ${mode.toUpperCase()}!*`,
      ``,
      mode === 'on'
        ? `✅ Sekarang link apapun akan langsung dihapus & pengirimnya dikick nya~`
        : `❌ Anti link dimatikan, member boleh kirim link lagi UwU`,
      ``,
      settings.footer,
    ].join('\n'));
  },

  // Expose data untuk handler
  getStatus: (jid) => !!antilinkData[jid],
};
