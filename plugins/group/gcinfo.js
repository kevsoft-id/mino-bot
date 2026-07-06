const moment = require("moment-timezone");
const config = require("../../config");
module.exports = {
  command: ["gcinfo","groupinfo","infogroup"], category: "group",
  description: "Info detail grup", groupOnly:true,
  async run({ sock, m }) {
    try {
      const meta = await sock.groupMetadata(m.chat);
      const admins = meta.participants.filter(p => p.admin);
      const created = moment(meta.creation*1000).tz(config.timezone).format("D MMM YYYY");
      let ppUrl; try { ppUrl = await sock.profilePictureUrl(m.chat, "image"); } catch {}
      const text = `╭──「 *ℹ️ INFO GRUP* 」\n│● Nama    : ${meta.subject}\n│● ID      : ${meta.id}\n│● Dibuat  : ${created}\n│● Anggota : ${meta.participants.length}\n│● Admin   : ${admins.length}\n│● Deskripsi:\n│${(meta.desc||"-").substring(0,200)}\n╰───────────♢`;
      if (ppUrl) await sock.sendMessage(m.chat, { image:{url:ppUrl}, caption:text }, { quoted: m });
      else await sock.sendMessage(m.chat, { text }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
