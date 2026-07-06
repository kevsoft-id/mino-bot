module.exports = {
  command: ["setdesc","deskripsi","setdeskripsi"], category: "group",
  description: "Ubah deskripsi grup", adminOnly:true, groupOnly:true, botAdminOnly:true,
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .setdesc <deskripsi baru>" }, { quoted: m });
    const desc = args.join(" ");
    try {
      await sock.groupUpdateDescription(m.chat, desc);
      await sock.sendMessage(m.chat, { text: `✅ Deskripsi grup diperbarui!` }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
