const { getUser, saveUser } = require("../../lib/database");
const { getTag } = require("../../lib/function");
const MAX_WARN = 3;
module.exports = {
  command: ["warn","peringatan","hapuswarn"], category: "main",
  description: "Beri/hapus peringatan user", adminOnly: true, groupOnly: false,
  async run({ sock, m, args, body, prefix }) {
    const p = prefix || ".";
    const isReset = body.toLowerCase().startsWith(p + "hapuswarn");
    const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const target = mentioned?.[0] || (args[0] ? args[0].replace(/[^0-9]/g,"") + "@s.whatsapp.net" : null);
    if (!target) return sock.sendMessage(m.chat, { text: "❌ Tag user yang ingin diberi peringatan!" }, { quoted: m });
    const u = getUser(target);
    if (isReset) {
      u.warn = 0; saveUser(target, u);
      return sock.sendMessage(m.chat, { text: `✅ Peringatan @${getTag(target)} direset (0/${MAX_WARN})`, mentions: [target] }, { quoted: m });
    }
    u.warn = (u.warn || 0) + 1;
    const reason = args[mentioned ? 0 : 1] || "Tidak ada alasan";
    if (u.warn >= MAX_WARN) {
      u.banned = true; u.warn = 0; saveUser(target, u);
      return sock.sendMessage(m.chat, { text: `🚫 @${getTag(target)} di-BAN! (${MAX_WARN}/${MAX_WARN} peringatan)\n│● Alasan: ${reason}`, mentions: [target] }, { quoted: m });
    }
    saveUser(target, u);
    await sock.sendMessage(m.chat, { text: `⚠️ Peringatan untuk @${getTag(target)}\n│● Warn  : ${u.warn}/${MAX_WARN}\n│● Alasan: ${reason}`, mentions: [target] }, { quoted: m });
  },
};
