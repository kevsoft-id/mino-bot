'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../set/settings');

const timers = new Map(); // sender → { type, endAt, timer, jid }
let timerId = 0;

function startTimer(sock, sender, jid, minutes, label, emoji) {
  // Cancel existing
  if (timers.has(sender)) {
    clearTimeout(timers.get(sender).timer);
    timers.delete(sender);
  }

  const id    = ++timerId;
  const endAt = Date.now() + minutes * 60000;

  const timer = setTimeout(async () => {
    timers.delete(sender);
    await sock.sendMessage(jid, {
      text: [
        `${emoji} *TIMER SELESAI!*`,
        ``,
        `⏱️ ${label} (${minutes} menit) sudah selesai!`,
        ``,
        sender.endsWith('@g.us') ? '' : `@${sender.split('@')[0]}`,
        ``,
        settings.footer,
      ].filter(Boolean).join('\n'),
      mentions: [sender],
    }).catch(() => {});
  }, minutes * 60000);

  timers.set(sender, { id, type: label, endAt, timer, jid });
  return id;
}

module.exports = {
  commands:    ['pomodoro', 'timer', 'fokus', 'countdown'],
  category:    'Tools',
  description: 'Timer Pomodoro & countdown. Fokus 25 menit + istirahat 5 menit',
  usage:       '.pomodoro  |  .timer {menit} {label}  |  .pomodoro stop',

  async handler(sock, m, { command, args, text, sender, jid, reply, react }) {
    const { theme } = settings;
    const sub = args[0]?.toLowerCase();

    // ── .pomodoro stop ─────────────────────────────────────
    if (sub === 'stop' || sub === 'cancel') {
      if (!timers.has(sender)) return reply('❓ Tidak ada timer aktif');
      clearTimeout(timers.get(sender).timer);
      timers.delete(sender);
      await react('⏹️');
      return reply('⏹️ Timer dihentikan!');
    }

    // ── .pomodoro status ───────────────────────────────────
    if (sub === 'status' || sub === 'cek') {
      if (!timers.has(sender)) return reply('❓ Tidak ada timer aktif\nMulai dengan .pomodoro');
      const t = timers.get(sender);
      const remaining = Math.ceil((t.endAt - Date.now()) / 60000);
      return reply(`⏱️ *Timer aktif*: ${t.type}\n⌛ Sisa: ${remaining} menit`);
    }

    // ── .timer {menit} {label} ─────────────────────────────
    if (command === 'timer' || command === 'countdown') {
      const mins = parseInt(args[0]);
      if (isNaN(mins) || mins < 1 || mins > 120) {
        return reply([
          `⏱️ *TIMER*`,
          ``,
          `Format: .timer {menit} {label opsional}`,
          `Contoh: .timer 10 Baca buku`,
          `Contoh: .timer 45`,
          ``,
          `Maks: 120 menit`,
        ].join('\n'));
      }
      const label = args.slice(1).join(' ') || 'Timer';
      startTimer(sock, sender, jid, mins, label, '⏰');
      await react('⏱️');
      return reply([
        `✅ *Timer dimulai!*`,
        ``,
        `⏱️ Durasi : ${mins} menit`,
        `📝 Label  : ${label}`,
        `🔔 Selesai: ${new Date(Date.now() + mins * 60000).toLocaleTimeString('id-ID', { timeZone: settings.timezone })}`,
        ``,
        `Stop: .timer stop`,
        ``,
        settings.footer,
      ].join('\n'));
    }

    // ── .pomodoro ──────────────────────────────────────────
    if (!sub || sub === 'mulai' || sub === 'start') {
      if (timers.has(sender)) {
        const t = timers.get(sender);
        const rem = Math.ceil((t.endAt - Date.now()) / 60000);
        return reply(`⚠️ Timer sudah berjalan: *${t.type}* (sisa ${rem} menit)\nStop dulu: .pomodoro stop`);
      }

      startTimer(sock, sender, jid, 25, '🍅 Pomodoro (Fokus)', '🍅');
      await react('🍅');
      return reply([
        theme.header, '',
        ` ⬡  🍅  ${theme.bold('POMODORO DIMULAI!')}`, '',
        `    ⏱️ Fokus selama *25 menit*`,
        `    📵 Matikan notifikasi gangguan`,
        `    💻 Kerjakan satu tugas dengan fokus penuh`,
        '',
        `    🔔 Bot akan mengingatkan setelah 25 menit`,
        '',
        `    📋 ${theme.bold('Tips Pomodoro:')}`,
        `    1️⃣  Fokus 25 menit`,
        `    2️⃣  Istirahat 5 menit`,
        `    3️⃣  Ulangi 4x`,
        `    4️⃣  Istirahat panjang 15-30 menit`,
        '',
        `    Stop: .pomodoro stop`,
        '',
        theme.footer,
      ].join('\n'));
    }

    // Istirahat mode
    if (sub === 'break' || sub === 'istirahat') {
      const mins = parseInt(args[1]) || 5;
      startTimer(sock, sender, jid, mins, '☕ Istirahat', '☕');
      await react('☕');
      return reply(`☕ *Istirahat ${mins} menit dimulai!*\nRelaksasi sebentar ya~\n\n${settings.footer}`);
    }

    return reply([
      `⏱️ *POMODORO & TIMER*`,
      ``,
      `• .pomodoro       → mulai sesi fokus 25m`,
      `• .pomodoro break → istirahat 5m`,
      `• .pomodoro stop  → hentikan timer`,
      `• .timer {menit}  → custom timer`,
      ``,
      settings.footer,
    ].join('\n'));
  },
};
