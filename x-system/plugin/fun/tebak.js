'use strict';
const settings = require('../../../set/settings');

// Simple in-memory game state
const games = new Map(); // jid -> { number, tries, timeout }

module.exports = {
  commands: ['tebak', 'tebakangka', 'guess'],
  category: 'Fun',
  description: 'Tebak angka 1-100, punya 5 kesempatan nya~',
  usage: '.tebak [angka]',

  async handler(sock, m, { args, jid, pushName, reply, react }) {
    const gameKey = jid + m.key.participant || jid;

    // Jika tidak ada argumen, mulai game baru
    if (!args[0] || isNaN(args[0])) {
      if (games.has(gameKey)) {
        const g = games.get(gameKey);
        return reply(`🎮 Game sedang berjalan nya~!\nKesempatan tersisa: *${g.tries}*\nKetik angka 1-100 untuk menebak!`);
      }
      const number = Math.floor(Math.random() * 100) + 1;
      games.set(gameKey, { number, tries: 5, timeout: setTimeout(() => {
        games.delete(gameKey);
      }, 5 * 60 * 1000) });

      return reply([
        `🎮 *TEBAK ANGKA!* nya~`,
        ``,
        `Mino udah pilih angka 1-100~`,
        `Kamu punya *5 kesempatan* untuk menebak!`,
        ``,
        `Ketik: \`.tebak <angka>\` untuk menebak OwO`,
        `Ketik: \`.tebak batal\` untuk menyerah`,
        ``,
        settings.footer,
      ].join('\n'));
    }

    // Batal
    if (args[0] === 'batal') {
      if (!games.has(gameKey)) return reply('❌ Ga ada game yang berjalan nya~');
      const g = games.get(gameKey);
      clearTimeout(g.timeout);
      games.delete(gameKey);
      return reply(`😿 Game dibatalkan~ Angkanya adalah *${g.number}*`);
    }

    // Tebak angka
    if (!games.has(gameKey)) {
      return reply('❌ Belum ada game aktif nya~\nKetik `.tebak` untuk mulai!');
    }

    const g   = games.get(gameKey);
    const num = parseInt(args[0]);

    if (num < 1 || num > 100) return reply('❌ Angka harus antara 1-100 nya~');

    g.tries--;

    if (num === g.number) {
      clearTimeout(g.timeout);
      games.delete(gameKey);
      await react('🎉');
      return reply([
        `🎉 *BENAR!* ${pushName} menang!`,
        ``,
        `✅ Angkanya memang *${g.number}*~`,
        `📊 Sisa kesempatan: ${g.tries}`,
        ``,
        `🐾 Hebat banget nya~ UwU!`,
        ``,
        settings.footer,
      ].join('\n'));
    }

    if (g.tries <= 0) {
      clearTimeout(g.timeout);
      games.delete(gameKey);
      await react('😢');
      return reply([
        `😿 *GAME OVER!* Kesempatan habis~`,
        ``,
        `❌ Angkanya adalah *${g.number}*`,
        ``,
        `Jangan menyerah ya~ Coba lagi! OwO`,
        ``,
        settings.footer,
      ].join('\n'));
    }

    const hint = num < g.number
      ? `📈 Angkamu terlalu *kecil*! Coba yang lebih besar~`
      : `📉 Angkamu terlalu *besar*! Coba yang lebih kecil~`;

    await reply([
      `🎮 Salah! ${hint}`,
      ``,
      `📊 Kesempatan tersisa: *${g.tries}*`,
      ``,
      settings.footer,
    ].join('\n'));
  },
};
