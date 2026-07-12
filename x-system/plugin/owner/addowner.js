'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../set/settings');
const store    = require('../../../lib/store');

// Sync extra owners from store on load
const extraOwners = store.getAll('extraOwners');
for (const num of Object.keys(extraOwners)) {
  if (!settings.ownerNumber.includes(num)) settings.ownerNumber.push(num);
}

module.exports = {
  commands:    ['addowner', 'tambaowner'],
  category:    'Owner',
  description: 'Tambah nomor owner bot (runtime + persistent) 👑',
  usage:       '.addowner <nomor>  atau  .addowner @tag',
  ownerOnly:   true,

  async handler(sock, m, { args, mentions, reply }) {
    const { theme } = settings;
    let number = mentions[0]?.split('@')[0] || args[0]?.replace(/\D/g, '');
    if (!number) return reply('❓ Masukkan nomor atau tag user.\nContoh: .addowner 628xxx');
    if (settings.ownerNumber.includes(number)) return reply(`⚠️ *${number}* sudah menjadi owner.`);
    settings.ownerNumber.push(number);
    store.set('extraOwners', number, true);
    return reply([
      theme.header, '',
      ` ✅  ${theme.bold('OWNER DITAMBAHKAN')}`, '',
      `  👑 Nomor : ${number}`,
      `  📋 Total owner: ${settings.ownerNumber.length}`,
      '', theme.footer,
    ].join('\n'));
  },
};
