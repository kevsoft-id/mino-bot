const { saveUser } = require("../../lib/database");
const { sendText } = require("../../lib/sender");

module.exports = {
  command: ["bio", "setbio"],
  category: "main",
  description: "Atur bio singkat untuk kartu profil canvas kamu",
  usage: ".bio <teks>",
  async run({ sock, m, args }) {
    const text = args.join(" ").trim();
    if (!text) return sendText(sock, m.chat, "❌ Contoh: .bio Suka ngoding & kopi ☕", m);
    saveUser(m.sender, { bio: text.slice(0, 80) });
    await sendText(sock, m.chat, `✅ Bio diperbarui:\n_"${text.slice(0, 80)}"_\n\nKetik *.profile* untuk melihat kartu profil kamu.`, m);
  },
};
