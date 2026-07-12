'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../set/settings');

const SCENARIOS = [
  ['Jadi jutawan tapi tidak punya teman', 'Punya banyak teman tapi miskin'],
  ['Bisa terbang tapi tidak bisa berenang', 'Bisa berenang tapi tidak bisa berlari'],
  ['Makan makanan yang sama setiap hari selamanya', 'Tidak pernah makan makanan favorit lagi'],
  ['Tahu kapan kamu akan mati', 'Tidak tahu tapi dijamin umur panjang'],
  ['Hidup 200 tahun tapi tidak punya smartphone', 'Hidup 50 tahun dengan semua teknologi masa depan'],
  ['Bisa bicara semua bahasa di dunia', 'Bisa bermain semua alat musik'],
  ['Jadi terkenal tapi tidak bahagia', 'Tidak dikenal siapapun tapi sangat bahagia'],
  ['Tidak bisa berbohong selamanya', 'Tidak dipercaya siapapun selamanya'],
  ['Selalu terlambat 10 menit', 'Selalu lebih awal 20 menit'],
  ['Bisa membaca pikiran orang lain', 'Membuat orang lain tidak bisa membaca pikiranmu'],
  ['Pakai baju musim panas saat musim dingin', 'Pakai baju musim dingin saat musim panas'],
  ['Hanya bisa makan pizza selamanya', 'Tidak boleh makan pizza selamanya'],
  ['Punya ingatan sempurna', 'Bisa melupakan apapun yang kamu inginkan'],
  ['Kerja keras tapi sukses', 'Hidup santai tapi biasa-biasa saja'],
  ['Tidak ada internet selama 1 tahun', 'Tidak bisa keluar rumah selama 3 bulan'],
];

module.exports = {
  commands:    ['wyr', 'pilihsatu', 'wouldyourather', 'pilih'],
  category:    'Fun',
  description: 'Would You Rather — pilih satu di antara dua pilihan sulit!',
  usage:       '.wyr',

  async handler(sock, m, { reply, react }) {
    const { theme } = settings;
    const [a, b] = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];

    await react('🤔');
    await reply([
      theme.header, '',
      ` ⬡  🤔  ${theme.bold('WOULD YOU RATHER?')}`, '',
      `    Kamu lebih pilih mana?`,
      '',
      `    🅰️  ${a}`,
      '',
      `    ────── atau ──────`,
      '',
      `    🅱️  ${b}`,
      '',
      `    💬 Jawab A atau B di chat dan diskusi sama teman!`,
      `    🎲 Ketik .wyr untuk skenario lain`,
      '',
      theme.footer,
    ].join('\n'));
  },
};
