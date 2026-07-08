'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../settings');
const store    = require('../../../lib/store');

if (!global.antiPM) global.antiPM = store.get('config', 'antipm') || false;

module.exports = {
  commands:    ['antipm'],
  category:    'Owner',
  description: 'Toggle anti-PM — bot auto-reply & blokir pesan private 🔒',
  usage:       '.antipm  (toggle on/off)',
  ownerOnly:   true,

  async handler(sock, m, { reply }) {
    const { theme } = settings;
    global.antiPM = !global.antiPM;
    store.set('config', 'antipm', global.antiPM);
    return reply([
      theme.header, '',
      ` ⬡  🔒  ${theme.bold('ANTI-PM MODE')}`, '',
      `  Status: ${global.antiPM ? '✅ *AKTIF*' : '❌ *NONAKTIF*'}`,
      '',
      global.antiPM
        ? `  Bot akan membalas & mengabaikan pesan dari non-owner.`
        : `  Bot sekarang menerima pesan private dari semua user.`,
      '', theme.footer,
    ].join('\n'));
  },
};
