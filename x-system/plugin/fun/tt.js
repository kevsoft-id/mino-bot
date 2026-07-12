'use strict';
const settings = require('../../../set/settings');
const { randPick } = require('../../../lib/utils');

// Truth or Dare kombinasi
module.exports = {
  commands: ['tod', 'truthordare'],
  category: 'Fun',
  description: 'Truth OR Dare — pilih satu nya~',
  usage: '.tod',

  async handler(sock, m, { reply, react }) {
    await react('🎮');
    const choice = Math.random() < 0.5 ? 'truth' : 'dare';

    const text = choice === 'truth'
      ? `💬 *TRUTH!* Kamu dapat pertanyaan jujur!\nKetik *.truth* untuk lihat pertanyaannya~ UwU`
      : `🔥 *DARE!* Kamu dapat tantangan!\nKetik *.dare* untuk lihat tantangannya~ OwO`;

    await reply([
      `🎮 *TRUTH OR DARE* nya~`,
      ``,
      `🎲 Mino pilihkan: ${choice === 'truth' ? '💬 TRUTH' : '🔥 DARE'}!`,
      ``,
      text,
      ``,
      settings.footer,
    ].join('\n'));
  },
};
