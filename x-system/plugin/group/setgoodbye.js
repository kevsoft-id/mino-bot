'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../set/settings');
const store    = require('../../../lib/store');

module.exports = {
  commands:    ['setgoodbye', 'sgoodbye', 'setbye'],
  category:    'Group',
  description: 'Set pesan perpisahan custom saat member keluar 👋',
  usage:       '.setgoodbye <pesan>  |  .setgoodbye off',
  groupOnly:   true,
  adminOnly:   true,

  async handler(sock, m, { text, args, jid, reply }) {
    const { theme } = settings;

    if (!text || args[0] === 'off' || args[0] === 'reset') {
      store.del('goodbyeMsg', jid);
      return reply(`✅ Goodbye message telah *dinonaktifkan* (kembali ke default).`);
    }

    if (args[0] === 'cek') {
      const msg = store.get('goodbyeMsg', jid);
      if (!msg) return reply('📭 Belum ada custom goodbye message.');
      return reply(`${theme.header}\n\n ⬡  Goodbye message:\n\n${msg}\n\n${theme.footer}`);
    }

    store.set('goodbyeMsg', jid, text);
    return reply([
      theme.header, '',
      ` ✅  ${theme.bold('GOODBYE MESSAGE DISET!')}`, '',
      `  Variabel: {name} {number} {group}`,
      '',
      `  Preview:`,
      text.replace('{name}', 'User').replace('{number}', '628xxx').replace('{group}', 'Nama Grup'),
      '', theme.footer,
    ].join('\n'));
  },
};
