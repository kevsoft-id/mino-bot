'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../settings');

const WORDS = [
  { w: 'javascript', h: 'Bahasa pemrograman web' },
  { w: 'indonesia', h: 'Nama negara kita' },
  { w: 'komputer', h: 'Alat elektronik pengolah data' },
  { w: 'internet', h: 'Jaringan global' },
  { w: 'programer', h: 'Orang yang membuat kode' },
  { w: 'database', h: 'Penyimpanan data terstruktur' },
  { w: 'algoritma', h: 'Langkah-langkah penyelesaian masalah' },
  { w: 'aplikasi', h: 'Program di smartphone' },
  { w: 'keyboard', h: 'Alat ketik komputer' },
  { w: 'monitor', h: 'Layar komputer' },
  { w: 'framework', h: 'Kerangka kerja pengembangan software' },
  { w: 'variabel', h: 'Tempat menyimpan nilai dalam program' },
  { w: 'function', h: 'Blok kode yang bisa dipanggil' },
  { w: 'terminal', h: 'Antarmuka berbasis teks' },
  { w: 'jaringan', h: 'Kumpulan perangkat yang terhubung' },
];

const HANGMAN_STAGES = [
  '  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========',
  '  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========',
  '  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========',
  '  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========',
  '  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========',
  '  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========',
  '  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n=========',
];

// Active games per chat
const games = {};

module.exports = {
  commands:    ['hangman', 'gantung', 'tebakhuruf', 'guess'],
  category:    'Fun',
  description: 'Game Hangman! Tebak kata satu huruf per satu',
  usage:       '.hangman  |  .guess {huruf}',

  async handler(sock, m, { command, args, jid, reply, react }) {
    const { theme } = settings;

    // ── .guess {letter} ────────────────────────────────────
    if (command === 'guess' || command === 'tebakhuruf') {
      const game = games[jid];
      if (!game) return reply('❓ Tidak ada game hangman aktif!\nKetik .hangman untuk mulai!');

      const letter = args[0]?.toLowerCase().trim();
      if (!letter || letter.length !== 1 || !/[a-z]/.test(letter)) {
        return reply('❓ Masukkan satu huruf!\nContoh: .guess a');
      }

      if (game.guessed.has(letter)) {
        return reply(`⚠️ Huruf "${letter.toUpperCase()}" sudah pernah ditebak!`);
      }

      game.guessed.add(letter);

      if (!game.word.includes(letter)) {
        game.wrong++;
      }

      const display = game.word.split('').map(c => game.guessed.has(c) ? c.toUpperCase() : '_').join(' ');
      const isWin   = game.word.split('').every(c => game.guessed.has(c));
      const isLost  = game.wrong >= 6;

      if (isWin) {
        delete games[jid];
        await react('🎉');
        return reply([
          `🎉 *MENANG! Luar biasa!*`,
          ``,
          `✅ Kata: *${game.word.toUpperCase()}*`,
          `💡 Hint: ${game.hint}`,
          `❌ Salah: ${game.wrong} kali`,
          ``,
          `Ketik .hangman untuk main lagi!`,
          ``,
          settings.footer,
        ].join('\n'));
      }

      if (isLost) {
        delete games[jid];
        await react('💀');
        return reply([
          `💀 *GAME OVER!*`,
          `\`\`\`\n${HANGMAN_STAGES[6]}\n\`\`\``,
          `❌ Kata yang benar: *${game.word.toUpperCase()}*`,
          ``,
          `Ketik .hangman untuk main lagi!`,
          ``,
          settings.footer,
        ].join('\n'));
      }

      const stage = HANGMAN_STAGES[game.wrong];
      const wrongLetters = [...game.guessed].filter(c => !game.word.includes(c)).join(', ').toUpperCase();

      await react(game.word.includes(letter) ? '✅' : '❌');
      await reply([
        `🎯 *HANGMAN*`,
        `\`\`\`\n${stage}\n\`\`\``,
        ``,
        `📝 Kata: ${display}`,
        `💡 Hint: ${game.hint}`,
        ``,
        `❌ Huruf salah (${game.wrong}/6): ${wrongLetters || '-'}`,
        `✅ Huruf benar: ${[...game.guessed].filter(c => game.word.includes(c)).join(', ').toUpperCase() || '-'}`,
        ``,
        `Tebak huruf: .guess {huruf}`,
        ``,
        settings.footer,
      ].join('\n'));
      return;
    }

    // ── .hangman ────────────────────────────────────────────
    if (games[jid]) {
      const game = games[jid];
      const display = game.word.split('').map(c => game.guessed.has(c) ? c.toUpperCase() : '_').join(' ');
      return reply([
        `⚠️ Game hangman sedang berjalan!`,
        ``,
        `📝 Kata: ${display}`,
        `💡 Hint: ${game.hint}`,
        `❌ Salah: ${game.wrong}/6`,
        ``,
        `Tebak huruf: .guess {huruf}`,
      ].join('\n'));
    }

    const pick    = WORDS[Math.floor(Math.random() * WORDS.length)];
    games[jid] = { word: pick.w, hint: pick.h, guessed: new Set(), wrong: 0 };

    const display = '_  '.repeat(pick.w.length).trim();

    await react('🎮');
    await reply([
      theme.header, '',
      ` ⬡  🎮  ${theme.bold('HANGMAN')}`, '',
      `\`\`\`\n${HANGMAN_STAGES[0]}\n\`\`\``,
      ``,
      `📝 Kata: ${pick.w.split('').map(() => '_').join(' ')}`,
      `🔢 Panjang: ${pick.w.length} huruf`,
      `💡 Hint: ${pick.h}`,
      '',
      `Tebak huruf: .guess {huruf}`,
      `Contoh: .guess a`,
      '',
      theme.footer,
    ].join('\n'));
  },
};
