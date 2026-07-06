const axios = require("axios");
module.exports = {
  command: ["spotify","spotifydl"], category: "downloader", description: "Download/info lagu Spotify",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .spotify <link Spotify>" }, { quoted: m });
    await sock.sendMessage(m.chat, { text: "⏳ Memproses Spotify..." }, { quoted: m }).catch(() => {});
    try {
      const r = await axios.get(`https://api.siputzx.my.id/api/d/spotify?url=${encodeURIComponent(args[0])}`, { timeout:30000 });
      const d = r.data?.data;
      if (!d) throw new Error("Tidak ditemukan");
      if (d.download) {
        await sock.sendMessage(m.chat, { audio:{ url:d.download }, mimetype:"audio/mpeg", ptt:false, fileName:`${d.title||"spotify"}.mp3` }, { quoted: m });
      } else {
        await sock.sendMessage(m.chat, { text: `╭──「 *🎵 SPOTIFY* 」\n│● Judul   : ${d.title||"-"}\n│● Artis   : ${d.artist||"-"}\n│● Album   : ${d.album||"-"}\n│● Durasi  : ${d.duration||"-"}\n╰───────────♢` }, { quoted: m });
      }
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
