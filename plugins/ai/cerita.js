const { ask } = require("../../lib/gemini");
module.exports = {
  command: ["cerita","story","dongeng"], category: "ai",
  description: "Buat cerita/dongeng dengan AI",
  cooldown: 4000,
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .cerita <tema/karakter>\nContoh: .cerita naga baik hati yang suka memasak" }, { quoted: m });
    const tema = args.join(" ");
    await sock.sendMessage(m.chat, { text: "📖 _Menulis cerita..._" }, { quoted: m }).catch(() => {});
    try {
      const ans = await ask(`Tulis cerita pendek yang menarik (sekitar 300 kata) tentang: ${tema}\n\nGunakan Bahasa Indonesia yang mengalir dan menarik.`);
      await sock.sendMessage(m.chat, { text: `📖 *Cerita:*\n\n${ans}` }, { quoted: m });
    } catch (e) { await sock.sendMessage(m.chat, { text: `❌ ${e.message}` }, { quoted: m }); }
  },
};
