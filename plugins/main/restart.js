module.exports = {
  command: ["restart","reboot"], category: "main", description: "Restart bot", ownerOnly: true,
  async run({ sock, m }) {
    await sock.sendMessage(m.chat, { text: "🔄 Bot merestart..." }, { quoted: m });
    setTimeout(() => process.exit(0), 1500);
  },
};
