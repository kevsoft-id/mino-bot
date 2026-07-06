const { ask } = require("../../lib/gemini");
module.exports = {
  command: ["resep","masak","recipe"], category: "ai",
  description: "Minta resep masakan dari AI",
  cooldown: 3000,
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .resep <nama masakan>\nContoh: .resep nasi goreng ayam" }, { quoted: m });
    const masakan = args.join(" ");
    await sock.sendMessage(m.chat, { text: "👨‍🍳 _Menyiapkan resep..._" }, { quoted: m }).catch(() => {});
    try {
      const ans = await ask(`Berikan resep lengkap untuk ${masakan} dengan format:\n- Bahan-bahan\n- Langkah memasak\n- Tips\n\nBahasa Indonesia yang jelas.`);
      await sock.sendMessage(m.chat, { text: `👨‍🍳 *Resep ${masakan}:*\n\n${ans}` }, { quoted: m });
    } catch (e) { await sock.sendMessage(m.chat, { text: `❌ ${e.message}` }, { quoted: m }); }
  },
};
