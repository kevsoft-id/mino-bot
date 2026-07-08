'use strict';
const settings = require('../../../settings');

module.exports = {
  commands: ['gayrate', 'gr', 'gaymeter'],
  category: 'Fun',
  description: 'Gay rate detector (just for fun nya~)',
  usage: '.gayrate @tag',

  async handler(sock, m, { mentions, quotedSender, pushName, reply }) {
    const target     = mentions[0] || quotedSender;
    const targetName = target ? `@${target.split('@')[0]}` : pushName || 'kamu';
    const rate       = Math.floor(Math.random() * 101);

    const bars  = Math.floor(rate / 10);
    const bar   = '█'.repeat(bars) + '░'.repeat(10 - bars);
    const emoji =
      rate < 20  ? '😎' :
      rate < 40  ? '🤔' :
      rate < 60  ? '👀' :
      rate < 80  ? '🌈' : '🎉';

    const text = [
      `🌈 *Gay Rate Detector* nya~`,
      ``,
      `🎯 Target: ${targetName}`,
      ``,
      `📊 \`[${bar}]\` *${rate}%*`,
      ``,
      `${emoji} ${
        rate < 20 ? 'Sangat straight, ga ada tanda-tanda~' :
        rate < 40 ? 'Mostly straight, tapi siapa tau~ UwU' :
        rate < 60 ? 'Di tengah-tengah, mysterious nya~' :
        rate < 80 ? 'Lumayan tinggi nih~ 👀' :
                    'Off the charts! 🎊'
      }`,
      ``,
      `⚠️ *Just for fun ya~ jangan baper UwU*`,
      ``,
      settings.footer,
    ].join('\n');

    await sock.sendMessage(m.key.remoteJid, {
      text,
      mentions: target ? [target] : [],
    }, { quoted: m });
  },
};
