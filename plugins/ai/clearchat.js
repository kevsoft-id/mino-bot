const { clearSession } = require("../../lib/gemini");
module.exports = {
  command: ["clearchat","resetchat","newchat"], category: "ai",
  description: "Reset riwayat percakapan AI",
  async run({ sock, m }) {
    clearSession(m.sender + m.chat);
    await sock.sendMessage(m.chat, { text: "✅ Riwayat percakapan AI direset. Mulai percakapan baru!" }, { quoted: m });
  },
};
