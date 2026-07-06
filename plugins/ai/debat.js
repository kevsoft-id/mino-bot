const { ask } = require("../../lib/gemini");
module.exports = {
  command: ["debat","vs","compare"], category: "ai",
  description: "AI bandingkan/debat dua hal",
  cooldown: 3000,
  async run({ sock, m, args }) {
    if (args.length < 3) return sock.sendMessage(m.chat, { text: "❌ .debat <A> vs <B>\nContoh: .debat Android vs iOS" }, { quoted: m });
    const text = args.join(" ");
    const [a, b] = text.split(/\s+vs\s+/i);
    if (!a || !b) return sock.sendMessage(m.chat, { text: "❌ Format: .debat A vs B" }, { quoted: m });
    await sock.sendMessage(m.chat, { text: "⚔️ _Membandingkan..._" }, { quoted: m }).catch(() => {});
    try {
      const ans = await ask(`Bandingkan "${a.trim()}" vs "${b.trim()}" secara objektif. Jelaskan kelebihan dan kekurangan masing-masing. Kesimpulan di akhir. Bahasa Indonesia.`);
      await sock.sendMessage(m.chat, { text: `⚔️ *${a.trim()} vs ${b.trim()}*\n\n${ans}` }, { quoted: m });
    } catch (e) { await sock.sendMessage(m.chat, { text: `❌ ${e.message}` }, { quoted: m }); }
  },
};
