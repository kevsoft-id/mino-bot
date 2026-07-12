'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../set/settings');

module.exports = [
  // ── .listgroup ──────────────────────────────────────────
  {
    commands:    ['listgroup', 'listgrup', 'gruplist', 'daftargrup'],
    category:    'Owner',
    description: 'Tampilkan semua grup yang diikuti bot',
    usage:       '.listgroup',
    ownerOnly:   true,

    async handler(sock, m, { reply, react }) {
      const { theme } = settings;
      await react('🔍');

      try {
        const chats = await sock.groupFetchAllParticipating();
        const groups = Object.values(chats);

        if (!groups.length) return reply('❌ Bot tidak bergabung di grup manapun');

        const list = groups.map((g, i) =>
          `${i + 1}. *${g.subject}* (${g.participants.length} member)\n   \`${g.id}\``
        ).join('\n\n');

        await react('✅');
        await reply([
          theme.header, '',
          ` ⬡  👥  ${theme.bold(`DAFTAR GRUP (${groups.length})`)}`, '',
          list,
          '',
          theme.footer,
        ].join('\n'));
      } catch (err) {
        await react('❌');
        await reply(`❌ Gagal ambil daftar grup: ${err.message}`);
      }
    },
  },

  // ── .joingroup {link} ───────────────────────────────────
  {
    commands:    ['joingroup', '  joingrup', 'join'],
    category:    'Owner',
    description: 'Bergabung ke grup via link undangan',
    usage:       '.joingroup {link_grup}',
    ownerOnly:   true,

    async handler(sock, m, { text, reply, react }) {
      if (!text) return reply('❓ Masukkan link grup WhatsApp\nContoh: .joingroup https://chat.whatsapp.com/xxxx');

      await react('⏳');
      try {
        const code = text.replace(/https?:\/\/chat\.whatsapp\.com\//i, '').trim();
        await sock.groupAcceptInvite(code);
        await react('✅');
        await reply([
          `✅ *Berhasil bergabung ke grup!*`,
          `🔗 Link: ${text}`,
          ``,
          settings.footer,
        ].join('\n'));
      } catch (err) {
        await react('❌');
        await reply(`❌ Gagal join grup: ${err.message}`);
      }
    },
  },

  // ── .leavegroup ─────────────────────────────────────────
  {
    commands:    ['leavegroup', 'leavegrup', 'keluargrup', 'leave'],
    category:    'Owner',
    description: 'Keluar dari grup saat ini',
    usage:       '.leavegroup',
    ownerOnly:   true,
    groupOnly:   true,

    async handler(sock, m, { jid, reply, react }) {
      await react('👋');
      await reply([
        `👋 *Bot akan keluar dari grup ini...*`,
        ``,
        `Sampai jumpa!`,
        ``,
        settings.footer,
      ].join('\n'));

      await new Promise(r => setTimeout(r, 2000));
      await sock.groupLeave(jid).catch(() => {});
    },
  },
];
