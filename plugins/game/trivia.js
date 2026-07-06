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
