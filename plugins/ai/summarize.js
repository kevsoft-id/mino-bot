const { ask } = require("../../lib/gemini");
module.exports = {
  command: ["summarize","ringkas","tldr"], category: "ai",
  description: "Ringkas teks panjang dengan AI",
  cooldown: 3000,
  async run({ sock, m, args }) {
    let text = args.join(" ");
    if (!text && m.quoted?.message?.conversation) text = m.quoted.message.conversation;
    if (!text && m.quoted?.message?.extendedTextMessage?.text) text = m.quoted.message.extendedTextMessage.text;
    if (!text) return sock.sendMessage(m.chat, { text: "❌ .ringkas <teks> atau reply pesan yang ingin diringkas" }, { quoted: m });
    await sock.sendMessage(m.chat, { text: "📝 _Meringkas..._" }, { quoted: m }).catch(() => {});
    try {
      const ans = await ask(`Ringkas teks berikut dalam poin-poin penting, gunakan Bahasa Indonesia yang mudah dipahami:\n\n${text}`);
      await sock.sendMessage(m.chat, { text: `📋 *Ringkasan:*\n\n${ans}` }, { quoted: m });
    } catch (e) { await sock.sendMessage(m.chat, { text: `❌ ${e.message}` }, { quoted: m }); }
  },
};
