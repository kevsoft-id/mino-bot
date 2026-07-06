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
  command: ["listfiles", "lsfile", "dirfile"],
  category: "owner",
  description: "Lihat daftar file & folder dalam project bot",
  usage: ".listfiles [folder]",
  ownerOnly: true,
  async run({ sock, m, args }) {
    const target = safeResolve(args[0] || ".");
    if (!target) return sendText(sock, m.chat, "❌ Path tidak diizinkan.", m);
    if (!fs.existsSync(target) || !fs.statSync(target).isDirectory())
      return sendText(sock, m.chat, "❌ Folder tidak ditemukan.", m);

    const items = fs.readdirSync(target, { withFileTypes: true })
      .filter((i) => !i.name.startsWith(".") && i.name !== "node_modules")
      .sort((a, b) => Number(b.isDirectory()) - Number(a.isDirectory()) || a.name.localeCompare(b.name));

    const rel = path.relative(ROOT, target) || ".";
    let text = `╭─❪ 📂 *${rel}* ❫\n`;
    for (const it of items) text += `│ ${it.isDirectory() ? "📁" : "📄"} ${it.name}\n`;
    text += "╰─────────────\n\n_Gunakan .readfile <path> untuk membaca, .editfile <path> untuk mengubah isi file._";
    await sendText(sock, m.chat, text, m);
  },
};
