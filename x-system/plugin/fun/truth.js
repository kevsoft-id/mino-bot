'use strict';
const settings = require('../../../settings');
const { randPick } = require('../../../lib/utils');

const TRUTHS = [
  'Siapa crush kamu sekarang? 👀',
  'Pernah bohong sama orang tua? Bohong apa?',
  'Apa hal paling memalukan yang pernah kamu lakuin?',
  'Pernah naksir orang di grup ini? Siapa?',
  'Apa rahasia yang belum pernah kamu ceritain ke siapapun?',
  'Pernah nangis karena alasan yang sepele? Apa?',
  'Kamu lebih milih jomblo selamanya atau punya pacar tapi jelek?',
  'Apa hal yang paling kamu sesali dalam hidup?',
  'Berapa nomor kamu dari 1-10 dalam hal penampilan, jujur ya~',
  'Pernah stalk mantan di sosmed? Kapan terakhir?',
  'Apa fitur WhatsApp yang paling sering kamu pakai untuk kepo?',
  'Kalau bisa hidup jadi orang lain selama sehari, kamu mau jadi siapa?',
  'Hal apa yang bikin kamu langsung salting kalau ketemu seseorang?',
  'Pernah pura-pura sibuk padahal lagi gabut? Sama siapa?',
  'Apa aplikasi yang paling sering dibuka tapi malu diakui?',
];

module.exports = {
  commands: ['truth', 'kebenaran'],
  category: 'Fun',
  description: 'Pertanyaan truth random untuk truth or dare~',
  usage: '.truth',

  async handler(sock, m, { reply, react }) {
    await react('💬');
    const q = randPick(TRUTHS);
    await reply([
      `💬 *TRUTH!* nya~`,
      ``,
      `❓ ${q}`,
      ``,
      `🎮 Jawab jujur ya~ kalau ga mau jawab, kena dare! UwU`,
      ``,
      settings.footer,
    ].join('\n'));
  },
};
