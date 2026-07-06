const axios = require("axios");
module.exports = {
  command: ["lirik","lyrics"], category: "tools", description: "Cari lirik lagu",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .lirik <judul lagu>" }, { quoted: m });
    const q = args.join(" ");
    try {
      const res = await axios.get(`https://api.siputzx.my.id/api/tools/lirik?judul=${encodeURIComponent(q)}`, { timeout:15000 });
      const d = res.data?.data;
      if (!d) throw new Error("Tidak ditemukan");
      const lirik = (d.lirik||"").substring(0,3500);
      await sock.sendMessage(m.chat, { text: `╭──「 *🎵 LIRIK* 」\n│● Judul : ${d.judul||q}\n│● Artis : ${d.artis||"-"}\n╰───────────♢\n\n${lirik}` }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
