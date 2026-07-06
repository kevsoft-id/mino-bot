const axios = require("axios");
module.exports = {
  command: ["meme","memes"], category: "fun",
  description: "Kirim meme random",
  async run({ sock, m, args }) {
    const q = args.join(" ") || "funny";
    const apis = [
      `https://api.siputzx.my.id/api/s/meme`,
      `https://meme-api.com/gimme`,
    ];
    for (const url of apis) {
      try {
        const r = await axios.get(url, { timeout: 10000 });
        const imgUrl = r.data?.data?.image || r.data?.url;
        if (imgUrl) {
          await sock.sendMessage(m.chat, { image: { url: imgUrl }, caption: `😂 Meme Random` }, { quoted: m });
          return;
        }
      } catch {}
    }
    await sock.sendMessage(m.chat, { text: "❌ Meme tidak tersedia saat ini" }, { quoted: m });
  },
};
