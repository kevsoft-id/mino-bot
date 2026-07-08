'use strict';
const settings = require('../../../settings');

const DICE_EMOJI = ['⚀','⚁','⚂','⚃','⚄','⚅'];

module.exports = {
  commands: ['dice', 'dadu', 'roll'],
  category: 'Fun',
  description: 'Roll dadu! Bisa tentukan jumlah sisi~',
  usage: '.dice [sisi]',

  async handler(sock, m, { args, reply, react }) {
    const sides = parseInt(args[0]) || 6;
    if (sides < 2 || sides > 1000) return reply('❌ Sisi dadu harus antara 2-1000 nya~');

    await react('🎲');
    const result = Math.floor(Math.random() * sides) + 1;
    const emoji  = sides === 6 ? DICE_EMOJI[result - 1] : '🎲';

    await reply([
      `${emoji} *Dadu ${sides} sisi*`,
      ``,
      `🎯 Hasilnya: *${result}*`,
      ``,
      result === sides ? `🎉 *JACKPOT! Sisi tertinggi!* OwO~` :
      result === 1    ? `😱 *Sisi terendah! Lagi apes nya~* >_<` :
                       `🎲 Lumayan~ UwU`,
      ``,
      settings.footer,
    ].join('\n'));
  },
};
