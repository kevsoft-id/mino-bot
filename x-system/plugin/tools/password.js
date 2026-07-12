'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../set/settings');
const crypto   = require('crypto');

const SETS = {
  upper:   'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower:   'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?',
};

function genPassword(length, sets) {
  const pool = sets.map(k => SETS[k]).join('');
  const bytes = crypto.randomBytes(length);
  return Array.from(bytes).map(b => pool[b % pool.length]).join('');
}

module.exports = {
  commands:    ['password', 'passgen', 'pw'],
  category:    'Tools',
  description: 'Generate password acak yang kuat dan aman 🔑',
  usage:       '.password [panjang] [--symbols] [--numbers-only]',

  async handler(sock, m, { args, reply }) {
    const { theme } = settings;
    const lengthArg = parseInt(args.find(a => !a.startsWith('--'))) || 16;
    const length    = Math.min(Math.max(lengthArg, 4), 128);
    const noSymbols = args.includes('--no-symbols');
    const numbOnly  = args.includes('--numbers-only');

    let sets, label;
    if (numbOnly) { sets = ['numbers']; label = 'Angka saja'; }
    else if (noSymbols) { sets = ['upper', 'lower', 'numbers']; label = 'Alphanumeric'; }
    else { sets = ['upper', 'lower', 'numbers', 'symbols']; label = 'Semua karakter'; }

    const passwords = Array.from({ length: 5 }, () => genPassword(length, sets));

    return reply([
      theme.header, '',
      ` ⬡  🔑  ${theme.bold('PASSWORD GENERATOR')}`, '',
      `  ⚙️  Panjang  : ${length} karakter`,
      `  📦 Tipe     : ${label}`,
      '', theme.div, '',
      ...passwords.map((p, i) => `  ${i + 1}. \`${p}\``),
      '',
      `  💡 Opsi: .password 20 --no-symbols`,
      `  💡       .password 8 --numbers-only`,
      '', theme.footer,
    ].join('\n'));
  },
};
