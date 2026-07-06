module.exports = {
  command: ["revoke","resetlink","revokelink"], category: "group",
  description: "Reset link undangan grup", adminOnly:true, groupOnly:true, botAdminOnly:true,
  async run({ sock, m }) {
    try {
      const code = await sock.groupRevokeInvite(m.chat);
      await sock.sendMessage(m.chat, { text: `✅ Link direset!\n🔗 Link baru: https://chat.whatsapp.com/${code}` }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
