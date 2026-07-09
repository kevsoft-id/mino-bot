'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../settings');

const QUOTES = [
  { q: 'Jangan takut gagal. Takutlah untuk tidak mencoba.', a: 'Michael Jordan' },
  { q: 'Sukses adalah hasil dari kerja keras, bukan keberuntungan semata.', a: 'Thomas Edison' },
  { q: 'Mimpi tidak akan bekerja kecuali kamu bekerja keras.', a: 'John C. Maxwell' },
  { q: 'Kegagalan adalah kesempatan untuk memulai lagi dengan lebih cerdas.', a: 'Henry Ford' },
  { q: 'Orang yang berhenti belajar adalah orang tua, walau umur 20. Orang yang terus belajar akan tetap muda.', a: 'Henry Ford' },
  { q: 'Hari ini keras, esok lebih keras, lusa akan indah.', a: 'Jack Ma' },
  { q: 'Jadilah perubahan yang ingin kamu lihat di dunia.', a: 'Mahatma Gandhi' },
  { q: 'Kamu tidak harus hebat untuk memulai, tapi harus mulai untuk menjadi hebat.', a: 'Zig Ziglar' },
  { q: 'Kesuksesan adalah perjalanan, bukan tujuan.', a: 'Ben Sweetland' },
  { q: 'Percayalah bahwa kamu bisa, dan kamu sudah setengah jalan.', a: 'Theodore Roosevelt' },
  { q: 'Satu-satunya cara untuk melakukan pekerjaan yang hebat adalah mencintai apa yang kamu lakukan.', a: 'Steve Jobs' },
  { q: 'Hidup adalah 10% dari apa yang terjadi padamu dan 90% bagaimana reaksimu.', a: 'Charles R. Swindoll' },
  { q: 'Bukan gunung yang kita taklukkan, tapi diri sendiri.', a: 'Edmund Hillary' },
  { q: 'Tindakan adalah fondasi dari semua kesuksesan.', a: 'Pablo Picasso' },
  { q: 'Jika kamu bisa bermimpi, kamu bisa melakukannya.', a: 'Walt Disney' },
  { q: 'Lebih baik mencoba dan gagal daripada tidak mencoba sama sekali.', a: 'Unknown' },
  { q: 'Mulailah dari mana kamu berada. Gunakan apa yang kamu punya. Lakukan apa yang kamu bisa.', a: 'Arthur Ashe' },
];

const SEMANGAT = [
  '💪 Kamu bisa! Jangan menyerah sekarang!',
  '🔥 Terus bergerak meski lambat, yang penting jangan berhenti!',
  '⭐ Hari ini mungkin berat, tapi kamu lebih kuat dari masalahmu!',
  '🌟 Setiap langkah kecil adalah kemajuan. Bangga sama dirimu!',
  '🚀 Kegagalan bukan akhir, tapi batu loncatan menuju sukses!',
  '💎 Berlian terbentuk dari tekanan. Kamu sedang dibentuk jadi berlian!',
  '🌈 Setelah hujan pasti ada pelangi. Tahan sebentar lagi!',
  '🏆 Percayalah pada prosesmu. Hasilnya tidak akan mengecewakan!',
];

module.exports = {
  commands:    ['motivasi', 'motivate', 'semangat', 'quotes', 'quoteharian'],
  category:    'Fun',
  description: 'Kata-kata motivasi dan penyemangat harian',
  usage:       '.motivasi  |  .semangat',

  async handler(sock, m, { command, reply, react }) {
    const { theme } = settings;
    await react('💪');

    if (command === 'semangat') {
      const msg = SEMANGAT[Math.floor(Math.random() * SEMANGAT.length)];
      return reply([
        theme.header, '',
        ` ⬡  🔥  ${theme.bold('SEMANGAT!')}`, '',
        `    ${msg}`,
        '',
        theme.footer,
      ].join('\n'));
    }

    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    await reply([
      theme.header, '',
      ` ⬡  💡  ${theme.bold('KATA MOTIVASI')}`, '',
      `    _"${q.q}"_`,
      '',
      `    — ${theme.bold(q.a)}`,
      '',
      `    _Ketik .motivasi untuk quote lain_`,
      '',
      theme.footer,
    ].join('\n'));
  },
};
