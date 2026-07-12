'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../set/settings');
const store    = require('../../../lib/store');

function getStatus(jid) { return !!store.get('notifgroup', jid); }
function setStatus(jid, val) { store.set('notifgroup', jid, val); }

// ── Called from connection.js ─────────────────────────────────────
global._notifGroupCheck = async function(sock, update) {
  try {
    const { id, participants, action } = update;
    if (!getStatus(id)) return;
    if (action !== 'add' && action !== 'remove' && action !== 'promote' && action !== 'demote') return;

    const actionMap = {
      add:     '👋 Anggota baru bergabung',
      remove:  '🚪 Anggota keluar/dikeluarkan',
      promote: '⬆️ Anggota dipromote jadi admin',
      demote:  '⬇️ Admin diturunkan jadi anggota',
    };

    for (const jid of participants) {
      const num = jid.split('@')[0];
      await sock.sendMessage(id, {
        text: [
          `📢 *NOTIF GRUP*`,
          ``,
          `${actionMap[action]}`,
          `👤 @${num}`,
          `🕒 ${new Date().toLocaleString('id-ID', { timeZone: settings.timezone })}`,
          ``,
          settings.footer,
        ].join('\n'),
        mentions: [jid],
      }).catch(() => {});
    }
  } catch {}
};

module.exports = {
  commands:    ['notifgroup', 'groupnotif', 'ng'],
  category:    'Group',
  description: 'Aktifkan/matikan notifikasi setiap perubahan anggota grup',
  usage:       '.notifgroup on/off',
  groupOnly:   true,
  adminOnly:   true,

  async handler(sock, m, { args, jid, reply, react }) {
    const { theme } = settings;
    const sub = args[0]?.toLowerCase();

    if (!sub || sub === 'status') {
      const status = getStatus(jid);
      return reply([
        `📢 *Notif Grup*`,
        ``,
        `Status: ${status ? '🟢 ON' : '🔴 OFF'}`,
        ``,
        `Gunakan: \`.notifgroup on\` atau \`.notifgroup off\``,
        ``,
        settings.footer,
      ].join('\n'));
    }

    if (!['on', 'off'].includes(sub)) return reply('❓ Gunakan: `.notifgroup on` atau `.notifgroup off`');

    const val = sub === 'on';
    setStatus(jid, val);

    await react('✅');
    await reply([
      theme.header, '',
      ` 📢  ${theme.bold('NOTIF GRUP ' + sub.toUpperCase())}`, '',
      val
        ? `    ✅ Bot akan mengirim notifikasi setiap ada perubahan anggota`
        : `    ❌ Notifikasi grup dimatikan`,
      '',
      theme.footer,
    ].join('\n'));
  },

  getStatus,
};
