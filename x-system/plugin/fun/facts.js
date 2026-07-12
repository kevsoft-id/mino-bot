'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const axios    = require('axios');
const settings = require('../../../set/settings');

const LOCAL_FACTS = [
  'Gurita memiliki 3 jantung dan darahnya berwarna biru!',
  'Lebah madu hanya tidur 5 jam sehari.',
  'Ubur-ubur 98% terdiri dari air.',
  'Kucing tidak bisa merasakan rasa manis.',
  'Pisang secara teknis adalah buah beri, sedangkan strawberry bukan.',
  'Bintang laut tidak memiliki otak.',
  'Semut tidak pernah tidur.',
  'Kuda nil menghasilkan "keringat" berwarna merah yang berfungsi sebagai tabir surya.',
  'Siput bisa tidur selama 3 tahun.',
  'Buaya tidak bisa menjulurkan lidah.',
  'Unta menyimpan energi di punuknya, bukan air.',
  'Manusia adalah satu-satunya hewan yang tertawa.',
  'Lumba-lumba tidur dengan satu mata terbuka.',
  'Tangan kanan Michelangelo lebih besar dari tangan kirinya karena melukis terus.',
  'Warna merah tidak benar-benar membuat banteng marah — mereka butawarna merah.',
  'Indonesia memiliki lebih dari 17.000 pulau.',
  'Borobudur adalah candi Buddha terbesar di dunia.',
  'Komodo hanya hidup di Indonesia.',
  'Bahasa Indonesia adalah bahasa ke-10 paling banyak digunakan di dunia.',
  'Rafflesia arnoldii — bunga terbesar di dunia — asli Indonesia.',
];

module.exports = {
  commands:    ['facts', 'funfact', 'fakta', 'tahukah', 'didyouknow'],
  category:    'Fun',
  description: 'Fakta unik dan menarik yang bikin amazed!',
  usage:       '.facts  |  .facts {topik}',

  async handler(sock, m, { text, reply, react }) {
    const { theme } = settings;
    await react('🤯');

    try {
      let fact = '';

      if (text) {
        // Search facts about a topic using wikipedia
        const { data } = await axios.get(
          `https://id.wikipedia.org/api/rest_v1/page/random/summary`,
          { timeout: 8000 }
        );
        fact = data.extract?.split('.')[0] + '.' || '';
      }

      if (!fact) {
        fact = LOCAL_FACTS[Math.floor(Math.random() * LOCAL_FACTS.length)];
      }

      await react('✅');
      await reply([
        theme.header, '',
        ` ⬡  🤯  ${theme.bold('TAHUKAH KAMU?')}`, '',
        `    💡 ${fact}`,
        '',
        `    _Ketik .facts lagi untuk fakta baru!_`,
        '',
        theme.footer,
      ].join('\n'));
    } catch {
      const fact = LOCAL_FACTS[Math.floor(Math.random() * LOCAL_FACTS.length)];
      await reply([
        `🤯 *TAHUKAH KAMU?*\n\n💡 ${fact}\n\n${settings.footer}`,
      ].join('\n'));
    }
  },
};
