'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../set/settings');
const store    = require('../../../lib/store');

function getTodos(sender) { return store.get('todos', sender) || []; }
function saveTodos(sender, todos) { store.set('todos', sender, todos); }

module.exports = {
  commands:    ['todo', 'tugas', 'task', 'tasks'],
  category:    'Tools',
  description: 'Manajemen to-do list pribadi',
  usage:       '.todo add {tugas}  |  .todo list  |  .todo done {no}  |  .todo del {no}  |  .todo clear',

  async handler(sock, m, { args, sender, reply, react }) {
    const { theme } = settings;
    const sub  = args[0]?.toLowerCase();
    const body = args.slice(1).join(' ');

    if (!sub) {
      return reply([
        theme.header, '',
        ` ⬡  ✅  ${theme.bold('TO-DO LIST')}`, '',
        `    ${theme.bullet} .todo add {tugas}   → tambah tugas`,
        `    ${theme.bullet} .todo list          → lihat semua`,
        `    ${theme.bullet} .todo done {no}     → tandai selesai`,
        `    ${theme.bullet} .todo del {no}      → hapus tugas`,
        `    ${theme.bullet} .todo clear         → hapus semua`,
        '',
        theme.footer,
      ].join('\n'));
    }

    const todos = getTodos(sender);

    if (sub === 'add') {
      if (!body) return reply('❓ Masukkan nama tugas\nContoh: .todo add Kerjakan PR matematika');
      todos.push({ text: body, done: false, time: new Date().toLocaleDateString('id-ID') });
      saveTodos(sender, todos);
      await react('✅');
      return reply(`✅ Tugas #${todos.length} ditambahkan!\n\n📌 "${body}"\n\nLihat: .todo list`);
    }

    if (sub === 'list') {
      if (!todos.length) return reply('✅ To-do list kosong!\n\nTambah: .todo add {tugas}');
      const done   = todos.filter(t => t.done).length;
      const list   = todos.map((t, i) =>
        `    ${t.done ? '✅' : '⬜'} ${i + 1}. ${t.text}\n       _${t.time}_`
      ).join('\n\n');

      return reply([
        theme.header, '',
        ` ⬡  ✅  ${theme.bold(`TO-DO LIST (${done}/${todos.length} selesai)`)}`, '',
        list,
        '',
        `    .todo done {no} | .todo del {no}`,
        '',
        theme.footer,
      ].join('\n'));
    }

    if (sub === 'done') {
      const idx = parseInt(body) - 1;
      if (isNaN(idx) || idx < 0 || idx >= todos.length) {
        return reply(`❌ Nomor tidak valid (1–${todos.length})`);
      }
      todos[idx].done = !todos[idx].done;
      saveTodos(sender, todos);
      await react(todos[idx].done ? '✅' : '⬜');
      return reply(`${todos[idx].done ? '✅' : '⬜'} Tugas #${idx + 1}: ${todos[idx].done ? 'selesai' : 'belum selesai'}\n"${todos[idx].text}"`);
    }

    if (sub === 'del') {
      const idx = parseInt(body) - 1;
      if (isNaN(idx) || idx < 0 || idx >= todos.length) {
        return reply(`❌ Nomor tidak valid (1–${todos.length})`);
      }
      const removed = todos.splice(idx, 1)[0];
      saveTodos(sender, todos);
      await react('🗑️');
      return reply(`🗑️ Tugas #${idx + 1} dihapus: "${removed.text}"`);
    }

    if (sub === 'clear') {
      saveTodos(sender, []);
      await react('🗑️');
      return reply(`🗑️ Semua tugas (${todos.length}) dihapus`);
    }

    return reply('❓ Subperintah: add | list | done {no} | del {no} | clear');
  },
};
