module.exports = {
  command: ["listmember","anggota","member"], category: "group",
  description: "Daftar anggota grup", groupOnly:true,
  async run({ sock, m }) {
    try {
      const meta = await sock.groupMetadata(m.chat);
      const admins = meta.participants.filter(p => p.admin).map(p => p.id);
      let text = `╭──「 *👥 ANGGOTA GRUP* 」\n│● Nama  : ${meta.subject}\n│● Total : ${meta.participants.length}\n│● Admin : ${admins.length}\n│\n`;
      for (const p of meta.participants) {
        const tag = p.id.replace(/@.+/,"");
        const role = p.admin === "superadmin" ? "👑" : p.admin ? "⭐" : "👤";
        text += `│${role} @${tag}\n`;
      }
      text += "╰───────────♢";
      const mentions = meta.participants.map(p => p.id);
      await sock.sendMessage(m.chat, { text, mentions }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
