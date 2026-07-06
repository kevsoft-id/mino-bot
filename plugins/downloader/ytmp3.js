const axios = require("axios");
async function dlYt(url, type) {
  const apis = [
    async () => {
      const r = await axios.get(`https://api.siputzx.my.id/api/d/${type}?url=${encodeURIComponent(url)}`, { timeout:60000 });
      if (r.data?.status && r.data?.data?.url) return { url:r.data.data.url, title:r.data.data.title||type };
      throw 0;
    },
    async () => {
      const r = await axios.get(`https://api.ryzendesu.vip/api/downloader/${type}?url=${encodeURIComponent(url)}`, { timeout:60000 });
      if (r.data?.url) return { url:r.data.url, title:r.data.title||type };
      throw 0;
    },
  ];
  for (const fn of apis) { try { return await fn(); } catch {} }
  throw new Error("Semua API gagal. Coba lagi atau ganti link.");
}
module.exports = {
  command: ["ytmp3","ytaudio","mp3"], category: "downloader", description: "Download audio YouTube",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .ytmp3 <link YouTube>" }, { quoted: m });
    await sock.sendMessage(m.chat, { text: "⏳ Memproses audio..." }, { quoted: m }).catch(() => {});
    try {
      const d = await dlYt(args[0], "ytmp3");
      await sock.sendMessage(m.chat, { audio:{ url:d.url }, mimetype:"audio/mp4", ptt:false, fileName:(d.title||"audio")+".mp3" }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
