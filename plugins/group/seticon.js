const { downloadMedia } = require("../../lib/function");
module.exports = {
  command: ["seticon","fotogrup","setpp"], category: "group",
  description: "Ubah foto grup (reply gambar)", adminOnly:true, groupOnly:true, botAdminOnly:true,
  async run({ sock, m }) {
    const target = m.quoted;
    const msgType = target?.type;
    if (!msgType?.includes("image")) return sock.sendMessage(m.chat, { text: "❌ Reply gambar dulu!" }, { quoted: m });
    try {
      const buf = await downloadMedia(sock, target);
      await sock.updateProfilePicture(m.chat, buf);
      await sock.sendMessage(m.chat, { text: "✅ Foto grup berhasil diubah!" }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
