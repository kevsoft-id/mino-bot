const axios = require("axios");
const { ask } = require("../../lib/gemini");
module.exports = {
  command: ["kbbi","kamus","arti"], category: "ai",
  description: "Cari arti kata di KBBI (via AI)",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .kbbi <kata>" }, { quoted: m });
    const kata = args.join(" ");
    try {
      const ans = await ask(`Jelaskan arti kata "${kata}" dalam KBBI (Kamus Besar Bahasa Indonesia). Sertakan: definisi, contoh kalimat, dan sinonim jika ada. Format rapi.`);
      await sock.sendMessage(m.chat, { text: `📖 *KBBI — ${kata}*\n\n${ans}` }, { quoted: m });
    } catch (e) { await sock.sendMessage(m.chat, { text: `❌ ${e.message}` }, { quoted: m }); }
  },
};
