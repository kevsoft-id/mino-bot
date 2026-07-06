const { ask } = require("../../lib/gemini");
module.exports = {
  command: ["essay","esai","tulis"], category: "ai",
  description: "Buat esai/artikel dengan AI",
  cooldown: 5000,
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .essay <topik>\nContoh: .essay dampak teknologi terhadap pendidikan" }, { quoted: m });
    const topic = args.join(" ");
    await sock.sendMessage(m.chat, { text: "✍️ _Menulis esai..._" }, { quoted: m }).catch(() => {});
    try {
      const ans = await ask(`Tulis esai pendek (400-500 kata) tentang: "${topic}"\n\nStruktur: Pendahuluan → Isi (2-3 paragraf) → Kesimpulan\n\nGunakan Bahasa Indonesia yang formal dan informatif.`);
      await sock.sendMessage(m.chat, { text: `✍️ *Esai: ${topic}*\n\n${ans}` }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ " + e.message }, { quoted: m }); }
  },
};
