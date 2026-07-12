'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../set/settings');
const store    = require('../../../lib/store');

module.exports = {
  commands:    ['delowner', 'removeowner', 'hapusowner'],
  category:    'Owner',
  description: 'Hapus nomor dari daftar owner bot 👑',
  usage:       '.delowner <nomor>  |  .delowner list',
  ownerOnly:   true,

  async handler(sock, m, { args, mentions, reply }) {
    const { theme } = settings;

    if (args[0] === 'list') {
      return reply([
        theme.header, '',
        ` ⬡  👑  ${theme.bold('DAFTAR OWNER')}`, '',
        ...settings.ownerNumber.map((n, i) => `  ${i + 1}. ${n}`),
        '', theme.footer,
      ].join('\n'));
    }

    let number = mentions[0]?.split('@')[0] || args[0]?.replace(/\D/g, '');
    if (!number) return reply('❓ Masukkan nomor yang ingin dihapus.\nContoh: .delowner 628xxx');

    const idx = settings.ownerNumber.indexOf(number);
    if (idx === -1) return reply(`❌ Nomor *${number}* tidak ada di daftar owner.`);
    if (settings.ownerNumber.length === 1) return reply('❌ Tidak bisa hapus owner terakhir!');

    settings.ownerNumber.splice(idx, 1);
    store.del('extraOwners', number);

    return reply([
      theme.header, '',
      ` ✅  ${theme.bold('OWNER DIHAPUS')}`, '',
      `  ❌ Nomor : ${number}`,
      `  📋 Sisa owner: ${settings.ownerNumber.length}`,
      '', theme.footer,
    ].join('\n'));
  },
};
