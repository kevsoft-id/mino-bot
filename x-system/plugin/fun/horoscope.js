'use strict';
const settings = require('../../../set/settings');
const { randPick } = require('../../../lib/utils');

const ZODIACS = {
  'aries':       { emoji: '♈', date: '21 Mar – 19 Apr' },
  'taurus':      { emoji: '♉', date: '20 Apr – 20 Mei' },
  'gemini':      { emoji: '♊', date: '21 Mei – 20 Jun' },
  'cancer':      { emoji: '♋', date: '21 Jun – 22 Jul' },
  'leo':         { emoji: '♌', date: '23 Jul – 22 Ags' },
  'virgo':       { emoji: '♍', date: '23 Ags – 22 Sep' },
  'libra':       { emoji: '♎', date: '23 Sep – 22 Okt' },
  'scorpio':     { emoji: '♏', date: '23 Okt – 21 Nov' },
  'sagittarius': { emoji: '♐', date: '22 Nov – 21 Des' },
  'capricorn':   { emoji: '♑', date: '22 Des – 19 Jan' },
  'aquarius':    { emoji: '♒', date: '20 Jan – 18 Feb' },
  'pisces':      { emoji: '♓', date: '19 Feb – 20 Mar' },
};

const FORTUNES = [
  'Hari ini penuh peluang emas, jangan dilewatkan!',
  'Energimu sedang tinggi-tingginya, manfaatkan sebaik mungkin~',
  'Ada kejutan menyenangkan yang menunggumu nya~!',
  'Waspada dalam hal keuangan, tapi hati tetap bahagia UwU',
  'Hubunganmu dengan seseorang akan semakin erat hari ini~',
  'Fokus dan kerja keras adalah kuncinya hari ini, kamu bisa!',
  'Saatnya beristirahat dan recharge energi ya nya~',
  'Kreativitasmu akan bersinar terang hari ini OwO!',
  'Ada hal baru yang akan kamu pelajari dengan menarik~',
  'Percaya diri! Hari ini adalah hari milikmu nya~!',
];

const LUCKY = {
  number: () => Math.floor(Math.random() * 99) + 1,
  color:  () => randPick(['Merah 🔴', 'Biru 🔵', 'Hijau 🟢', 'Kuning 🟡', 'Ungu 🟣', 'Orange 🟠', 'Pink 🌸', 'Putih ⚪']),
  time:   () => `${Math.floor(Math.random() * 12) + 1}:${['00','15','30','45'][Math.floor(Math.random()*4)]}${Math.random()<0.5?'AM':'PM'}`,
};

module.exports = {
  commands: ['horoscope', 'zodiak', 'ramalan', 'zodiac'],
  category: 'Fun',
  description: 'Lihat ramalan bintang~',
  usage: '.horoscope <zodiak>  contoh: .horoscope leo',

  async handler(sock, m, { args, reply, react }) {
    await react('⭐');

    const zodKey = args[0]?.toLowerCase();
    if (!zodKey || !ZODIACS[zodKey]) {
      const list = Object.entries(ZODIACS).map(([k, v]) => `${v.emoji} \`${k}\` (${v.date})`).join('\n');
      return reply(`🔮 Pilih zodiak kamu nya~\nContoh: \`.horoscope leo\`\n\n${list}`);
    }

    const zod     = ZODIACS[zodKey];
    const fortune = randPick(FORTUNES);
    const score   = Math.floor(Math.random() * 3) + 3;
    const stars   = '⭐'.repeat(score) + '☆'.repeat(5 - score);

    await reply([
      `🔮 *RAMALAN BINTANG* nya~`,
      ``,
      `${zod.emoji} *${zodKey.toUpperCase()}*`,
      `📅 ${zod.date}`,
      ``,
      `━━━━━━━━━━━━━━━━`,
      `✨ *Ramalan Hari Ini:*`,
      fortune,
      ``,
      `📊 *Rating  :* ${stars} (${score}/5)`,
      `🔢 *Lucky # :* ${LUCKY.number()}`,
      `🎨 *Lucky 🎨:* ${LUCKY.color()}`,
      `⏰ *Lucky ⏰:* ${LUCKY.time()}`,
      `━━━━━━━━━━━━━━━━`,
      ``,
      `🐾 Semangat hari ini ya~ UwU 💕`,
      ``,
      settings.footer,
    ].join('\n'));
  },
};
