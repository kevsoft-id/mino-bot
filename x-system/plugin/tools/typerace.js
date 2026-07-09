'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../settings');

const SENTENCES = [
  'Belajar pemrograman itu menyenangkan dan sangat bermanfaat',
  'Kucing adalah hewan peliharaan yang lucu dan menggemaskan',
  'Indonesia memiliki budaya yang sangat kaya dan beragam',
  'Teknologi berkembang sangat pesat di era modern ini',
  'Membaca buku setiap hari membuat wawasan kita semakin luas',
  'Kegagalan adalah batu loncatan menuju kesuksesan sejati',
  'Kreativitas dan inovasi adalah kunci menghadapi masa depan',
  'Bersatu kita teguh bercerai kita runtuh adalah semboyan bangsa',
  'Bot WhatsApp memudahkan komunikasi dan otomatisasi tugas',
  'Menulis kode yang bersih adalah seni yang harus dikuasai',
];

const races = {}; // jid → { sentence, startTime, participants }

module.exports = {
  commands:    ['typerace', 'ketikrace', 'tr2', 'ketikanlah'],
  category:    'Fun',
  description: 'Game ketik cepat! Siapa yang paling cepat mengetik?',
  usage:       '.typerace',

  async handler(sock, m, { jid, sender, pushName, reply, react }) {
    const { theme } = settings;

    // Check if there's an active race — try to match
    if (races[jid]) {
      const race = races[jid];
      const text =
        m.message?.conversation ||
        m.message?.extendedTextMessage?.text || '';

      // Check if they typed the correct sentence
      if (text.trim().toLowerCase() === race.sentence.toLowerCase()) {
        const elapsed = ((Date.now() - race.startTime) / 1000).toFixed(2);
        const wpm     = Math.round((race.sentence.split(' ').length / (elapsed / 60)));

        if (!race.results) race.results = [];
        race.results.push({ sender, name: pushName, elapsed, wpm });

        // End race after first finisher
        clearTimeout(race.timeout);
        delete races[jid];

        await react('🏆');
        return reply([
          `🏆 *TYPERACE SELESAI!*`,
          ``,
          `🥇 *${pushName}* menang!`,
          `⏱️ Waktu: *${elapsed}s*`,
          `⌨️ Kecepatan: *${wpm} WPM*`,
          ``,
          `Mau balas lagi? .typerace`,
          ``,
          settings.footer,
        ].join('\n'));
      }
      return; // not the right text, ignore
    }

    // Start new race
    if (races[jid]) return reply('⚠️ Race sedang berlangsung! Ketik kalimat di atas.');

    const sentence = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
    const timeout  = setTimeout(async () => {
      if (races[jid]) {
        delete races[jid];
        await sock.sendMessage(jid, {
          text: `⏰ *Waktu habis!* Tidak ada yang berhasil mengetik.\n\nKalimat: _${sentence}_\n\nKetik .typerace untuk coba lagi!\n\n${settings.footer}`,
        });
      }
    }, 45000);

    races[jid] = { sentence, startTime: Date.now(), timeout };

    await react('⌨️');
    await reply([
      theme.header, '',
      ` ⬡  ⌨️  ${theme.bold('TYPERACE!')}`, '',
      `    Ketik kalimat berikut dengan cepat dan tepat:`,
      '',
      `    _"${sentence}"_`,
      '',
      `    ⏱️ Waktu: 45 detik`,
      `    ✅ Salin dan kirim kalimat di atas PERSIS SAMA`,
      '',
      theme.footer,
    ].join('\n'));
  },
};
