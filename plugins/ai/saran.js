const { ask } = require("../../lib/gemini");
module.exports = {
  command: ["saran","advice","curhat","konsultasi"], category: "ai",
  description: "Curhat dan minta saran dari AI",
  cooldown: 3000,
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .curhat <ceritamu>" }, { quoted: m });
    const curhat = args.join(" ");
    await sock.sendMessage(m.chat, { text: "💬 _Memikirkan saran..._" }, { quoted: m }).catch(() => {});
    try {
      const ans = await ask(`Seseorang curhat kepadamu: "${curhat}"\n\nBerikan respons yang empati, hangat, dan saran yang practical. Gaya seperti teman dekat yang bijak. Bahasa Indonesia santai.`);
      await sock.sendMessage(m.chat, { text: `💙 *Saran AI:*\n\n${ans}` }, { quoted: m });
    } catch (e) { await sock.sendMessage(m.chat, { text: `❌ ${e.message}` }, { quoted: m }); }
  },
};
