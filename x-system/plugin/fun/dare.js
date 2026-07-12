'use strict';
const settings = require('../../../set/settings');
const { randPick } = require('../../../lib/utils');

const DARES = [
  'Kirim foto selfie sekarang juga! 📸',
  'Kirim voice note ngomong "Aku suka kucing" dengan suara manja UwU',
  'Tag 3 orang dan bilang kamu sayang mereka~ 💕',
  'Set foto profil kamu jadi meme lucu selama 1 jam',
  'Kirim pesan ke nama pertama di kontakmu "Aku kangen kamu" 😅',
  'Ceritakan mimpi aneh yang pernah kamu alami',
  'Kirim GIF/stiker paling absurd yang ada di HP kamu',
  'Nyanyikan 10 detik lagu yang lagi trending dan kirim voice notenya',
  'Tulis status WA pake bahasa alien selama 30 menit',
  'Kirim foto makanan terakhir yang kamu makan',
  'Mention seseorang di grup dan bilang mereka adalah pahlawan hidupmu',
  'Kirim voice note ketawa sekenceng-kencengnya',
  'Ganti nama di grup jadi "Mino Forever" selama 1 jam',
  'Kirim foto tangan kamu sekarang juga',
  'Tulis puisi 4 baris tentang kucing dan kirim sekarang',
];

module.exports = {
  commands: ['dare', 'tantangan'],
  category: 'Fun',
  description: 'Tantangan dare random untuk truth or dare~',
  usage: '.dare',

  async handler(sock, m, { reply, react }) {
    await react('🔥');
    const d = randPick(DARES);
    await reply([
      `🔥 *DARE!* nya~`,
      ``,
      `💪 ${d}`,
      ``,
      `😈 Berani ga? Kalau ga mau, bayar pake answer truth! OwO`,
      ``,
      settings.footer,
    ].join('\n'));
  },
};
