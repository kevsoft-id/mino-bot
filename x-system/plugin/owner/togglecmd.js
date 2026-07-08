'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings  = require('../../../settings');
const store     = require('../../../lib/store');

if (!global.disabledCmds) {
  global.disabledCmds = new Set(Object.keys(store.getAll('disabledCmds')));
}

module.exports = {
  commands:    ['togglecmd', 'disable', 'enable', 'disablecmd', 'enablecmd'],
  category:    'Owner',
  description: 'Aktifkan / nonaktifkan perintah bot secara spesifik 🔧',
  usage:       '.disable <cmd>  |  .enable <cmd>  |  .disable list',
  ownerOnly:   true,

  async handler(sock, m, { command, args, reply }) {
    const { theme } = settings;
    const isDisable = ['disable', 'disablecmd', 'togglecmd'].includes(command);

    if (args[0] === 'list') {
      const list = [...global.disabledCmds];
      return reply([
        theme.header, '',
        ` ⬡  🔧  ${theme.bold('DISABLED COMMANDS')}`, '',
        list.length ? list.map(c => `  ❌ .${c}`).join('\n') : '  ✅ Tidak ada perintah yang dinonaktifkan.',
        '', theme.footer,
      ].join('\n'));
    }

    const cmd = args[0]?.toLowerCase().replace(/^\./, '');
    if (!cmd) return reply(`❓ Contoh:\n  .disable wiki\n  .enable wiki\n  .disable list`);

    if (!global.plugins?.has(cmd)) return reply(`❌ Perintah *.${cmd}* tidak ditemukan.`);

    if (isDisable) {
      global.disabledCmds.add(cmd);
      store.set('disabledCmds', cmd, true);
      return reply(`✅ Perintah *.${cmd}* telah *dinonaktifkan*.\nAktifkan lagi: .enable ${cmd}`);
    } else {
      global.disabledCmds.delete(cmd);
      store.del('disabledCmds', cmd);
      return reply(`✅ Perintah *.${cmd}* telah *diaktifkan* kembali.`);
    }
  },
};
