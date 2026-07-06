const { ask } = require("../../lib/gemini");
module.exports = {
  command: ["code","kode","buatkode","coding"], category: "ai",
  description: "Generate kode program dengan AI",
  cooldown: 3000,
  async run({ sock, m, args }) {
    if (args.length < 2) return sock.sendMessage(m.chat, { text: "❌ .code <bahasa> <deskripsi>\nContoh: .code python fungsi sorting bubble sort" }, { quoted: m });
    const lang = args[0]; const desc = args.slice(1).join(" ");
    await sock.sendMessage(m.chat, { text: "💻 _Membuat kode..._" }, { quoted: m }).catch(() => {});
    try {
      const ans = await ask(`Buat kode ${lang} untuk: ${desc}\n\nSertakan penjelasan singkat. Gunakan Bahasa Indonesia.`, null);
      await sock.sendMessage(m.chat, { text: `💻 *Kode ${lang.toUpperCase()}:*\n\n${ans}` }, { quoted: m });
    } catch (e) { await sock.sendMessage(m.chat, { text: `❌ ${e.message}` }, { quoted: m }); }
  },
};
