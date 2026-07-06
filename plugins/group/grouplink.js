module.exports = {
  command: ["grouplink","link","invitelink"], category: "group",
  description: "Dapatkan link undangan grup", adminOnly:true, groupOnly:true,
  async run({ sock, m }) {
    try {
      const code = await sock.groupInviteCode(m.chat);
      await sock.sendMessage(m.chat, { text: `🔗 *Link Grup:*\nhttps://chat.whatsapp.com/${code}` }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
