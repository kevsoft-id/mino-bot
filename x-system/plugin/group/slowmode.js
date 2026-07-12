'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../set/settings');
const store    = require('../../../lib/store');

// Cooldown tracker: { jid: { sender: lastTimestamp } }
const cooldowns = {};

global._slowmodeCheck = async function(sock, m) {
  try {
    if (!m?.message) return;
    const jid = m.key.remoteJid;
    if (!jid.endsWith('@g.us')) return;

    const delay = store.get('slowmode', jid);
    if (!delay || delay <= 0) return;

    const sender = m.key.participant || m.participant;
    if (!sender) return;

    // Check if sender is admin (admins bypass slowmode)
    const meta   = await sock.groupMetadata(jid).catch(() => null);
    if (!meta) return;
    const admins = meta.participants.filter(p => p.admin).map(p => p.id);
    if (admins.includes(sender)) return;

    const now  = Date.now();
    if (!cooldowns[jid]) cooldowns[jid] = {};

    const last = cooldowns[jid][sender] || 0;
    const diff = now - last;

    if (diff < delay * 1000) {
      const remaining = Math.ceil((delay * 1000 - diff) / 1000);
      // Delete the message
      await sock.sendMessage(jid, {
        delete: { remoteJid: jid, id: m.key.id, participant: sender, fromMe: false },
      }).catch(() => {});
      await sock.sendMessage(jid, {
        text: `⏱️ *Slow Mode aktif!* @${sender.split('@')[0]}\nTunggu *${remaining}s* lagi sebelum kirim pesan.\n\n${settings.footer}`,
        mentions: [sender],
      }).catch(() => {});
    } else {
      cooldowns[jid][sender] = now;
    }
  } catch {}
};

module.exports = {
  commands:    ['slowmode', 'slow', 'cooldown'],
  category:    'Group',
  description: 'Batasi member kirim pesan per N detik',
  usage:       '.slowmode {detik}  |  .slowmode off',
  groupOnly:   true,
  adminOnly:   true,
  botAdmin:    true,

  async handler(sock, m, { args, jid, reply, react }) {
    const { theme } = settings;
    const sub = args[0]?.toLowerCase();

    if (!sub) {
      const current = store.get('slowmode', jid) || 0;
      return reply([
        `⏱️ *Slow Mode*`,
        ``,
        `Status: ${current > 0 ? `🟢 ON (${current}s)` : '🔴 OFF'}`,
        ``,
        `Gunakan:`,
        `• .slowmode {detik} — aktifkan (mis: .slowmode 30)`,
        `• .slowmode off — matikan`,
        ``,
        settings.footer,
      ].join('\n'));
    }

    if (sub === 'off' || sub === '0') {
      store.set('slowmode', jid, 0);
      await react('✅');
      return reply(`✅ Slow mode dimatikan\n\n${settings.footer}`);
    }

    const secs = parseInt(sub);
    if (isNaN(secs) || secs < 1 || secs > 3600) {
      return reply('❓ Masukkan durasi dalam detik (1–3600)\nContoh: .slowmode 30');
    }

    store.set('slowmode', jid, secs);
    // Reset cooldowns for this group
    delete cooldowns[jid];

    await react('✅');
    await reply([
      theme.header, '',
      ` ⏱️  ${theme.bold('SLOW MODE ON')}`, '',
      `    ✅ Member hanya bisa kirim pesan setiap *${secs} detik*`,
      `    📌 Admin bebas dari slow mode`,
      '',
      theme.footer,
    ].join('\n'));
  },
};
