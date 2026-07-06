const fs = require("fs");
const path = require("path");
const { sendText } = require("../../lib/sender");

const ROOT = path.join(__dirname, "..", "..");

function safeResolve(rel) {
  const resolved = path.resolve(ROOT, rel || ".");
  if (resolved !== ROOT && !resolved.startsWith(ROOT + path.sep)) return null;
  return resolved;
}

module.exports = {
  command: ["editfile", "setfile", "writefile"],
  category: "owner",
  description: "Ubah/tulis ulang isi file dalam project bot (misal settings.js) — otomatis backup",
  usage: ".editfile <path>\n<isi baru file>",
  ownerOnly: true,
  async run({ sock, m, body, prefix, reloadPlugins }) {
    const afterCmd = body.slice(prefix.length).trim().replace(/^\S+\s*/, "");
    const newlineIdx = afterCmd.indexOf("\n");
    if (newlineIdx === -1) {
      return sendText(sock, m.chat,
        "❌ Format:\n.editfile <path>\n<isi baru file>\n\n" +
        "Contoh:\n.editfile database/settings.json\n{ \"botName\": \"Mino Ultra\" }\n\n" +
        "💡 File lama otomatis dibackup ke <path>.bak sebelum ditimpa.", m);
    }
    const filePath = afterCmd.slice(0, newlineIdx).trim();
    const newContent = afterCmd.slice(newlineIdx + 1);
    if (!filePath) return sendText(sock, m.chat, "❌ Path file tidak boleh kosong.", m);

    const target = safeResolve(filePath);
    if (!target) return sendText(sock, m.chat, "❌ Path tidak diizinkan (di luar folder bot).", m);

    try {
      if (fs.existsSync(target)) fs.copyFileSync(target, target + ".bak");
      else fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, newContent, "utf-8");

      let extra = "";
      if (filePath.replace(/\\/g, "/").startsWith("plugins/")) {
        try { reloadPlugins(); extra = "\n♻️ Plugin otomatis di-reload."; } catch {}
      }
      await sendText(sock, m.chat, `✅ File *${filePath}* berhasil diubah!\n💾 Backup: *${filePath}.bak*${extra}\n\n_Gunakan .restorefile ${filePath} untuk mengembalikan jika ada kesalahan._`, m);
    } catch (e) {
      await sendText(sock, m.chat, `❌ Gagal menulis file: ${e.message}`, m);
    }
  },
};
