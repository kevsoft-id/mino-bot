'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../settings');

const RIDDLES = [
  { q: 'Apa yang bisa terbang tanpa sayap?', a: 'waktu' },
  { q: 'Makin diisi makin ringan, apa itu?', a: 'balon' },
  { q: 'Punya tangan tapi tidak bisa tepuk tangan, apa itu?', a: 'jam' },
  { q: 'Semakin banyak kamu ambil, semakin besar ia. Apa itu?', a: 'lubang' },
  { q: 'Apa yang bisa keliling dunia tanpa bergerak?', a: 'prangko' },
  { q: 'Apa yang jatuh ke atas?', a: 'hujan' },
  { q: 'Satu kata yang punya tiga huruf namun bisa mengosongkan ruangan?', a: 'api' },
  { q: 'Bisa berbicara di semua bahasa, tapi bukan manusia. Apa itu?', a: 'kamus' },
  { q: 'Punya kepala dan ekor tapi tidak punya badan. Apa itu?', a: 'koin' },
  { q: 'Apa yang selalu di depanmu tapi tidak bisa dilihat?', a: 'masa depan' },
  { q: 'Makin tua makin muda, makin muda makin pendek. Apa itu?', a: 'lilin' },
  { q: 'Orang buta menyentuhnya, orang lumpuh memakainya, orang tuli mendengarnya. Apa itu?', a: 'celana' },
  { q: 'Tinggi waktu muda, pendek waktu tua. Apa itu?', a: 'pensil' },
  { q: 'Apa yang tidak pernah bertanya tapi selalu dijawab?', a: 'bel pintu' },
  { q: 'Ada kulit di luar, ada tulang di dalam, tapi bukan manusia. Apa itu?', a: 'mangga' },
];

// Active riddles per chat: jid → { riddle, timeout }
const active = {};

module.exports = {
  commands:    ['riddle', 'tebakan', 'teka', 'jawabriddle', 'jawab'],
  category:    'Fun',
  description: 'Tebak-tebakan seru! Jawab dalam 30 detik',
  usage:       '.riddle  |  .jawab {jawaban}',

  async handler(sock, m, { command, text, jid, reply, react }) {
    const { theme } = settings;

    // ── .jawab ──────────────────────────────────────────────
    if (command === 'jawab' || command === 'jawabriddle') {
      if (!active[jid]) return reply('❓ Tidak ada tebakan aktif. Ketik .riddle untuk mulai!');
      if (!text) return reply('❓ Masukkan jawabanmu!\nContoh: .jawab waktu');

      const { riddle } = active[jid];
      const userAns = text.toLowerCase().trim();
      const correct = riddle.a.toLowerCase();

      clearTimeout(active[jid].timeout);
      delete active[jid];

      if (userAns.includes(correct) || correct.includes(userAns)) {
        await react('🎉');
        return reply([
          `🎉 *BENAR! Kamu berhasil!*`,
          ``,
          `✅ Jawaban: *${riddle.a}*`,
          ``,
          `Ketik .riddle untuk tebakan berikutnya!`,
          ``,
          settings.footer,
        ].join('\n'));
      } else {
        await react('❌');
        return reply([
          `❌ *Salah nih~*`,
          ``,
          `💡 Jawaban yang benar: *${riddle.a}*`,
          ``,
          `Coba lagi dengan .riddle ya!`,
          ``,
          settings.footer,
        ].join('\n'));
      }
    }

    // ── .riddle ─────────────────────────────────────────────
    if (active[jid]) {
      const prev = active[jid].riddle;
      return reply([
        `⚠️ Masih ada tebakan aktif!`,
        ``,
        `❓ *${prev.q}*`,
        ``,
        `Jawab dengan: .jawab {jawaban}`,
        `Atau tunggu hingga timeout.`,
      ].join('\n'));
    }

    const riddle = RIDDLES[Math.floor(Math.random() * RIDDLES.length)];

    // Set timeout 30s
    const timeout = setTimeout(async () => {
      if (active[jid]) {
        delete active[jid];
        await sock.sendMessage(jid, {
          text: `⏰ *Waktu habis!*\n\n💡 Jawaban: *${riddle.a}*\n\nKetik .riddle untuk tebakan baru!\n\n${settings.footer}`,
        });
      }
    }, 30000);

    active[jid] = { riddle, timeout };

    await react('🧩');
    await reply([
      theme.header, '',
      ` ⬡  🧩  ${theme.bold('TEKA-TEKI')}`, '',
      `    ❓ ${riddle.q}`,
      '',
      `    ⏱️ Waktu: 30 detik`,
      `    💬 Jawab: .jawab {jawabanmu}`,
      '',
      theme.footer,
    ].join('\n'));
  },
};
