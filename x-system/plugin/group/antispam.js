'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../set/settings');
const store    = require('../../../lib/store');

// Runtime flood tracker: Map<jid+sender, { count, timer }>
if (!global.spamTracker) global.spamTracker = new Map();

function getStatus(jid) { return store.get('antispam', jid, false); }
module.exports.getStatus = getStatus;

// Anti-spam check (call from handler.js pre-hook if desired)
function checkSpam(jid, sender) {
  if (!getStatus(jid)) return false;
  const key  = `${jid}_${sender}`;
  const now  = Date.now();
  const info = global.spamTracker.get(key) || { count: 0, first: now };
  if (now - info.first > 5000) { global.spamTracker.set(key, { count: 1, first: now }); return false; }
  info.count++;
  global.spamTracker.set(key, info);
  return info.count > 5; // 5 messages in 5 seconds = spam
}
module.exports.checkSpam = checkSpam;

module.exports = {
  commands:    ['antispam'],
  category:    'Group',
  description: 'Toggle anti-spam di grup (batas 5 pesan / 5 detik) 🚫',
  usage:       '.antispam  (toggle on/off)',
  groupOnly:   true,
  adminOnly:   true,

  async handler(sock, m, { jid, reply }) {
    const { theme } = settings;
    const status = store.toggle('antispam', jid);
    return reply([
      theme.header, '',
      ` ⬡  🚫  ${theme.bold('ANTI SPAM')}`, '',
      `  Status: ${status ? '✅ *AKTIF*' : '❌ *NONAKTIF*'}`,
      '',
      status
        ? `  Member yang kirim >5 pesan dalam 5 detik akan dikick.`
        : `  Anti-spam dinonaktifkan untuk grup ini.`,
      '', theme.footer,
    ].join('\n'));
  },
};
