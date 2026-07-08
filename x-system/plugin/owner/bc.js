'use strict';

// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../settings');

module.exports = {
  commands:  ['bc', 'broadcast', 'kirimbc'],
  category:  'Owner',
  description: 'Broadcast pesan ke semua chat yang tersimpan',
  usage:     '.bc <pesan>',
  ownerOnly: true,

  async handler(sock, m, { text, reply, react }) {
    const { theme } = settings;
    if (!text) {
      return reply([
        theme.header,
        '',
        ` ⬡  📢  ${theme.bold('BROADCAST')}`,
        '',
        `    ${theme.bullet} ${theme.bold('Usage')}  : .bc <pesan>`,
        `    ${theme.bullet} ${theme.bold('Contoh')} : .bc Ada update baru!`,
        '',
        theme.footer,
      ].join('\n'));
    }

    await react('📢');

    const bcMsg = [
      theme.header,
      '',
      ` ⬡  📢  ${theme.bold('BROADCAST')}`,
      '',
      text,
      '',
      theme.footer,
    ].join('\n');

    try {
      const chats = await sock.getChats?.() || [];
      let sent = 0;
      for (const chat of chats) {
        try {
          await sock.sendMessage(chat.id, { text: bcMsg });
          sent++;
          await new Promise(r => setTimeout(r, 1000));
        } catch {}
      }
      await react('✅');
      await reply([
        theme.header,
        '',
        ` ⬡  ✅  ${theme.bold('BROADCAST SENT')}`,
        '',
        `    ${theme.bullet} Terkirim ke ${sent} chat`,
        '',
        theme.footer,
      ].join('\n'));
    } catch {
      await react('⚠️');
      await reply(`⚠️ Broadcast terbatas (store chat kosong). Pesan:\n\n${bcMsg}`);
    }
  },
};
