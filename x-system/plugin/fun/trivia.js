'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../set/settings');
const axios    = require('axios');
const { replyList } = require('../../../lib/utils');

if (!global.triviaState) global.triviaState = new Map();

function decode(str) {
  try { return decodeURIComponent(str); } catch { return str; }
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LETTERS = ['A', 'B', 'C', 'D'];

module.exports = {
  commands:    ['trivia', 'kuis', 'quiz'],
  category:    'Fun',
  description: 'Kuis trivia interaktif — pilih jawaban dari daftar 🧠',
  usage:       '.trivia  |  .trivia a/b/c/d  |  .trivia skip',

  async handler(sock, m, { args, jid, sender, reply }) {
    const { theme, prefix } = settings;
    const state = global.triviaState;
    const arg   = args[0]?.toLowerCase();

    // .trivia skip
    if (arg === 'skip') {
      const q = state.get(jid);
      if (!q) return reply('❓ Tidak ada trivia aktif. Ketik .trivia untuk mulai!');
      state.delete(jid);
      return reply(`⏭️ Dilewati!\n\n✅ Jawaban yang benar: *${q.correct}*`);
    }

    // .trivia a/b/c/d — check answer
    if (arg && LETTERS.includes(arg.toUpperCase())) {
      const q = state.get(jid);
      if (!q) return reply('❓ Tidak ada trivia aktif. Ketik .trivia untuk mulai!');
      const chosen = arg.toUpperCase();
      const chosenAns = q.options[LETTERS.indexOf(chosen)];
      const isRight = chosenAns === q.correct;
      state.delete(jid);

      return reply([
        theme.header, '',
        ` ⬡  🧠  ${theme.bold(isRight ? 'BENAR! 🎉' : 'SALAH! 💀')}`, '',
        `  📌 ${q.question}`,
        '',
        `  Jawabanmu : ${chosen}. ${chosenAns}`,
        `  Jawaban ✅ : ${q.correct}`,
        '',
        isRight ? `  🏅 +10 poin (sistem poin segera hadir)` : `  💡 Ketik .trivia untuk soal baru`,
        '', theme.footer,
      ].join('\n'));
    }

    // .trivia — fetch new question
    try {
      const res = await axios.get(
        'https://opentdb.com/api.php?amount=1&type=multiple&encode=url3986',
        { timeout: 8000 }
      );
      const item     = res.data.results[0];
      const question = decode(item.question);
      const correct  = decode(item.correct_answer);
      const wrong    = item.incorrect_answers.map(decode);
      const options  = shuffle([correct, ...wrong]);

      state.set(jid, { question, correct, options });

      const sections = [{
        title: '🔤 PILIH JAWABAN',
        rows: options.map((opt, i) => ({
          id:          `${prefix}trivia ${LETTERS[i].toLowerCase()}`,
          title:       `${LETTERS[i]}.  ${opt.slice(0, 70)}`,
          description: 'Tap untuk menjawab',
        })),
      }];
      sections[0].rows.push({
        id:          `${prefix}trivia skip`,
        title:       '⏭️  Skip soal ini',
        description: 'Lewati & lihat jawabannya',
      });

      return replyList(
        sock, m,
        theme.bold('TRIVIA QUIZ'),
        [
          theme.header, '',
          ` ⬡  🧠  ${theme.bold('TRIVIA QUIZ')}`, '',
          `  📂 Kategori : ${decode(item.category)}`,
          `  📊 Level    : ${decode(item.difficulty).toUpperCase()}`,
          '',
          `  ❓ ${question}`,
          '', theme.footer,
        ].join('\n'),
        '🔤  Pilih Jawaban',
        sections,
        settings.footer,
        settings.images.thumb,
      );
    } catch {
      return reply('❌ Gagal mengambil soal. Coba lagi ya~');
    }
  },
};
