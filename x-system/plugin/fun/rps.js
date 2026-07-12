'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../set/settings');
const { replyList } = require('../../../lib/utils');

const CHOICES = {
  batu:    { emoji: '✊', beat: 'gunting', label: 'Batu' },
  kertas:  { emoji: '✋', beat: 'batu',    label: 'Kertas' },
  gunting: { emoji: '✌️', beat: 'kertas',  label: 'Gunting' },
};
const KEYS = Object.keys(CHOICES);

module.exports = {
  commands:    ['rps', 'bapuk', 'gunbatker'],
  category:    'Fun',
  description: 'Rock Paper Scissors interaktif melawan bot 🎮',
  usage:       '.rps  lalu pilih dari daftar',

  async handler(sock, m, { args, pushName, reply }) {
    const { theme, prefix } = settings;
    const pick = args[0]?.toLowerCase();

    // .rps → show list
    if (!pick || !CHOICES[pick]) {
      const sections = [{
        title: '🎮 PILIH AKSIMU',
        rows: KEYS.map(k => ({
          id:          `${prefix}rps ${k}`,
          title:       `${CHOICES[k].emoji}  ${CHOICES[k].label}`,
          description: `Mainkan ${CHOICES[k].label}`,
        })),
      }];
      return replyList(
        sock, m,
        theme.bold('ROCK PAPER SCISSORS'),
        `${theme.header}\n\n ⬡  🎮  ${theme.bold('ROCK PAPER SCISSORS')}\n\n  Hei *${pushName}*, pilihlah gerakanmu!\n\n${theme.footer}`,
        '✊  Pilih Gerakan',
        sections,
        settings.footer,
        settings.images.thumb,
      );
    }

    // .rps <pilihan> → game result
    if (!CHOICES[pick]) return reply('❓ Pilihan tidak valid. Ketik .rps');

    const botKey = KEYS[Math.floor(Math.random() * 3)];
    const bot    = CHOICES[botKey];
    const user   = CHOICES[pick];

    let result;
    if (pick === botKey)          result = `🤝 *SERI!* Kita sama-sama ${user.label}`;
    else if (user.beat === botKey) result = `🏆 *KAMU MENANG!* ${user.emoji} ${user.label} mengalahkan ${bot.emoji} ${bot.label}`;
    else                           result = `💀 *KAMU KALAH!* ${bot.emoji} ${bot.label} mengalahkan ${user.emoji} ${user.label}`;

    return reply([
      theme.header, '',
      ` ⬡  🎮  ${theme.bold('ROCK PAPER SCISSORS')}`, '',
      `  👤 Kamu : ${user.emoji} ${user.label}`,
      `  🤖 Bot  : ${bot.emoji} ${bot.label}`,
      '',
      `  ${result}`,
      '', theme.footer,
    ].join('\n'));
  },
};
