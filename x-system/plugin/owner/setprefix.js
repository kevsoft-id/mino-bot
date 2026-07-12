'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../set/settings');
const store    = require('../../../lib/store');

// Load persisted prefix on startup
const savedPrefix = store.get('config', 'prefix');
if (savedPrefix) settings.prefix = savedPrefix;

module.exports = {
  commands:    ['setprefix', 'prefix'],
  category:    'Owner',
  description: 'Ubah prefix perintah bot (persistent) ⚙️',
  usage:       '.setprefix <karakter>  contoh: .setprefix !',
  ownerOnly:   true,

  async handler(sock, m, { args, reply }) {
    const { theme } = settings;
    const newPrefix = args[0];
    if (!newPrefix) return reply(`ℹ️ Prefix saat ini: *${settings.prefix}*\n\nContoh ubah: .setprefix !`);
    if (newPrefix.length > 3) return reply('❌ Prefix maksimal 3 karakter.');

    const old = settings.prefix;
    settings.prefix = newPrefix;
    store.set('config', 'prefix', newPrefix);

    return reply([
      theme.header, '',
      ` ✅  ${theme.bold('PREFIX DIUBAH')}`, '',
      `  Sebelumnya : *${old}*`,
      `  Sekarang   : *${newPrefix}*`,
      '',
      `  Contoh perintah: ${newPrefix}menu`,
      '', theme.footer,
    ].join('\n'));
  },
};
