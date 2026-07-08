'use strict';
module.exports = {
  commands: ['say', 'echo', 'ulangi'],
  category: 'Fun',
  description: 'Mino ulangi apa yang kamu tulis~',
  usage: '.say <teks>',

  async handler(sock, m, { text, reply }) {
    if (!text) return reply('❓ Mau Mino bilang apa nya~? Contoh: `.say halo dunia`');
    await reply(text);
  },
};
