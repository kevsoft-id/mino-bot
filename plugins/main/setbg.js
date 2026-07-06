const fs = require("fs");
const path = require("path");
const { saveUser } = require("../../lib/database");
const { sendText } = require("../../lib/sender");
const { downloadMedia, getTag } = require("../../lib/function");

module.exports = {
  command: ["setbg", "setbackground", "canvasbg"],
  category: "main",
  description: "Ganti background canvas profile kamu (unggah gambar sendiri)",
  usage: ".setbg <url gambar> | reply gambar dengan .setbg | .setbg default",
  async run({ sock, m, args }) {
    if (m.quoted && m.quoted.type === "imageMessage") {
      try {
        const buf = await downloadMedia(sock, { key: m.quoted.key, message: m.quoted.message });
        const dir = path.join(__dirname, "..", "..", "database", "customBg");
        fs.mkdirSync(dir, { recursive: true });
        const file = path.join(dir, `${getTag(m.sender)}.jpg`);
        fs.writeFileSync(file, buf);
        saveUser(m.sender, { customBg: file });
        return sendText(sock, m.chat, "✅ Background canvas berhasil diubah dari gambar yang di-reply!\nKetik *.profile* untuk melihat hasilnya.", m);
      } catch (e) {
        return sendText(sock, m.chat, `❌ Gagal memproses gambar: ${e.message}`, m);
      }
    }

    const url = args[0];
    if (!url) return sendText(sock, m.chat, "❌ Reply gambar dengan caption *.setbg*, atau kirim *.setbg <url gambar>*.\n\nKetik *.setbg default* untuk kembali ke background bawaan (tembok bata minimalis).", m);

    if (["default", "reset"].includes(url.toLowerCase())) {
      saveUser(m.sender, { customBg: "" });
      return sendText(sock, m.chat, "✅ Background canvas dikembalikan ke default.", m);
    }

    saveUser(m.sender, { customBg: url });
    await sendText(sock, m.chat, "✅ Background canvas berhasil diubah!\nKetik *.profile* untuk melihat hasilnya.", m);
  },
};
