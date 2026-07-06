const { getGroup, saveGroup } = require("../../lib/database");
module.exports = {
  command: ["autoai","aion","aioff"], category: "group",
  description: "Aktifkan auto AI di grup", adminOnly:true, groupOnly:true,
  async run({ sock, m, body, prefix, args }) {
    const p = prefix || ".";
    const isOff = body.toLowerCase().startsWith(p+"aioff");
    const mode = isOff ? "off" : (args[0]?.toLowerCase() === "off" ? "off" : "on");
    const grp = getGroup(m.chat);
    grp.autoai = mode === "on";
    saveGroup(m.chat, grp);
    await sock.sendMessage(m.chat, { text: `🤖 Auto AI *${mode.toUpperCase()}* di grup ini.\n${mode === "on" ? "Bot akan otomatis merespons semua pesan!" : ""}` }, { quoted: m });
  },
};
