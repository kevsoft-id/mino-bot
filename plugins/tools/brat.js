const axios = require("axios");
module.exports = {
  command: ["brat","brattext"], category: "tools", description: "Buat teks gaya BRAT",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .brat <teks>" }, { quoted: m });
    const text = args.join(" ");
    try {
      const res = await axios.get(`https://api.siputzx.my.id/api/maker/brat?text=${encodeURIComponent(text)}`, { responseType:"arraybuffer", timeout:15000 });
      const buf = Buffer.from(res.data);
      if (buf.length > 3000) { await sock.sendMessage(m.chat, { image: buf, caption: `🎨 ${text}` }, { quoted: m }); return; }
    } catch {}
    // Fallback: plain brat-style text
    await sock.sendMessage(m.chat, { text: `_${text.toLowerCase()}_` }, { quoted: m });
  },
};
