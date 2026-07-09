'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../settings');
const store    = require('../../../lib/store');

// ── Runtime state (persisted via store) ──────────────────────────
function getStatus(jid) { return !!store.get('antidemote', jid); }
function setStatus(jid, val) { store.set('antidemote', jid, val); }

// ── Called from connection.js on group-participants.update ────────
global._antidemoteCheck = async function(sock, update) {
  try {
    const { id, participants, action } = update;
    if (action !== 'demote') return;
    if (!getStatus(id)) return;

    for (const jid of participants) {
      // Re-promote the demoted member
      await sock.groupParticipantsUpdate(id, [jid], 'promote').catch(() => {});
      await sock.sendMessage(id, {
        text: [
          `🛡️ *ANTI-DEMOTE aktif!*`,
          ``,
          `@${jid.split('@')[0]} dicoba demote,`,
          `tapi langsung dipromote kembali oleh bot~ 💪`,
          ``,
          settings.footer,
        ].join('\n'),
        mentions: [jid],
      }).catch(() => {});
    }
  } catch {}
};

module.exports = {
  commands:    ['antidemote', 'antiturun', 'ad'],
  category:    'Group',
  description: 'Aktifkan/matikan anti-demote — admin yang di-demote akan langsung dipromote balik',
  usage:       '.antidemote on/off  |  .antidemote status',
  groupOnly:   true,
  adminOnly:   true,
  botAdmin:    true,

  async handler(sock, m, { args, jid, reply, react }) {
    const { theme } = settings;
    const sub = args[0]?.toLowerCase();

    if (!sub || sub === 'status') {
      const status = getStatus(jid);
      return reply([
        `🛡️ *Anti-Demote*`,
        ``,
        `Status: ${status ? '🟢 ON' : '🔴 OFF'}`,
        ``,
        `Gunakan: \`.antidemote on\` atau \`.antidemote off\``,
        ``,
        settings.footer,
      ].join('\n'));
    }

    if (!['on', 'off'].includes(sub)) return reply('❓ Gunakan: `.antidemote on` atau `.antidemote off`');

    const val = sub === 'on';
    setStatus(jid, val);

    await react('✅');
    await reply([
      theme.header, '',
      ` 🛡️  ${theme.bold('ANTI-DEMOTE ' + sub.toUpperCase())}`, '',
      val
        ? `    ✅ Admin yang di-demote akan langsung dipromote balik`
        : `    ❌ Anti-demote dimatikan`,
      '',
      theme.footer,
    ].join('\n'));
  },

  // Expose getter for connection.js
  getStatus,
};
