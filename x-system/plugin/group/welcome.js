'use strict';

// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../set/settings');

// Per-group welcome toggle (stored in global.db)
function getWelcomeState(jid) {
  return global.db?.welcome?.[jid] ?? settings.welcomeMsg;
}

function setWelcomeState(jid, val) {
  if (!global.db.welcome) global.db.welcome = {};
  global.db.welcome[jid] = val;
}

module.exports = {
  commands:  ['welcome', 'selamatdatang', 'greet'],
  category:  'Group',
  description: 'Aktifkan/matikan pesan selamat datang & goodbye di grup',
  usage:     '.welcome on | .welcome off | .welcome status',
  groupOnly: true,
  adminOnly: true,

  async handler(sock, m, { args, jid, reply, react }) {
    const { theme } = settings;
    const mode = args[0]?.toLowerCase();
    const current = getWelcomeState(jid);

    if (!mode || mode === 'status') {
      return reply([
        theme.header,
        '',
        ` ⬡  👋  ${theme.bold('WELCOME MESSAGE')}`,
        '',
        `    ${theme.bullet} ${theme.bold('Status')}  : ${current ? '🟢 AKTIF' : '🔴 NONAKTIF'}`,
        `    ${theme.bullet} ${theme.bold('Usage')}   : .welcome on / off`,
        '',
        theme.footer,
      ].join('\n'));
    }

    if (!['on', 'off'].includes(mode)) {
      return reply(`❌ Gunakan \`.welcome on\` atau \`.welcome off\``);
    }

    const val = mode === 'on';
    setWelcomeState(jid, val);
    await react('✅');
    await reply([
      theme.header,
      '',
      ` ⬡  👋  ${theme.bold('WELCOME MESSAGE')}`,
      '',
      `    ${theme.bullet} ${theme.bold('Status')}  : ${val ? '🟢 AKTIF' : '🔴 NONAKTIF'}`,
      `    ${val
        ? `${theme.bullet} Pesan selamat datang & goodbye akan dikirim otomatis.`
        : `${theme.bullet} Pesan selamat datang & goodbye dimatikan.`}`,
      '',
      theme.footer,
    ].join('\n'));
  },

  // Expose untuk utils.js
  getWelcomeState,
};
