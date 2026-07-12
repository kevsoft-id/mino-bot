'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../set/settings');
const { send } = require('../../../lib/utils');

module.exports = {
  commands:    ['broadcast', 'bc', 'kirimpesan'],
  category:    'Owner',
  description: 'Kirim pesan ke semua grup dan/atau private chat',
  usage:       '.bc {pesan}  |  .bc -g {pesan}  |  .bc -p {pesan}',
  ownerOnly:   true,

  async handler(sock, m, { args, text, reply, react }) {
    const { theme } = settings;

    if (!text) {
      return reply([
        theme.header, '',
        ` ⬡  📡  ${theme.bold('BROADCAST')}`, '',
        `    ${theme.bullet} .bc {pesan}       → semua (grup + private)`,
        `    ${theme.bullet} .bc -g {pesan}    → grup saja`,
        `    ${theme.bullet} .bc -p {pesan}    → private saja`,
        '',
        `    ⚠️  Broadcast terlalu sering bisa kena ban WA!`,
        '',
        theme.footer,
      ].join('\n'));
    }

    let mode = 'all';
    let msg  = text;

    if (args[0] === '-g') { mode = 'group'; msg = args.slice(1).join(' '); }
    if (args[0] === '-p') { mode = 'private'; msg = args.slice(1).join(' '); }

    if (!msg.trim()) return reply('❓ Pesan tidak boleh kosong');

    await react('📡');
    await reply('📡 Memulai broadcast...');

    const chats = await sock.groupFetchAllParticipating().catch(() => ({}));
    const groupJids = Object.keys(chats);

    // Get all chats including private (from store if available)
    let targets = [];
    if (mode === 'all' || mode === 'group') targets.push(...groupJids);

    let sent = 0, failed = 0;

    const broadcastMsg = [
      `📢 *BROADCAST*`,
      ``,
      msg,
      ``,
      `_— ${settings.botName}_`,
      ``,
      settings.footer,
    ].join('\n');

    for (const jid of targets) {
      try {
        await send(sock, jid, broadcastMsg);
        sent++;
        await new Promise(r => setTimeout(r, 500)); // delay to avoid spam
      } catch { failed++; }
    }

    await react('✅');
    await reply([
      `✅ *Broadcast selesai!*`,
      ``,
      `📤 Terkirim : ${sent}`,
      `❌ Gagal    : ${failed}`,
      `📌 Mode     : ${mode}`,
      ``,
      settings.footer,
    ].join('\n'));
  },
};
