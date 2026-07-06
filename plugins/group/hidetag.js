module.exports = {
  command: ["hidetag","ht","silent"], category: "group",
  description: "Tag semua tanpa terlihat", adminOnly:true, groupOnly:true,
  async run({ sock, m, args }) {
    try {
      const meta = await sock.groupMetadata(m.chat);
      const mentions = meta.participants.map(p => p.id);
      const msg = args.join(" ") || "📢 Pengumuman";
      await sock.sendMessage(m.chat, { text: msg, mentions }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
