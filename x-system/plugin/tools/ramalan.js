'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../settings');

const ZODIACS = {
  aries:       { emoji: '♈', dates: '21 Mar – 19 Apr' },
  taurus:      { emoji: '♉', dates: '20 Apr – 20 Mei' },
  gemini:      { emoji: '♊', dates: '21 Mei – 20 Jun' },
  cancer:      { emoji: '♋', dates: '21 Jun – 22 Jul' },
  leo:         { emoji: '♌', dates: '23 Jul – 22 Ags' },
  virgo:       { emoji: '♍', dates: '23 Ags – 22 Sep' },
  libra:       { emoji: '♎', dates: '23 Sep – 22 Okt' },
  scorpio:     { emoji: '♏', dates: '23 Okt – 21 Nov' },
  sagittarius: { emoji: '♐', dates: '22 Nov – 21 Des' },
  capricorn:   { emoji: '♑', dates: '22 Des – 19 Jan' },
  aquarius:    { emoji: '♒', dates: '20 Jan – 18 Feb' },
  pisces:      { emoji: '♓', dates: '19 Feb – 20 Mar' },
};

const RAMALAN_TEXTS = {
  karir: [
    'Hari ini cocok untuk mengambil keputusan besar dalam karir.',
    'Produktivitas tinggi — selesaikan proyek yang tertunda.',
    'Ada kesempatan kolaborasi yang menguntungkan datang hari ini.',
    'Fokus pada detail kecil, bisa berdampak besar pada hasil kerja.',
    'Atasan memperhatikan kerja kerasmu — pertahankan!',
  ],
  cinta: [
    'Komunikasi terbuka dengan pasangan akan mempererat hubungan.',
    'Hari yang baik untuk mengungkapkan perasaan.',
    'Jaga keseimbangan antara karir dan hubungan personal.',
    'Kejutan kecil untuk orang tersayang akan sangat berarti.',
    'Bersabar — hal baik akan datang tepat waktu.',
  ],
  finansial: [
    'Hindari pengeluaran impulsif hari ini.',
    'Investasi kecil sekarang bisa menghasilkan besar di masa depan.',
    'Rezeki tidak terduga mungkin datang dari arah yang tidak disangka.',
    'Bijak mengelola keuangan adalah kunci ketenangan.',
    'Hari yang baik untuk menabung dan merencanakan anggaran.',
  ],
  kesehatan: [
    'Perhatikan pola tidurmu — istirahat yang cukup sangat penting.',
    'Olahraga ringan hari ini akan membuat tubuh lebih segar.',
    'Jaga asupan air putih dan makan tepat waktu.',
    'Stress berkurang jika kamu luangkan waktu untuk hobi.',
    'Tubuh memberikan sinyal — dengarkan dan jangan abaikan.',
  ],
};

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function getStars() { return '⭐'.repeat(Math.floor(Math.random() * 2) + 3) + '✨'; }
function getRating() { return (Math.random() * 2 + 3).toFixed(1) + '/5.0'; }

const FORTUNES = [
  'Hari ini akan membawa kejutan menyenangkan yang tidak terduga.',
  'Seseorang dari masa lalu akan menghubungimu hari ini.',
  'Keberuntungan ada di pihakmu — ambil kesempatan yang datang!',
  'Tetap tenang menghadapi tantangan — hasilnya akan memuaskan.',
  'Energi positif mengelilingimu — bagikan kebaikan kepada orang lain.',
  'Sebuah keputusan penting perlu dibuat — ikuti intuisimu.',
  'Hari yang tepat untuk memulai sesuatu yang selama ini ditunda.',
  'Kerja keras dan doa selalu membawa hasil yang baik.',
  'Jaga komunikasi — salah paham bisa dihindari dengan kejujuran.',
  'Bersyukur atas yang kecil akan menghadirkan yang lebih besar.',
];

module.exports = [
  // ── .ramalan {zodiak} ───────────────────────────────────
  {
    commands:    ['ramalan', 'zodiak', 'horoskop', 'bintang'],
    category:    'Tools',
    description: 'Ramalan zodiak harian',
    usage:       '.ramalan {zodiak}  |  .ramalan list',

    async handler(sock, m, { args, text, reply, react }) {
      const { theme } = settings;

      if (!text || text === 'list') {
        const list = Object.entries(ZODIACS).map(([name, z]) =>
          `    ${z.emoji} *${name.charAt(0).toUpperCase() + name.slice(1)}* — ${z.dates}`
        ).join('\n');

        return reply([
          theme.header, '',
          ` ⬡  ✨  ${theme.bold('DAFTAR ZODIAK')}`, '',
          list,
          '',
          `    💡 Contoh: .ramalan aries`,
          '',
          theme.footer,
        ].join('\n'));
      }

      const zodiak = text.toLowerCase().trim();
      const info   = ZODIACS[zodiak];

      if (!info) {
        const list = Object.keys(ZODIACS).join(', ');
        return reply(`❓ Zodiak tidak dikenal.\nPilihan: ${list}`);
      }

      await react(info.emoji);

      const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        timeZone: settings.timezone,
      });

      await reply([
        theme.header, '',
        ` ⬡  ${info.emoji}  ${theme.bold(zodiak.toUpperCase() + ' — RAMALAN HARIAN')}`, '',
        `    📅 ${today}`,
        '',
        `    💼 *Karir*     : ${rand(RAMALAN_TEXTS.karir)}`,
        `    ❤️  *Cinta*     : ${rand(RAMALAN_TEXTS.cinta)}`,
        `    💰 *Finansial* : ${rand(RAMALAN_TEXTS.finansial)}`,
        `    🏥 *Kesehatan* : ${rand(RAMALAN_TEXTS.kesehatan)}`,
        '',
        `    ⭐ *Rating Hari Ini*: ${getRating()}`,
        `    ${getStars()}`,
        '',
        `    _Sekedar hiburan — masa depan ada di tanganmu sendiri!_`,
        '',
        theme.footer,
      ].join('\n'));
    },
  },

  // ── .fortune — Random fortune cookie ───────────────────
  {
    commands:    ['fortune', 'keberuntungan', 'nasib', 'tarot'],
    category:    'Tools',
    description: 'Ramal keberuntungan hari ini (fortune cookie)',
    usage:       '.fortune',

    async handler(sock, m, { reply, react }) {
      const { theme } = settings;
      await react('🔮');

      const fortune = rand(FORTUNES);
      const luck    = Math.floor(Math.random() * 40) + 60; // 60-100%
      const emojis  = ['🌟', '✨', '💫', '🍀', '🎯', '🔮', '🌈'];

      await reply([
        theme.header, '',
        ` ⬡  🔮  ${theme.bold('FORTUNE OF THE DAY')}`, '',
        `    ${rand(emojis)} ${fortune}`,
        '',
        `    🍀 *Lucky Number*: ${Math.floor(Math.random() * 100)}`,
        `    🎨 *Lucky Color* : ${rand(['Biru', 'Merah', 'Hijau', 'Emas', 'Putih', 'Ungu'])}`,
        `    ⚡ *Energy*      : ${luck}%`,
        `    ${'█'.repeat(Math.floor(luck / 10))}${'░'.repeat(10 - Math.floor(luck / 10))} ${luck}%`,
        '',
        theme.footer,
      ].join('\n'));
    },
  },
];
