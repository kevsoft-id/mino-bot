const { getTag } = require("../../lib/function");
module.exports = {
  command: ["demote","copot","cabut"], category: "group",
  description: "Copot admin grup", adminOnly:true, groupOnly:true, botAdminOnly:true,
  async run({ sock, m }) {
    const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const target = mentioned?.[0] || m.quoted?.sender;
    if (!target) return sock.sendMessage(m.chat, { text: "❌ Tag admin yang ingin dicopot!" }, { quoted: m });
    try {
      await sock.groupParticipantsUpdate(m.chat, [target], "demote");
      await sock.sendMessage(m.chat, { text: `✅ @${getTag(target)} dicopot dari *admin*!`, mentions:[target] }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
