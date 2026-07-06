const axios = require("axios");
module.exports = {
  command: ["npm","npminfo","package"], category: "search",
  description: "Cari info package NPM",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .npm <nama package>" }, { quoted: m });
    try {
      const r = await axios.get(`https://registry.npmjs.org/${encodeURIComponent(args[0])}`, { timeout: 10000 });
      const d = r.data;
      const latest = d["dist-tags"]?.latest || "?";
      const v = d.versions?.[latest];
      await sock.sendMessage(m.chat, { text:
        `╭──「 *📦 NPM PACKAGE* 」\n│● Nama    : ${d.name}\n│● Versi   : ${latest}\n│● Deskripsi: ${(d.description||"").substring(0,150)}\n│● Penulis : ${d.maintainers?.[0]?.name||"-"}\n│● Lisensi : ${v?.license||"-"}\n│● Install : npm install ${d.name}\n│● Link    : https://npmjs.com/package/${d.name}\n╰───────────♢`
      }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ Package tidak ditemukan" }, { quoted: m }); }
  },
};
