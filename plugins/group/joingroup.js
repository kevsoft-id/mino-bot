module.exports = {
  command: ["join","joingroup"], category: "group",
  description: "Bot join grup via link (owner only)", ownerOnly:true,
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .join <link grup>" }, { quoted: m });
    const link = args[0];
    const code = link.split("chat.whatsapp.com/").pop();
    try {
      await sock.groupAcceptInvite(code);
      await sock.sendMessage(m.chat, { text: "✅ Berhasil join grup!" }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
