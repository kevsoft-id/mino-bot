/*
  ===========================================================
  [ WATERMARK & LICENSE NOTICE ]
  ===========================================================
  🤖 BOT NAME : MINOBOT
  👤 DEVELOPER: KEVIN (KevSoft-ID)
  🌐 GITHUB   : https://github.com/kevsoft-id
  ===========================================================

  ⚠️ KETENTUAN PENGGUNAAN (TERMS OF SERVICE):

  1. [DILARANG] Menghapus atau mengubah kredit & lisensi asli.
  2. [DILARANG] Menghapus watermark developer ini.
  3. [DILARANG] Memperjualbelikan (komersialkan) script bot ini.

  🔄 [DIPERBOLEHKAN] Mengubah nama bot (Rename) sesuai keinginan,
     dengan catatan poin 1, 2, dan 3 di atas tetap ditaati.

  ===========================================================
  🚨 PERINGATAN KERAS & KONSEKUENSI
  ===========================================================
  Script ini dilindungi oleh hak cipta digital dan lisensi open-source.
  Jika Anda kedapatan menghapus kredit, watermark, atau memperjualbelikannya:

  * Takedown Massal (DMCA): Repository GitHub Anda akan dilaporkan
    dan di-takedown paksa oleh GitHub atas pelanggaran hak cipta.
  * Blacklist & Banned: Akun dan nomor WhatsApp Anda akan dimasukkan
    ke dalam daftar hitam (blacklist) global sistem bot kami.
  * Sanksi Sosial & Hukum: Identitas pelanggar akan dipublikasikan
    di komunitas sebagai pencuri karya (plagiator).

  Created by Kevin © 2026. All rights reserved.
  🌐 https://github.com/kevsoft-id/minobot
  ===========================================================
*/

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
