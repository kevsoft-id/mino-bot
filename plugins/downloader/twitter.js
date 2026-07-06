const axios = require("axios");
module.exports = {
  command: ["twitter","twdl","xdl"], category: "downloader", description: "Download video Twitter/X",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .twitter <link Twitter/X>" }, { quoted: m });
    await sock.sendMessage(m.chat, { text: "⏳ Mendownload Twitter/X..." }, { quoted: m }).catch(() => {});
    const apis = [
      `https://api.siputzx.my.id/api/d/twitter?url=${encodeURIComponent(args[0])}`,
      `https://api.ryzendesu.vip/api/downloader/twitter?url=${encodeURIComponent(args[0])}`,
    ];
    for (const url of apis) {
      try {
        const r = await axios.get(url, { timeout:30000 });
        const vidUrl = r.data?.data?.HD || r.data?.data?.SD || r.data?.url || r.data?.video;
        if (vidUrl) {
          await sock.sendMessage(m.chat, { video:{ url:vidUrl }, caption:`🐦 Twitter/X`, mimetype:"video/mp4" }, { quoted: m });
          return;
        }
      } catch {}
    }
    await sock.sendMessage(m.chat, { text: "❌ Gagal download Twitter/X" }, { quoted: m });
  },
};
