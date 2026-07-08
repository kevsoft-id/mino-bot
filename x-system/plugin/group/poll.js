'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../settings');
const { replyList } = require('../../../lib/utils');
const crypto   = require('crypto');

if (!global.pollData) global.pollData = new Map();

module.exports = {
  commands:    ['poll', 'polling', 'vote'],
  category:    'Group',
  description: 'Buat polling interaktif di grup 📊',
  usage:       '.poll <pertanyaan> | <opt1> | <opt2> | <opt3>',
  groupOnly:   true,

  async handler(sock, m, { command, args, text, sender, jid, reply }) {
    const { theme, prefix } = settings;

    // .vote <pollId> <optIdx> — submit vote
    if (command === 'vote' && args[0] && args[1]) {
      const pollId = args[0].toUpperCase();
      const optIdx = parseInt(args[1]) - 1;
      const poll   = global.pollData.get(`${jid}_${pollId}`);
      if (!poll) return reply(`❌ Polling *${pollId}* tidak ditemukan atau sudah berakhir.`);
      if (optIdx < 0 || optIdx >= poll.options.length) {
        return reply(`❌ Pilihan tidak valid. Ketik angka 1 – ${poll.options.length}.`);
      }
      // Remove previous vote
      poll.votes.delete(sender);
      poll.votes.set(sender, optIdx);

      const results = poll.options.map((opt, i) => {
        const count  = [...poll.votes.values()].filter(v => v === i).length;
        const total  = poll.votes.size;
        const pct    = total > 0 ? Math.round((count / total) * 100) : 0;
        const bar    = '█'.repeat(Math.round(pct / 10)) + '░'.repeat(10 - Math.round(pct / 10));
        return `  ${i + 1}. ${opt.slice(0, 40).padEnd(40)} ${bar} ${pct}% (${count})`;
      });

      return reply([
        theme.header, '',
        ` ⬡  📊  ${theme.bold('LIVE RESULT — ' + pollId)}`, '',
        `  ❓ ${poll.question}`, '',
        ...results,
        '',
        `  Total suara: ${poll.votes.size}`,
        `  Votemu: Opsi ${optIdx + 1} ✅`,
        '', theme.footer,
      ].join('\n'));
    }

    // .poll hasil <id> — see results
    if (args[0] === 'hasil' && args[1]) {
      const pollId = args[1].toUpperCase();
      const poll   = global.pollData.get(`${jid}_${pollId}`);
      if (!poll) return reply(`❌ Polling *${pollId}* tidak ditemukan.`);
      const results = poll.options.map((opt, i) => {
        const count = [...poll.votes.values()].filter(v => v === i).length;
        const pct   = poll.votes.size > 0 ? Math.round((count / poll.votes.size) * 100) : 0;
        const bar   = '█'.repeat(Math.round(pct / 10)) + '░'.repeat(10 - Math.round(pct / 10));
        return `  ${i + 1}. ${opt.slice(0, 35)} ${bar} ${pct}%`;
      });
      return reply([theme.header, '', ` ⬡  📊  ${theme.bold('HASIL POLLING — ' + pollId)}`, '',
        `  ❓ ${poll.question}`, '', ...results, '',
        `  Total suara: ${poll.votes.size}`, '', theme.footer].join('\n'));
    }

    // .poll <question> | <opt1> | <opt2>...
    if (!text.includes('|')) {
      return reply([
        `📊 *Format Poll:*`,
        `.poll <pertanyaan> | <opsi1> | <opsi2> | <opsi3>`,
        ``,
        `Contoh:`,
        `.poll Anime terbaik? | One Piece | Naruto | AOT`,
        ``,
        settings.footer,
      ].join('\n'));
    }

    const parts    = text.split('|').map(s => s.trim()).filter(Boolean);
    const question = parts[0];
    const options  = parts.slice(1, 6); // max 5 options
    if (options.length < 2) return reply('❌ Minimal 2 opsi pilihan ya.');

    const pollId = crypto.randomBytes(2).toString('hex').toUpperCase();
    global.pollData.set(`${jid}_${pollId}`, { question, options, votes: new Map(), jid });

    const rows = options.map((opt, i) => ({
      id:          `${prefix}vote ${pollId} ${i + 1}`,
      title:       `${i + 1}. ${opt.slice(0, 70)}`,
      description: `Tap untuk pilih opsi ini`,
    }));
    rows.push({
      id:          `${prefix}poll hasil ${pollId}`,
      title:       `📊 Lihat Hasil`,
      description: `Tampilkan hasil voting saat ini`,
    });

    const bodyText = [
      theme.header, '',
      ` ⬡  📊  ${theme.bold('POLLING AKTIF — #' + pollId)}`, '',
      `  ❓ ${question}`, '',
      ...options.map((o, i) => `  ${i + 1}. ${o}`),
      '',
      `  🗳️  Tap tombol di bawah untuk vote!`,
      `  💡  .vote ${pollId} <nomor>  untuk vote manual`,
      '', theme.footer,
    ].join('\n');

    return replyList(
      sock, m,
      theme.bold('POLLING — #' + pollId),
      bodyText,
      '🗳️  Vote Sekarang',
      [{ title: '📋 PILIHAN VOTING', rows }],
      settings.footer,
      settings.images.thumb,
    );
  },
};
