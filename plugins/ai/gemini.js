const { chat, clearSession } = require("../../lib/gemini");
const { downloadMedia } = require("../../lib/function");
module.exports = {
  command: ["ai","gpt","chat","tanya"], category: "ai",
  description: "Chat dengan AI Gemini (konteks percakapan)",
  cooldown: 3000,
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .ai <pertanyaan>\nContoh: .ai siapa kamu?" }, { quoted: m });
    const q = args.join(" ");
    await sock.sendMessage(m.chat, { text: "🤖 _Berpikir..._" }, { quoted: m }).catch(() => {});
    try {
      const ans = await chat(m.sender + m.chat, q);
      await sock.sendMessage(m.chat, { text: `🤖 *AI:*\n\n${ans}` }, { quoted: m });
    } catch (e) {
      await sock.sendMessage(m.chat, { text: `❌ AI Error: ${e.message}\n\nPastikan GEMINI_API_KEY sudah diset di .env` }, { quoted: m });
    }
  },
};
