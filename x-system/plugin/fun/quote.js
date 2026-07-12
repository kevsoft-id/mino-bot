'use strict';
const settings = require('../../../set/settings');
const { randPick } = require('../../../lib/utils');

const QUOTES = [
  { q: 'Jangan menyerah. Kesuksesan sering datang tepat setelah kamu ingin berhenti.', a: 'Unknown' },
  { q: 'Hidup bukan tentang menunggu badai berlalu, tapi tentang belajar menari di tengah hujan.', a: 'Vivian Greene' },
  { q: 'Kegagalan hanyalah kesuksesan yang tertunda.', a: 'Unknown' },
  { q: 'Mulai dari mana kamu berada, gunakan apa yang kamu punya, lakukan apa yang kamu bisa.', a: 'Arthur Ashe' },
  { q: 'Cara terbaik untuk mewujudkan mimpi adalah bangun dan bertindak.', a: 'Paul Valéry' },
  { q: 'Jika kamu bisa bermimpi, kamu bisa melakukannya.', a: 'Walt Disney' },
  { q: 'Orang yang sukses adalah orang yang tidak pernah berhenti belajar.', a: 'Unknown' },
  { q: 'Setiap hari adalah kesempatan baru untuk menjadi lebih baik.', a: 'Unknown' },
  { q: 'Kamu tidak harus sempurna untuk mulai, tapi kamu harus mulai untuk menjadi sempurna.', a: 'Zig Ziglar' },
  { q: 'Kesempatan ada di mana-mana, yang kamu butuhkan adalah membuka mata.', a: 'Unknown' },
  { q: 'Lebih baik mencoba dan gagal daripada tidak pernah mencoba sama sekali.', a: 'Unknown' },
  { q: 'Jadilah perubahan yang ingin kamu lihat di dunia.', a: 'Mahatma Gandhi' },
  { q: 'Satu-satunya cara untuk melakukan pekerjaan yang luar biasa adalah mencintai apa yang kamu lakukan.', a: 'Steve Jobs' },
  { q: 'Keberhasilan adalah kemampuan untuk pergi dari kegagalan ke kegagalan tanpa kehilangan semangat.', a: 'Winston Churchill' },
  { q: 'Mimpi besar, bekerja keras, tetap rendah hati.', a: 'Unknown' },
];

module.exports = {
  commands: ['quote', 'inspirasi', 'motivasi'],
  category: 'Fun',
  description: 'Dapatkan quote inspiratif random~',
  usage: '.quote',

  async handler(sock, m, { reply, react }) {
    await react('✨');
    const { q, a } = randPick(QUOTES);
    await reply([
      `🌟 *Quote of the Day* nya~`,
      ``,
      `❝ ${q} ❞`,
      ``,
      `   — *${a}*`,
      ``,
      settings.footer,
    ].join('\n'));
  },
};
