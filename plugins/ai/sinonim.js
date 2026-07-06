const { ask } = require("../../lib/gemini");
module.exports = {
  command: ["sinonim","antonim","padankata"], category: "ai",
  description: "Cari sinonim & antonim kata (via AI)",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .sinonim <kata>" }, { quoted: m });
    const kata = args.join(" ");
    try {
      const ans = await ask(`Berikan sinonim (kata berpadanan) dan antonim (kata berlawanan) untuk kata "${kata}" dalam Bahasa Indonesia. Format:\n- Sinonim: [daftar]\n- Antonim: [daftar]\n- Contoh kalimat: [1-2 contoh]`);
      await sock.sendMessage(m.chat, { text: `📚 *Sinonim & Antonim: "${kata}"*\n\n${ans}` }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ " + e.message }, { quoted: m }); }
  },
};
