'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../set/settings');
const store    = require('../../../lib/store');

function getNotes(sender) { return store.get('notes', sender) || []; }
function saveNotes(sender, notes) { store.set('notes', sender, notes); }

module.exports = {
  commands:    ['note', 'catatan', 'memo', 'notes'],
  category:    'Tools',
  description: 'Simpan catatan pribadi. Subperintah: add, list, del, clear',
  usage:       '.note add {teks}  |  .note list  |  .note del {no}  |  .note clear',

  async handler(sock, m, { args, text, sender, reply, react }) {
    const { theme } = settings;
    const sub  = args[0]?.toLowerCase();
    const body = args.slice(1).join(' ');

    if (!sub || sub === 'help') {
      return reply([
        theme.header, '',
        ` ⬡  📝  ${theme.bold('CATATAN PRIBADI')}`, '',
        `    ${theme.bullet} .note add {teks}    → tambah catatan`,
        `    ${theme.bullet} .note list          → lihat semua`,
        `    ${theme.bullet} .note del {nomor}   → hapus catatan`,
        `    ${theme.bullet} .note clear         → hapus semua`,
        '',
        theme.footer,
      ].join('\n'));
    }

    const notes = getNotes(sender);

    if (sub === 'add') {
      if (!body) return reply('❓ Masukkan isi catatan\nContoh: .note add Beli susu besok');
      notes.push({ text: body, time: new Date().toLocaleDateString('id-ID') });
      saveNotes(sender, notes);
      await react('✅');
      return reply(`✅ Catatan #${notes.length} disimpan!\n\n📝 "${body}"\n\nLihat: .note list`);
    }

    if (sub === 'list') {
      if (!notes.length) return reply('📝 Belum ada catatan.\n\nTambah: .note add {teks}');
      const list = notes.map((n, i) => `    ${i + 1}. ${n.text}\n       _${n.time}_`).join('\n\n');
      return reply([
        theme.header, '',
        ` ⬡  📝  ${theme.bold(`CATATANKU (${notes.length})`)}`, '',
        list,
        '',
        `    Hapus: .note del {nomor}`,
        '',
        theme.footer,
      ].join('\n'));
    }

    if (sub === 'del') {
      const idx = parseInt(body) - 1;
      if (isNaN(idx) || idx < 0 || idx >= notes.length) {
        return reply(`❌ Nomor catatan tidak valid (1–${notes.length})`);
      }
      const removed = notes.splice(idx, 1)[0];
      saveNotes(sender, notes);
      await react('🗑️');
      return reply(`🗑️ Catatan #${idx + 1} dihapus:\n"${removed.text}"`);
    }

    if (sub === 'clear') {
      if (!notes.length) return reply('📝 Tidak ada catatan untuk dihapus');
      saveNotes(sender, []);
      await react('🗑️');
      return reply(`🗑️ Semua catatan (${notes.length}) telah dihapus`);
    }

    return reply('❓ Subperintah tidak dikenal\n• add • list • del {no} • clear');
  },
};
