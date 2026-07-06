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
  command: ["restorefile", "undofile"],
  category: "owner",
  description: "Kembalikan file dari backup .bak setelah .editfile",
  usage: ".restorefile <path>",
  ownerOnly: true,
  async run({ sock, m, args, reloadPlugins }) {
    if (!args[0]) return sendText(sock, m.chat, "❌ Contoh: .restorefile config.js", m);
    const target = safeResolve(args[0]);
    if (!target) return sendText(sock, m.chat, "❌ Path tidak diizinkan.", m);
    const backup = target + ".bak";
    if (!fs.existsSync(backup)) return sendText(sock, m.chat, "❌ Tidak ada backup untuk file ini.", m);
    try {
      fs.copyFileSync(backup, target);
      let extra = "";
      if (args[0].replace(/\\/g, "/").startsWith("plugins/")) {
        try { reloadPlugins(); extra = "\n♻️ Plugin otomatis di-reload."; } catch {}
      }
      await sendText(sock, m.chat, `✅ File *${args[0]}* berhasil dikembalikan dari backup!${extra}`, m);
    } catch (e) {
      await sendText(sock, m.chat, `❌ Gagal: ${e.message}`, m);
    }
  },
};
