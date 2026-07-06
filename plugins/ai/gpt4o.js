const { ask } = require("../../lib/gemini");
module.exports = {
  command: ["gpt4","gemini2","flash"], category: "ai",
  description: "Chat AI dengan Gemini Flash (cepat, no context)",
  cooldown: 2000,
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .flash <pertanyaan>" }, { quoted: m });
    const q = args.join(" ");
    try {
      const ans = await ask(q);
      await sock.sendMessage(m.chat, { text: `⚡ *Gemini Flash:*\n\n${ans}` }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ " + e.message }, { quoted: m }); }
  },
};
