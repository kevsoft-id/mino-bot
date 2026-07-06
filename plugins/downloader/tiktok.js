const axios = require("axios");
async function dlTiktok(url) {
  const apis = [
    async () => {
      const r = await axios.get(`https://api.siputzx.my.id/api/d/tiktok?url=${encodeURIComponent(url)}`, { timeout:30000 });
      if (r.data?.status && r.data?.data) return r.data.data;
      throw 0;
    },
    async () => {
      const r = await axios.get(`https://api.ryzendesu.vip/api/downloader/tiktok?url=${encodeURIComponent(url)}`, { timeout:30000 });
      if (r.data?.video) return { video: r.data.video, title: r.data.title||"TikTok" };
      throw 0;
    },
  ];
  for (const fn of apis) { try { return await fn(); } catch {} }
  throw new Error("Gagal download TikTok");
}
module.exports = {
  command: ["tiktok","tt","tiktokvideo"], category: "downloader", description: "Download video TikTok (tanpa watermark)",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .tiktok <link TikTok>" }, { quoted: m });
    await sock.sendMessage(m.chat, { text: "⏳ Mendownload TikTok..." }, { quoted: m }).catch(() => {});
    try {
      const d = await dlTiktok(args[0]);
      const videoUrl = d.video || d.nowm || d.play;
      if (!videoUrl) throw new Error("URL video tidak tersedia");
      await sock.sendMessage(m.chat, { video:{ url:videoUrl }, caption:`🎵 *${d.title||d.desc||"TikTok"}*\n👤 ${d.author?.nickname||""}`, mimetype:"video/mp4" }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
