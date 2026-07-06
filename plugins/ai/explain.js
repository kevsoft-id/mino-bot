const { ask } = require("../../lib/gemini");
module.exports = {
  command: ["explain","jelaskan","definisi"], category: "ai",
  description: "Jelaskan suatu topik dengan AI",
  cooldown: 3000,
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .jelaskan <topik>\nContoh: .jelaskan apa itu machine learning" }, { quoted: m });
    const topic = args.join(" ");
    await sock.sendMessage(m.chat, { text: "📚 _Menjelaskan..._" }, { quoted: m }).catch(() => {});
    try {
      const ans = await ask(`Jelaskan "${topic}" dengan bahasa yang mudah dipahami orang awam. Sertakan contoh praktis. Bahasa Indonesia.`);
      await sock.sendMessage(m.chat, { text: `📚 *Penjelasan:*\n\n${ans}` }, { quoted: m });
    } catch (e) { await sock.sendMessage(m.chat, { text: `❌ ${e.message}` }, { quoted: m }); }
  },
};
