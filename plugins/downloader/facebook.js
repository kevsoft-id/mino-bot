const axios = require("axios");
module.exports = {
  command: ["fb","facebook","fbdl"], category: "downloader", description: "Download video Facebook",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .fb <link Facebook>" }, { quoted: m });
    await sock.sendMessage(m.chat, { text: "⏳ Mendownload Facebook..." }, { quoted: m }).catch(() => {});
    try {
      const r = await axios.get(`https://api.siputzx.my.id/api/d/fb?url=${encodeURIComponent(args[0])}`, { timeout:30000 });
      const d = r.data?.data;
      const vidUrl = d?.HD || d?.SD || d?.url;
      if (!vidUrl) throw new Error("URL tidak ditemukan");
      await sock.sendMessage(m.chat, { video:{ url:vidUrl }, caption:`📘 Facebook`, mimetype:"video/mp4" }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
