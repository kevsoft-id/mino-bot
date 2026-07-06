const { getUser, saveUser } = require("../../lib/database");
const { getTag } = require("../../lib/function");
module.exports = {
  command: ["ban","unban"], category: "main", description: "Ban/unban user dari bot",
  ownerOnly: true,
  async run({ sock, m, args, body, prefix }) {
    const p = prefix || ".";
    const isBan = body.toLowerCase().startsWith(p + "ban") && !body.toLowerCase().startsWith(p + "unban");
    const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    let target = mentioned?.[0] ? getTag(mentioned[0]) : (args[0]||"").replace(/[^0-9]/g,"");
    if (!target) return sock.sendMessage(m.chat, { text: `❌ Tag/tulis nomor user. Contoh: .${isBan?"ban":"unban"} @nomor` }, { quoted: m });
    const jid = target + "@s.whatsapp.net";
    const u = getUser(jid);
    u.banned = isBan;
    saveUser(jid, u);
    await sock.sendMessage(m.chat, { text: `✅ @${target} berhasil di-*${isBan?"ban":"unban"}*`, mentions: [jid] }, { quoted: m });
  },
};
