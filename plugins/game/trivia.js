/*
  ===========================================================
  [ WATERMARK & LICENSE NOTICE ]
  ===========================================================
  🤖 BOT NAME : MINOBOT
  👤 DEVELOPER: KEVIN (KevSoft-ID)
  🌐 GITHUB   : https://github.com/kevsoft-id
  ===========================================================

  ⚠️ KETENTUAN PENGGUNAAN (TERMS OF SERVICE):

  1. [DILARANG] Menghapus atau mengubah kredit & lisensi asli.
  2. [DILARANG] Menghapus watermark developer ini.
  3. [DILARANG] Memperjualbelikan (komersialkan) script bot ini.

  🔄 [DIPERBOLEHKAN] Mengubah nama bot (Rename) sesuai keinginan,
     dengan catatan poin 1, 2, dan 3 di atas tetap ditaati.

  ===========================================================
  🚨 PERINGATAN KERAS & KONSEKUENSI
  ===========================================================
  Script ini dilindungi oleh hak cipta digital dan lisensi open-source.
  Jika Anda kedapatan menghapus kredit, watermark, atau memperjualbelikannya:

  * Takedown Massal (DMCA): Repository GitHub Anda akan dilaporkan
    dan di-takedown paksa oleh GitHub atas pelanggaran hak cipta.
  * Blacklist & Banned: Akun dan nomor WhatsApp Anda akan dimasukkan
    ke dalam daftar hitam (blacklist) global sistem bot kami.
  * Sanksi Sosial & Hukum: Identitas pelanggar akan dipublikasikan
    di komunitas sebagai pencuri karya (plagiator).

  Created by Kevin © 2026. All rights reserved.
  🌐 https://github.com/kevsoft-id/minobot
  ===========================================================
*/

const axios = require("axios");
const active = new Map();
module.exports = {
  command: ["trivia"], category: "game",
  description: "Main trivia dari API (Bahasa Inggris)",
  async run({ sock, m }) {
    if (active.has(m.chat)) return sock.sendMessage(m.chat, { text: "❗ Trivia aktif! Jawab dulu!" }, { quoted: m });
    try {
      const r = await axios.get("https://opentdb.com/api.php?amount=1&type=multiple", { timeout: 10000 });
      const q = r.data?.results?.[0];
      if (!q) throw new Error("API tidak tersedia");
      const answers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
      const ci = answers.indexOf(q.correct_answer);
      const labels = ["A","B","C","D"];
      active.set(m.chat, { answer: labels[ci], correct: q.correct_answer });
      let text = `╭──「 *🎯 TRIVIA* 」\n│● Kategori: ${q.category}\n│● Tingkat : ${q.difficulty}\n│\n│ ${q.question.replace(/&amp;/g,"&").replace(/&#039;/g,"'")}\n│\n`;
      answers.forEach((a, i) => text += `│  ${labels[i]}. ${a.replace(/&amp;/g,"&")}\n`);
      text += "│\n│● Ketik: A / B / C / D\n╰───────────♢";
      const t = setTimeout(() => { const g = active.get(m.chat); if (g) { active.delete(m.chat); sock.sendMessage(m.chat, { text: `⏰ Waktu habis!\n│● Jawaban: *${g.answer}. ${g.correct}*` }).catch(() => {}); } }, 30000);
      active.get(m.chat)._t = t;
      await sock.sendMessage(m.chat, { text }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ " + e.message }, { quoted: m }); }
  },
  onMessage: async ({ sock, m, body }) => {
    if (!active.has(m.chat)) return;
    const g = active.get(m.chat);
    const ans = body.trim().toUpperCase();
    if (!["A","B","C","D"].includes(ans)) return;
    if (ans === g.answer) {
      clearTimeout(g._t); active.delete(m.chat);
      await sock.sendMessage(m.chat, { text: `🎉 *BENAR!* @${m.sender.replace(/@.+/,"")}\n│● Jawaban: *${g.answer}. ${g.correct}*`, mentions: [m.sender] }).catch(() => {});
    } else {
      await sock.sendMessage(m.chat, { text: `❌ Salah! Coba lagi.` }).catch(() => {});
    }
  },
};
