const { getGroup, saveGroup } = require("../../lib/database");
module.exports = {
  command: ["mute","unmute","bisukan"], category: "group",
  description: "Mute/unmute bot di grup", adminOnly:true, groupOnly:true,
  async run({ sock, m, body, prefix }) {
    const p = prefix || ".";
    const isMute = !body.toLowerCase().startsWith(p + "unmute");
    const grp = getGroup(m.chat);
    grp.mute = isMute;
    saveGroup(m.chat, grp);
    await sock.sendMessage(m.chat, { text: `✅ Bot *${isMute?"MUTE":"UNMUTE"}* di grup ini.` }, { quoted: m });
  },
};
