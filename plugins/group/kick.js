const { getTag } = require("../../lib/function");
module.exports = {
  command: ["kick","remove","keluarkan"], category: "group",
  description: "Kick member dari grup", adminOnly:true, groupOnly:true, botAdminOnly:true,
  async run({ sock, m, args }) {
    const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    let target = mentioned?.[0] || (args[0] ? (args[0].replace(/[^0-9]/g,"") + "@s.whatsapp.net") : null);
    if (!target) return sock.sendMessage(m.chat, { text: "❌ Tag user yang ingin dikick!" }, { quoted: m });
    try {
      await sock.groupParticipantsUpdate(m.chat, [target], "remove");
      await sock.sendMessage(m.chat, { text: `✅ @${getTag(target)} berhasil dikick!`, mentions:[target] }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
