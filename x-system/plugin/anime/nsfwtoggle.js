'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../settings');
const store    = require('../../../lib/store');

function isNsfwEnabled(jid) { return store.get('nsfw', jid, false); }
module.exports.isNsfwEnabled = isNsfwEnabled;

module.exports = {
  commands:    ['nsfw', 'nsfwtoggle'],
  category:    'Anime',
  description: 'Toggle NSFW mode di grup (Owner / Admin only) 🔞',
  usage:       '.nsfw  (toggle on/off)',
  groupOnly:   true,
  adminOnly:   true,

  async handler(sock, m, { jid, isOwner, reply }) {
    const { theme } = settings;
    const status = store.toggle('nsfw', jid);
    return reply([
      theme.header, '',
      ` ⬡  🔞  ${theme.bold('NSFW MODE')}`, '',
      `  Status: ${status ? '✅ *AKTIF*' : '❌ *NONAKTIF*'}`,
      '',
      status
        ? `  ⚠️ Konten NSFW diizinkan di grup ini.`
        : `  Konten NSFW diblokir untuk grup ini.`,
      '', theme.footer,
    ].join('\n'));
  },
};
