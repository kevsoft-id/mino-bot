'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../set/settings');

const WORDS = [
  'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do',
  'eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim',
  'ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi','aliquip',
  'ex','ea','commodo','consequat','duis','aute','irure','in','reprehenderit','voluptate',
  'velit','esse','cillum','fugiat','nulla','pariatur','excepteur','sint','occaecat','cupidatat',
  'non','proident','sunt','culpa','qui','officia','deserunt','mollit','anim','est','laborum',
];

function sentence(wordCount = 8) {
  const arr = [];
  for (let i = 0; i < wordCount; i++) arr.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  arr[0] = arr[0][0].toUpperCase() + arr[0].slice(1);
  return arr.join(' ') + '.';
}

function paragraph(sentenceCount = 5) {
  return Array.from({ length: sentenceCount }, () => sentence(6 + Math.floor(Math.random() * 6))).join(' ');
}

module.exports = {
  commands:    ['lorem', 'loremipsum', 'placeholder'],
  category:    'Tools',
  description: 'Generate teks Lorem Ipsum placeholder 📝',
  usage:       '.lorem  |  .lorem 3  (jumlah paragraf)  |  .lorem words 50',

  async handler(sock, m, { args, reply }) {
    const { theme } = settings;
    const isWords = args[0] === 'words';
    const count   = Math.min(parseInt(args.find(a => /^\d+$/.test(a))) || 2, 10);

    let result;
    if (isWords) {
      const words = Array.from({ length: count }, () => WORDS[Math.floor(Math.random() * WORDS.length)]);
      result = words.join(' ');
    } else {
      result = Array.from({ length: count }, paragraph).join('\n\n');
    }

    return reply([
      theme.header, '',
      ` ⬡  📝  ${theme.bold('LOREM IPSUM')}`,
      `  ${isWords ? count + ' kata' : count + ' paragraf'}`, '',
      theme.div, '',
      result,
      '', theme.footer,
    ].join('\n'));
  },
};
