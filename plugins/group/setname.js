module.exports = {
  command: ["setname","namagrup","gantinama"], category: "group",
  description: "Ubah nama grup", adminOnly:true, groupOnly:true, botAdminOnly:true,
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .setname <nama baru>" }, { quoted: m });
    const name = args.join(" ");
    try {
      await sock.groupUpdateSubject(m.chat, name);
      await sock.sendMessage(m.chat, { text: `✅ Nama grup diubah ke *${name}*` }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
