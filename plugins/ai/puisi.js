const { ask } = require("../../lib/gemini");
module.exports = {
  command: ["puisi","poem","pantun"], category: "ai",
  description: "Buat puisi/pantun dengan AI",
  cooldown: 3000,
  async run({ sock, m, args }) {
    const tema = args.join(" ") || "kehidupan";
    const jenis = args[0]?.toLowerCase() === "pantun" ? "pantun 4 baris" : "puisi bebas";
    try {
      const ans = await ask(`Buat ${jenis} yang indah tentang "${tema}". Gunakan Bahasa Indonesia yang puitis dan bermakna.`);
      await sock.sendMessage(m.chat, { text: `🌹 *${jenis.charAt(0).toUpperCase()+jenis.slice(1)}:*\n\n${ans}` }, { quoted: m });
    } catch (e) { await sock.sendMessage(m.chat, { text: `❌ ${e.message}` }, { quoted: m }); }
  },
};
