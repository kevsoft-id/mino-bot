const { getGroup, saveGroup } = require("../../lib/database");
module.exports = {
  command: ["antilink","antilink"], category: "group",
  description: "Aktifkan/matikan anti-link grup", adminOnly:true, groupOnly:true,
  async run({ sock, m, args }) {
    const mode = (args[0]||"").toLowerCase();
    if (!["on","off"].includes(mode)) return sock.sendMessage(m.chat, { text: "❌ .antilink on/off" }, { quoted: m });
    const grp = getGroup(m.chat);
    grp.antilink = mode === "on";
    saveGroup(m.chat, grp);
    await sock.sendMessage(m.chat, { text: `✅ Anti-link *${mode.toUpperCase()}*` }, { quoted: m });
  },
};
