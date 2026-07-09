'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../settings');

// Active reminders: id → timeout
const reminders = new Map();
let remId = 0;

module.exports = {
  commands:    ['reminder', 'alarm', 'ingatkan', 'remind', 'pengingat'],
  category:    'Tools',
  description: 'Set pengingat/reminder. Format: .reminder {menit}|{pesan}',
  usage:       '.reminder {menit}|{pesan}  |  .reminder list  |  .reminder cancel {id}',

  async handler(sock, m, { args, text, sender, jid, reply, react }) {
    const { theme } = settings;

    if (!text) {
      return reply([
        theme.header, '',
        ` ⬡  ⏰  ${theme.bold('REMINDER')}`, '',
        `    ${theme.bullet} .reminder {menit}|{pesan}`,
        `    ${theme.bullet} .reminder list`,
        `    ${theme.bullet} .reminder cancel {id}`,
        '',
        `    📝 Contoh:`,
        `    .reminder 30|Minum obat!`,
        `    .reminder 60|Meeting dimulai`,
        `    .reminder 1440|Bayar tagihan`,
        '',
        `    ℹ️ Maks 1440 menit (24 jam)`,
        '',
        theme.footer,
      ].join('\n'));
    }

    const sub = args[0]?.toLowerCase();

    // ── List reminders ─────────────────────────────────────
    if (sub === 'list') {
      const userRem = [...reminders.values()].filter(r => r.sender === sender);
      if (!userRem.length) return reply('⏰ Tidak ada reminder aktif\n\nBuat dengan: .reminder {menit}|{pesan}');
      const list = userRem.map(r =>
        `    ⏰ ID:${r.id} — ${r.msg.slice(0, 40)} (${Math.ceil((r.fireAt - Date.now()) / 60000)} menit lagi)`
      ).join('\n');
      return reply([`⏰ *Reminder Aktifmu:*\n`, list, `\nCancel: .reminder cancel {id}`].join('\n'));
    }

    // ── Cancel reminder ────────────────────────────────────
    if (sub === 'cancel') {
      const id = parseInt(args[1]);
      if (isNaN(id)) return reply('❓ Masukkan ID reminder\nContoh: .reminder cancel 3');
      const rem = reminders.get(id);
      if (!rem || rem.sender !== sender) return reply(`❌ Reminder ID ${id} tidak ditemukan`);
      clearTimeout(rem.timer);
      reminders.delete(id);
      await react('✅');
      return reply(`✅ Reminder #${id} dibatalkan`);
    }

    // ── Set new reminder ───────────────────────────────────
    const pipeIdx = text.indexOf('|');
    if (pipeIdx === -1) return reply('❓ Format: .reminder {menit}|{pesan}\nContoh: .reminder 30|Minum obat!');

    const mins = parseInt(text.slice(0, pipeIdx).trim());
    const msg  = text.slice(pipeIdx + 1).trim();

    if (isNaN(mins) || mins < 1) return reply('❌ Durasi minimal 1 menit');
    if (mins > 1440) return reply('❌ Durasi maksimal 1440 menit (24 jam)');
    if (!msg) return reply('❌ Pesan reminder tidak boleh kosong');

    const id      = ++remId;
    const fireAt  = Date.now() + mins * 60000;
    const timer   = setTimeout(async () => {
      reminders.delete(id);
      const remindMsg = [
        `⏰ *REMINDER #${id}*`,
        ``,
        msg,
        ``,
        `_Set ${mins} menit yang lalu_`,
        ``,
        settings.footer,
      ].join('\n');
      await sock.sendMessage(jid, { text: remindMsg, mentions: [sender] }).catch(() => {});
    }, mins * 60000);

    reminders.set(id, { id, sender, jid, msg, timer, fireAt });

    await react('⏰');
    await reply([
      `✅ *Reminder diset!*`,
      ``,
      `⏰ ID      : #${id}`,
      `⏱️ Waktu   : ${mins} menit lagi`,
      `📝 Pesan   : ${msg}`,
      `🕐 Akan berbunyi: ${new Date(fireAt).toLocaleTimeString('id-ID', { timeZone: settings.timezone })}`,
      ``,
      `Cancel: .reminder cancel ${id}`,
      ``,
      settings.footer,
    ].join('\n'));
  },
};
