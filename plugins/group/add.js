const { cleanNumber } = require("../../lib/function");
module.exports = {
  command: ["add","tambah"], category: "group",
  description: "Tambah member ke grup", adminOnly:true, groupOnly:true, botAdminOnly:true,
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .add <nomor>\nContoh: .add 6281234567890" }, { quoted: m });
    const num = cleanNumber(args[0]);
    if (!num) return sock.sendMessage(m.chat, { text: "❌ Nomor tidak valid!" }, { quoted: m });
    const jid = num + "@s.whatsapp.net";
    try {
      await sock.groupParticipantsUpdate(m.chat, [jid], "add");
      await sock.sendMessage(m.chat, { text: `✅ Berhasil menambah @${num}`, mentions:[jid] }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
