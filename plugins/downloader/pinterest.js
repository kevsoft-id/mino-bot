const axios = require("axios");
module.exports = {
  command: ["pinterest","pin","pintdl"], category: "downloader", description: "Download gambar Pinterest",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .pinterest <link Pinterest>" }, { quoted: m });
    await sock.sendMessage(m.chat, { text: "⏳ Mendownload Pinterest..." }, { quoted: m }).catch(() => {});
    try {
      const r = await axios.get(`https://api.siputzx.my.id/api/d/pinterest?url=${encodeURIComponent(args[0])}`, { timeout:20000 });
      const url = r.data?.data?.media || r.data?.data?.url;
      if (!url) throw new Error("URL tidak ditemukan");
      const isVid = url.includes(".mp4");
      if (isVid) await sock.sendMessage(m.chat, { video:{ url }, caption:"📌 Pinterest", mimetype:"video/mp4" }, { quoted: m });
      else await sock.sendMessage(m.chat, { image:{ url }, caption:"📌 Pinterest" }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
