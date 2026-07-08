'use strict';
const settings = require('../../../settings');
const { randPick, mention, getMentions } = require('../../../lib/utils');

const ROASTS = [
  'Wajahmu kayak WiFi tetangga — keliatan tapi ga bisa dihubungin~',
  'Kalo otakmu dijual, kayaknya masih belum laku UwU',
  'Kamu itu kayak kalkulator rusak — ga bisa diandalkan terus nya~',
  'Kepribadianmu mirip hari Senin — ga ada yang suka OwO',
  'Kamu kayak sinyal 2G di gua — lemot dan ga berguna nya~',
  'Kalau kamu planet, kamu pasti Pluto — ga dianggap yang bener UwU',
  'IQ kamu kayak suhu lemari es — dingin dan rendah nya~',
  'Kamu kayak charger bootleg — lama ngisinya, gampang rusak OwO',
  'Otak kamu kayak storage 16GB — penuh sampah dan lemot nya~',
  'Kamu kayak baterai lama — selalu low energy dan minta dicharge terus~',
  'Nasibmu kayak tas kresek — dibawa kemana-mana tapi ga dihargai UwU',
  'Kamu tuh kayak koneksi internet gratis — ga bisa diandalkan nya~',
];

module.exports = {
  commands: ['roast', 'bully'],
  category: 'Fun',
  description: 'Roast seseorang (just for fun, jangan baper ya~)',
  usage: '.roast @tag atau reply pesan',

  async handler(sock, m, { mentions, quotedSender, pushName, reply }) {
    const target = mentions[0] || quotedSender;

    let targetName;
    let targetMention;

    if (target) {
      targetName    = `@${target.split('@')[0]}`;
      targetMention = target;
    } else {
      targetName = pushName || 'kamu';
    }

    const roast = randPick(ROASTS);
    const text  = [
      `🔥 *ROAST TIME* nya~`,
      ``,
      `🎯 Target: ${targetName}`,
      ``,
      `💬 "${roast}"`,
      ``,
      `😂 *Jangan baper ya~ ini cuma bercanda UwU*`,
      ``,
      settings.footer,
    ].join('\n');

    await sock.sendMessage(m.key.remoteJid, {
      text,
      mentions: target ? [target] : [],
    }, { quoted: m });
  },
};
