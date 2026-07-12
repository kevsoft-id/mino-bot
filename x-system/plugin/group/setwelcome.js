'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../set/settings');
const store    = require('../../../lib/store');

// ── Export getter for utils.js to use ─────────────────────────
function getWelcomeMsg(jid)  { return store.get('welcomeMsg', jid, null); }
function getGoodbyeMsg(jid)  { return store.get('goodbyeMsg', jid, null); }
module.exports.getWelcomeMsg = getWelcomeMsg;
module.exports.getGoodbyeMsg = getGoodbyeMsg;

// ── Variabel yang tersedia di pesan custom ────────────────────
//   {name}    = nama user
//   {number}  = nomor user
//   {group}   = nama grup
//   {count}   = jumlah member

module.exports.commands    = ['setwelcome', 'swelcome'];
module.exports.category    = 'Group';
module.exports.description = 'Set pesan sambutan custom untuk grup 👋';
module.exports.usage       = '.setwelcome <pesan>  |  .setwelcome off  |  .setwelcome reset';
module.exports.groupOnly   = true;
module.exports.adminOnly   = true;

module.exports.handler = async (sock, m, { text, args, jid, reply }) => {
  const { theme } = settings;

  if (!text || args[0] === 'off' || args[0] === 'reset') {
    store.del('welcomeMsg', jid);
    return reply([
      theme.header, '',
      ` ✅ Welcome message telah *dinonaktifkan*.`,
      ` Bot akan kembali ke template default.`,
      '', theme.footer,
    ].join('\n'));
  }

  if (args[0] === 'cek' || args[0] === 'check') {
    const msg = getWelcomeMsg(jid);
    if (!msg) return reply('📭 Belum ada custom welcome message.');
    return reply([
      theme.header, '',
      ` ⬡  👋  ${theme.bold('WELCOME MESSAGE SAAT INI')}`, '',
      msg,
      '', theme.footer,
    ].join('\n'));
  }

  store.set('welcomeMsg', jid, text);
  return reply([
    theme.header, '',
    ` ✅  ${theme.bold('WELCOME MESSAGE DISET!')}`, '',
    `  ${theme.bullet} Pesan tersimpan.`,
    `  ${theme.bullet} Variabel: {name} {number} {group} {count}`,
    '',
    `  Preview:`,
    text.replace('{name}', 'User').replace('{number}', '628xxx').replace('{group}', 'Nama Grup').replace('{count}', '50'),
    '', theme.footer,
  ].join('\n'));
};
