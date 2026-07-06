module.exports = {
  command: ["open","close","buka","tutup"], category: "group",
  description: "Buka/tutup chat grup", adminOnly:true, groupOnly:true, botAdminOnly:true,
  async run({ sock, m, body, prefix }) {
    const p = prefix || ".";
    const isClose = body.toLowerCase().startsWith(p+"close") || body.toLowerCase().startsWith(p+"tutup");
    try {
      await sock.groupSettingUpdate(m.chat, isClose ? "announcement" : "not_announcement");
      await sock.sendMessage(m.chat, { text: `✅ Grup *${isClose?"DITUTUP (hanya admin bisa chat)":"DIBUKA (semua bisa chat)"}*` }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
