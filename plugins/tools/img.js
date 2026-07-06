const axios = require("axios");
module.exports = {
  command: ["img","cariimg","gambar2"], category: "tools",
  description: "Cari gambar di internet",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .img <kata kunci>" }, { quoted: m });
    const q = args.join(" ");
    const apis = [
      `https://api.siputzx.my.id/api/s/images?q=${encodeURIComponent(q)}`,
      `https://api.ryzendesu.vip/api/search/image?query=${encodeURIComponent(q)}`,
    ];
    for (const url of apis) {
      try {
        const r = await axios.get(url, { timeout: 10000 });
        const items = r.data?.data || r.data?.result || [];
        if (!items.length) continue;
        const img = items[Math.floor(Math.random() * Math.min(5, items.length))];
        const imgUrl = img.url || img.link || img;
        if (typeof imgUrl === "string" && imgUrl.startsWith("http")) {
          await sock.sendMessage(m.chat, { image: { url: imgUrl }, caption: `🖼️ Hasil pencarian: ${q}` }, { quoted: m });
          return;
        }
      } catch {}
    }
    await sock.sendMessage(m.chat, { text: "❌ Gambar tidak ditemukan" }, { quoted: m });
  },
};
