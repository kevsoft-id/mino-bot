const { getTag } = require("../../lib/function");
module.exports = {
  command: ["promote","jadmin","naikan"], category: "group",
  description: "Jadikan admin grup", adminOnly:true, groupOnly:true, botAdminOnly:true,
  async run({ sock, m }) {
    const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const target = mentioned?.[0] || m.quoted?.sender;
    if (!target) return sock.sendMessage(m.chat, { text: "❌ Tag user yang ingin dijadikan admin!" }, { quoted: m });
    try {
      await sock.groupParticipantsUpdate(m.chat, [target], "promote");
      await sock.sendMessage(m.chat, { text: `✅ @${getTag(target)} dijadikan *admin*!`, mentions:[target] }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
