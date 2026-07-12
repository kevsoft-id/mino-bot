'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../set/settings');

module.exports = {
  commands:    ['countword', 'wordcount', 'hitungkata', 'charcount', 'hitungkarakter'],
  category:    'Tools',
  description: 'Hitung kata, karakter, baris, dan kalimat dari teks',
  usage:       '.countword {teks}  |  reply pesan + .countword',

  async handler(sock, m, { text, reply, react }) {
    const { theme } = settings;

    let txt = text?.trim();

    // Try quoted message
    if (!txt) {
      txt = m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation ||
            m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text;
    }

    if (!txt) {
      return reply([
        theme.header, '',
        ` ⬡  📊  ${theme.bold('WORD COUNTER')}`, '',
        `    ${theme.bullet} Masukkan teks setelah perintah`,
        `    ${theme.bullet} Atau reply pesan yang mau dihitung`,
        `    ${theme.bullet} Contoh: .countword Halo dunia ini adalah teks contoh`,
        '',
        theme.footer,
      ].join('\n'));
    }

    await react('📊');

    const words      = txt.trim().split(/\s+/).filter(Boolean).length;
    const chars      = txt.length;
    const charsNoSp  = txt.replace(/\s/g, '').length;
    const lines      = txt.split(/\n/).length;
    const sentences  = txt.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = txt.split(/\n\n+/).filter(p => p.trim()).length;
    const avgWordLen = words > 0 ? (charsNoSp / words).toFixed(1) : '0';
    const readTime   = Math.max(1, Math.ceil(words / 200)); // ~200 WPM

    // Most common words
    const wordFreq = {};
    txt.toLowerCase().match(/\b\w{3,}\b/g)?.forEach(w => wordFreq[w] = (wordFreq[w] || 0) + 1);
    const topWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([w, c]) => `${w}(${c})`)
      .join(', ');

    await reply([
      theme.header, '',
      ` ⬡  📊  ${theme.bold('WORD COUNT')}`, '',
      `    ${theme.bullet} *Kata*          : ${words.toLocaleString()}`,
      `    ${theme.bullet} *Karakter*      : ${chars.toLocaleString()}`,
      `    ${theme.bullet} *Tanpa spasi*   : ${charsNoSp.toLocaleString()}`,
      `    ${theme.bullet} *Kalimat*       : ${sentences}`,
      `    ${theme.bullet} *Baris*         : ${lines}`,
      `    ${theme.bullet} *Paragraf*      : ${paragraphs}`,
      `    ${theme.bullet} *Rata pjg kata* : ${avgWordLen} char`,
      `    ${theme.bullet} *Est. baca*     : ${readTime} menit`,
      `    ${theme.bullet} *Kata sering*   : ${topWords || '-'}`,
      '',
      theme.footer,
    ].join('\n'));
  },
};
