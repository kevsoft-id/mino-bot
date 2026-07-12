'use strict';
const settings = require('../../../set/settings');

function calcRate(a, b) {
  // Pseudo-random tapi konsisten berdasarkan nama
  const combined = a + b;
  let hash = 0;
  for (const c of combined) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
  return Math.abs(hash) % 101;
}

module.exports = {
  commands: ['cintaan', 'ship', 'love', 'jodoh'],
  category: 'Fun',
  description: 'Ship rate dua orang~ seberapa cocok mereka?',
  usage: '.cintaan @tag1 @tag2',

  async handler(sock, m, { mentions, pushName, reply }) {
    if (mentions.length < 2) {
      return reply('❤️ Tag 2 orang ya nya~\nContoh: `.cintaan @nama1 @nama2`');
    }

    const a    = mentions[0];
    const b    = mentions[1];
    const nameA = `@${a.split('@')[0]}`;
    const nameB = `@${b.split('@')[0]}`;
    const rate  = calcRate(a, b);

    const hearts = '❤️'.repeat(Math.ceil(rate / 20));
    const bars   = Math.floor(rate / 10);
    const bar    = '♥'.repeat(bars) + '♡'.repeat(10 - bars);

    const level =
      rate < 20  ? 'Hmm, kayaknya kurang cocok deh~ 😅' :
      rate < 40  ? 'Ada potensi sih, tapi butuh usaha UwU' :
      rate < 60  ? 'Lumayan cocok nya~! Coba dicoba~' :
      rate < 80  ? 'Wah cocok banget! Jadian aja~ OwO 💕' :
      rate < 95  ? 'SUPER MATCH! Kayak jodoh nya~! 💘' :
                   '💯 PERFECT MATCH! Mino shipper kalian~! 🎊';

    const text = [
      `💕 *LOVE CALCULATOR* nya~`,
      ``,
      `${nameA} + ${nameB}`,
      ``,
      `📊 \`[${bar}]\` *${rate}%*`,
      `${hearts}`,
      ``,
      level,
      ``,
      settings.footer,
    ].join('\n');

    await sock.sendMessage(m.key.remoteJid, {
      text,
      mentions: [a, b],
    }, { quoted: m });
  },
};
