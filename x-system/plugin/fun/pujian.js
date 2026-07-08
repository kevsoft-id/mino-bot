'use strict';
const settings = require('../../../settings');
const { randPick } = require('../../../lib/utils');

const PUJIAN = [
  'Kamu itu kayak matahari — selalu mencerahkan hari orang lain nya~ ☀️',
  'Senyummu itu smilemu lebih indah dari sakura yang mekar UwU 🌸',
  'Kamu adalah orang yang sangat istimewa, jangan lupa bahagia ya nya~! ✨',
  'Otakmu itu tajam kayak pedang samurai, tapi hatimu selembut kapas OwO 💕',
  'Kamu tuh kayak permata — langka, berharga, dan selalu bersinar~',
  'Energi positifmu itu menular nya~! Bikin semua orang di sekitarmu happy 🌟',
  'Kamu adalah bukti bahwa keajaiban itu ada, karena kehadiranmu bikin dunia lebih indah UwU',
  'Setiap hal yang kamu lakukan selalu penuh dedikasi dan passion — salut banget nya~! 💪',
  'Kamu adalah bintang yang paling terang di langit hidupku OwO ⭐',
  'Kepintaran dan kebaikan hatimu itu combo yang langka banget loh nya~! 🎉',
  'Kamu tuh kayak kopi di pagi hari — bikin semangat dan selalu dinantikan~ ☕',
  'Kreativitasmu itu out of the box banget, Mino salut sama kamu UwU!',
];

module.exports = {
  commands: ['pujian', 'compliment', 'puji'],
  category: 'Fun',
  description: 'Puji seseorang dengan kata-kata manis~',
  usage: '.pujian @tag',

  async handler(sock, m, { mentions, quotedSender, pushName, reply }) {
    const target = mentions[0] || quotedSender;
    const pujian = randPick(PUJIAN);
    const targetName = target ? `@${target.split('@')[0]}` : pushName || 'kamu';

    const text = [
      `💖 *PUJIAN SPESIAL* nya~`,
      ``,
      `🎯 Untuk: ${targetName}`,
      ``,
      `💬 "${pujian}"`,
      ``,
      `🐾 *Mino sayang semua yang baik-baik UwU~* 💕`,
      ``,
      settings.footer,
    ].join('\n');

    await sock.sendMessage(m.key.remoteJid, {
      text,
      mentions: target ? [target] : [],
    }, { quoted: m });
  },
};
