'use strict';
const settings = require('../../../settings');
const { randPick } = require('../../../lib/utils');

const ANSWERS = [
  '🟢 Iya, pasti! nya~', '🟢 Tentu saja UwU', '🟢 Yakin banget~',
  '🟢 Bisa dipastikan OwO', '🟢 Sepertinya iya~',
  '🟡 Hmm, mungkin~', '🟡 Tanda-tandanya iya nya~', '🟡 Coba tanya lagi deh~',
  '🟡 Mino kurang yakin nih UwU', '🟡 Belum bisa dipastikan~',
  '🔴 Sepertinya tidak nya~', '🔴 Jangan berharap ya~', '🔴 Tidak, maaf OwO',
  '🔴 Kemungkinan besar tidak~', '🔴 Jawaban Mino: *Tidak* >_<',
];

module.exports = {
  commands: ['8ball', '8b', 'ramalan'],
  category: 'Fun',
  description: 'Magic 8 ball oracle~ Tanya dan Mino jawab!',
  usage: '.8ball <pertanyaan>',

  async handler(sock, m, { text, reply }) {
    if (!text) return reply('❓ Mau tanya apa nya~? Contoh: `.8ball Apakah hari ini beruntung?`');
    const ans    = randPick(ANSWERS);
    const result = [
      `🎱 *Magic 8 Ball* nya~`,
      ``,
      `❓ *Pertanyaan:*`,
      `"${text}"`,
      ``,
      `🔮 *Jawaban Mino:*`,
      ans,
      ``,
      settings.footer,
    ].join('\n');
    await reply(result);
  },
};
