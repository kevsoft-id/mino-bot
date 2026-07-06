const axios = require("axios");
async function dlIg(url) {
  const apis = [
    async () => {
      const r = await axios.get(`https://api.siputzx.my.id/api/d/ig?url=${encodeURIComponent(url)}`, { timeout:30000 });
      if (r.data?.status && r.data?.data) return r.data.data;
      throw 0;
    },
    async () => {
      const r = await axios.get(`https://api.ryzendesu.vip/api/downloader/ig?url=${encodeURIComponent(url)}`, { timeout:30000 });
      if (r.data?.[0]) return [{ url: r.data[0].url }];
      throw 0;
    },
  ];
  for (const fn of apis) { try { return await fn(); } catch {} }
  throw new Error("Gagal download Instagram");
}
module.exports = {
  command: ["ig","instagram","igdl"], category: "downloader", description: "Download foto/video Instagram",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .ig <link Instagram>" }, { quoted: m });
    await sock.sendMessage(m.chat, { text: "⏳ Mendownload Instagram..." }, { quoted: m }).catch(() => {});
    try {
      const items = await dlIg(args[0]);
      const arr = Array.isArray(items) ? items : [items];
      for (const item of arr.slice(0,5)) {
        const url = item.url || item.video || item.image;
        const isVid = url?.includes(".mp4") || item.type === "video";
        if (isVid) await sock.sendMessage(m.chat, { video:{ url }, caption:"📸 Instagram", mimetype:"video/mp4" }, { quoted: m });
        else await sock.sendMessage(m.chat, { image:{ url }, caption:"📸 Instagram" }, { quoted: m });
      }
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
