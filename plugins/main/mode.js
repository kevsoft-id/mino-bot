const { getSettings, saveSettings } = require("../../lib/database");
const config = require("../../config");
module.exports = {
  command: "mode", category: "main", description: "Ubah mode bot (public/self)",
  ownerOnly: true,
  async run({ sock, m, args }) {
    const v = (args[0]||"").toLowerCase();
    if (!["public","self"].includes(v)) return sock.sendMessage(m.chat, { text: "❌ Gunakan: .mode public atau .mode self" }, { quoted: m });
    const cfg = getSettings(); cfg.mode = v; config.mode = v; saveSettings(cfg);
    await sock.sendMessage(m.chat, { text: `✅ Mode diubah ke *${v.toUpperCase()}*` }, { quoted: m });
  },
};
