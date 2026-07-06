const axios = require("axios");
const { ask } = require("../../lib/gemini");
module.exports = {
  command: ["imagine","gambar","aiimg"], category: "ai",
  description: "Buat gambar AI dari deskripsi",
  cooldown: 5000,
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .imagine <deskripsi>\nContoh: .imagine kucing lucu bermain bola" }, { quoted: m });
    const prompt = args.join(" ");
    await sock.sendMessage(m.chat, { text: "🎨 _Membuat gambar..._" }, { quoted: m }).catch(() => {});
    const apis = [
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true`,
      `https://api.ideogram.ai/generate?prompt=${encodeURIComponent(prompt)}`,
    ];
    for (const url of apis) {
      try {
        const res = await axios.get(url, { responseType: "arraybuffer", timeout: 40000 });
        const buf = Buffer.from(res.data);
        if (buf.length > 5000) {
          await sock.sendMessage(m.chat, { image: buf, caption: `🎨 *AI Image:* ${prompt}` }, { quoted: m });
          return;
        }
      } catch {}
    }
    await sock.sendMessage(m.chat, { text: "❌ Gagal generate gambar. Coba lagi." }, { quoted: m });
  },
};
