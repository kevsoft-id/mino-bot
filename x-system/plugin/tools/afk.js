'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../set/settings');
const { formatDuration } = require('../../../lib/utils');

// AFK state per user
const afkUsers = new Map(); // sender → { reason, time, mentions }

// Hook: check AFK on every message
global._afkCheck = async function(sock, m) {
  try {
    if (!m?.message) return;
    const jid    = m.key.remoteJid;
    const sender = m.key.participant || m.participant || m.key.remoteJid;
    if (!sender) return;

    const text = m.message?.conversation || m.message?.extendedTextMessage?.text || '';

    // If the AFK user sends a message, remove AFK
    if (afkUsers.has(sender) && !text.startsWith(settings.prefix + 'afk')) {
      const afk = afkUsers.get(sender);
      afkUsers.delete(sender);
      const dur = formatDuration(Date.now() - afk.time);
      await sock.sendMessage(jid, {
        text: [
          `👋 *@${sender.split('@')[0]} sudah kembali!*`,
          ``,
          `⏱️ Absen selama: ${dur}`,
          afk.reason ? `📝 Alasan tadi: ${afk.reason}` : '',
          ``,
          settings.footer,
        ].filter(Boolean).join('\n'),
        mentions: [sender],
      }).catch(() => {});
    }

    // Check if message mentions an AFK user
    const mentions = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    for (const mentioned of mentions) {
      if (afkUsers.has(mentioned)) {
        const afk = afkUsers.get(mentioned);
        const dur = formatDuration(Date.now() - afk.time);
        await sock.sendMessage(jid, {
          text: [
            `⚠️ *@${mentioned.split('@')[0]} sedang AFK*`,
            `⏱️ Sudah ${dur}`,
            afk.reason ? `📝 Alasan: ${afk.reason}` : '',
            ``,
            settings.footer,
          ].filter(Boolean).join('\n'),
          mentions: [mentioned],
        }).catch(() => {});
      }
    }
  } catch {}
};

module.exports = {
  commands:    ['afk', 'away', 'back', 'kembali'],
  category:    'Tools',
  description: 'Set status AFK — bot otomatis balas jika ada yang mention',
  usage:       '.afk {alasan}  |  .back',

  async handler(sock, m, { command, text, sender, jid, pushName, reply, react }) {
    const { theme } = settings;

    if (command === 'back' || command === 'kembali') {
      if (!afkUsers.has(sender)) {
        return reply('❓ Kamu tidak sedang AFK!');
      }
      const afk = afkUsers.get(sender);
      afkUsers.delete(sender);
      const dur = formatDuration(Date.now() - afk.time);
      await react('👋');
      return reply([
        `👋 *Welcome back, ${pushName}!*`,
        ``,
        `⏱️ Absen selama: ${dur}`,
        afk.reason ? `📝 Alasan: ${afk.reason}` : '',
        ``,
        settings.footer,
      ].filter(Boolean).join('\n'));
    }

    // .afk
    if (afkUsers.has(sender)) {
      return reply(`⚠️ Kamu sudah dalam status AFK!\nKetik .back untuk kembali.`);
    }

    const reason = text?.trim() || '';
    afkUsers.set(sender, { reason, time: Date.now() });

    await react('💤');
    await reply([
      theme.header, '',
      ` ⬡  💤  ${theme.bold('MODE AFK AKTIF')}`, '',
      `    👤 ${pushName} sedang AFK`,
      reason ? `    📝 Alasan: ${reason}` : `    📝 Alasan: -`,
      '',
      `    Bot akan otomatis notify jika ada yang mention kamu`,
      `    Ketik .back untuk kembali`,
      '',
      theme.footer,
    ].join('\n'));
  },
};
