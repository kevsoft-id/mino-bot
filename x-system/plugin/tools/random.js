'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../set/settings');
const { replyList } = require('../../../lib/utils');

module.exports = {
  commands:    ['random', 'rand', 'acak'],
  category:    'Tools',
  description: 'Generator angka/pilihan/nama acak 🎲',
  usage:       '.random  |  .random 1-100  |  .random pick A | B | C  |  .random nama',

  async handler(sock, m, { args, text, prefix, reply }) {
    const { theme } = settings;

    // .random pick A | B | C
    if (args[0] === 'pick' && text.includes('|')) {
      const choices = text.replace(/^pick\s*/i, '').split('|').map(s => s.trim()).filter(Boolean);
      if (choices.length < 2) return reply('❓ Minimal 2 pilihan. Contoh: .random pick A | B | C');
      const chosen = choices[Math.floor(Math.random() * choices.length)];
      return reply([
        theme.header, '',
        ` ⬡  🎲  ${theme.bold('RANDOM PICK')}`, '',
        `  📋 Pilihan : ${choices.join(' | ')}`,
        `  🎯 Terpilih: ${theme.bold(chosen)}`,
        '', theme.footer,
      ].join('\n'));
    }

    // .random nama — random Indonesian name
    if (args[0] === 'nama' || args[0] === 'name') {
      const namaDepan = ['Andi','Budi','Citra','Dewi','Eko','Fitri','Galih','Hana','Ivan','Joko','Kirana','Lina','Maya','Niko','Okta','Putri','Raka','Sari','Tara','Umar'];
      const namaBelakang = ['Pratama','Santoso','Wijaya','Kusuma','Rahayu','Saputra','Purnama','Hidayat','Nugroho','Susanto','Wibowo','Setiawan','Hartono','Gunawan','Supriadi'];
      const nama = namaDepan[Math.floor(Math.random() * namaDepan.length)] + ' ' +
                   namaBelakang[Math.floor(Math.random() * namaBelakang.length)];
      return reply([
        theme.header, '',
        ` ⬡  🎲  ${theme.bold('RANDOM NAMA')}`, '',
        `  👤 ${theme.bold(nama)}`,
        '', theme.footer,
      ].join('\n'));
    }

    // .random 1-100 or .random 100
    const rangeMatch = (args[0] || '').match(/^(\d+)[-–](\d+)$/);
    let min = 1, max = 100;
    if (rangeMatch) {
      min = parseInt(rangeMatch[1]);
      max = parseInt(rangeMatch[2]);
    } else if (args[0] && /^\d+$/.test(args[0])) {
      max = parseInt(args[0]);
    }
    if (min > max) [min, max] = [max, min];

    // Generate 5 random numbers
    const nums = Array.from({ length: 5 }, () => min + Math.floor(Math.random() * (max - min + 1)));

    // No args → show menu
    if (!args[0]) {
      const sections = [{
        title: '🎲 PILIH MODE',
        rows: [
          { id: `${prefix}random 1-100`,   title: '🔢 Angka Acak 1–100',   description: 'Generate angka antara 1 dan 100' },
          { id: `${prefix}random pick A | B | C`, title: '🎯 Pilih Acak', description: 'Pilih satu dari beberapa opsi' },
          { id: `${prefix}random nama`,    title: '👤 Nama Acak',          description: 'Generate nama Indonesia acak' },
          { id: `${prefix}random 1-6`,     title: '🎲 Dadu (1-6)',          description: 'Roll dadu' },
          { id: `${prefix}random 1-52`,    title: '🃏 Kartu (1-52)',        description: 'Pilih kartu acak' },
        ],
      }];
      return replyList(sock, m, theme.bold('RANDOM GENERATOR'),
        `${theme.header}\n\n ⬡  🎲  ${theme.bold('RANDOM GENERATOR')}\n\nPilih mode random yang kamu inginkan!\n\n${theme.footer}`,
        '🎲 Pilih Mode', sections, settings.footer, settings.images.thumb);
    }

    return reply([
      theme.header, '',
      ` ⬡  🎲  ${theme.bold('RANDOM NUMBER')}`,
      `  Range: ${min} – ${max}`, '',
      ...nums.map((n, i) => `  ${i + 1}. ${theme.bold(String(n))}`),
      '', theme.footer,
    ].join('\n'));
  },
};
