'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../set/settings');
const { replyImage } = require('../../../lib/utils');

function shipScore(a, b) {
  const str = (a + b).toLowerCase();
  let h = 0;
  for (const c of str) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0;
  return Math.abs(h % 101);
}

function shipBar(score) {
  const filled = Math.round(score / 10);
  return '❤️'.repeat(filled) + '🖤'.repeat(10 - filled);
}

function shipLabel(score) {
  if (score >= 90) return '💞 SOULMATE!';
  if (score >= 75) return '💕 Sangat cocok~';
  if (score >= 60) return '💗 Cukup cocok';
  if (score >= 45) return '💛 Ada potensi';
  if (score >= 30) return '🤍 Biasa aja';
  if (score >= 15) return '💔 Kurang cocok';
  return '💀 Jangan dipaksain';
}

module.exports = {
  commands:    ['ship', 'love', 'jodoh'],
  category:    'Fun',
  description: 'Hitung tingkat kecocokan dua orang 💕',
  usage:       '.ship @user1 @user2  atau  .ship nama1 | nama2',

  async handler(sock, m, { text, mentions, sender, reply }) {
    const { theme } = settings;

    let name1, name2;
    if (mentions.length >= 2) {
      name1 = '@' + mentions[0].split('@')[0];
      name2 = '@' + mentions[1].split('@')[0];
    } else if (mentions.length === 1) {
      name1 = '@' + sender.split('@')[0];
      name2 = '@' + mentions[0].split('@')[0];
    } else if (text.includes('|')) {
      [name1, name2] = text.split('|').map(s => s.trim());
    } else {
      return reply('❓ Contoh:\n  .ship @user1 @user2\n  .ship Ani | Budi');
    }

    const score = shipScore(name1, name2);
    const bar   = shipBar(score);
    const label = shipLabel(score);

    const result = [
      theme.header,
      '',
      ` ⬡  💕  ${theme.bold('SHIP METER')}`,
      '',
      `  👤 ${theme.bold(name1)}`,
      `  💞 + `,
      `  👤 ${theme.bold(name2)}`,
      '',
      `  ${bar}`,
      `  ${theme.bold(score + '%')}  —  ${label}`,
      '',
      theme.footer,
    ].join('\n');

    return replyImage(sock, m, settings.images.thumb, result);
  },
};
