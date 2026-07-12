'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../set/settings');

const QUESTIONS = [
  'paling ganteng / cantik',
  'paling banyak ngomong',
  'paling pendiam',
  'paling rajin',
  'paling malas',
  'paling sering telat',
  'paling sering ghosting',
  'paling banyak drama',
  'paling humble',
  'paling receh',
  'paling bijak',
  'paling sering overthinking',
  'paling setia',
  'paling susah move on',
  'paling bisa dipercaya',
  'paling sering chat tengah malam',
  'paling kaya',
  'paling cepat tidur',
  'paling sering skip makan',
  'paling banyak nonton anime',
];

module.exports = {
  commands:    ['siapa', 'who'],
  category:    'Fun',
  description: 'Pilih random siapa yang paling… di grup',
  usage:       '.siapa  atau  .siapa <pertanyaan>',
  groupOnly:   true,

  async handler(sock, m, { text, groupMetadata, reply }) {
    const { theme } = settings;
    const members = groupMetadata.participants.filter(p => !p.admin);
    if (members.length === 0) return reply('😅 Tidak ada member non-admin di grup ini.');

    const winner   = members[Math.floor(Math.random() * members.length)];
    const question = text || QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    const number   = winner.id.split('@')[0];

    await sock.sendMessage(m.key.remoteJid, {
      text: [
        theme.header, '',
        ` ⬡  🎰  ${theme.bold('SIAPA YANG PALING…')}`, '',
        `  ❓ ${question}`,
        '',
        `  🎯 Jawabannya adalah...`,
        `  👉 @${number} 🎉`,
        '', theme.footer,
      ].join('\n'),
      mentions: [winner.id],
    }, { quoted: m });
  },
};
