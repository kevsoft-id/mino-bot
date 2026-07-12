'use strict';
const settings = require('../../../set/settings');

module.exports = {
  commands: ['coin', 'koin', 'flip'],
  category: 'Fun',
  description: 'Lempar koin~ Heads atau Tails?',
  usage: '.coin',

  async handler(sock, m, { reply, react }) {
    await react('🪙');
    const result  = Math.random() < 0.5;
    const side    = result ? 'HEADS' : 'TAILS';
    const emoji   = result ? '👑' : '🌟';
    await reply([
      `🪙 *Lempar Koin~*`,
      ``,
      `${emoji} Hasilnya: *${side}*`,
      ``,
      result ? `Kepala! Raja yang menang nya~` : `Ekor! Bintang bersinar UwU~`,
      ``,
      settings.footer,
    ].join('\n'));
  },
};
