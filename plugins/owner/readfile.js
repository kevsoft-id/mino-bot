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
  command: ["readfile", "catfile", "viewfile"],
  category: "owner",
  description: "Baca isi file dalam project bot (misal settings.js, config.js)",
  usage: ".readfile <path>",
  ownerOnly: true,
  async run({ sock, m, args }) {
    if (!args[0]) return sendText(sock, m.chat, "❌ Contoh: .readfile config.js\n.readfile plugins/main/settings.js", m);
    const target = safeResolve(args[0]);
    if (!target) return sendText(sock, m.chat, "❌ Path tidak diizinkan (di luar folder bot).", m);
    if (!fs.existsSync(target) || !fs.statSync(target).isFile())
      return sendText(sock, m.chat, "❌ File tidak ditemukan.", m);

    const content = fs.readFileSync(target, "utf-8");
    if (content.length > 3500) {
      return sendText(sock, m.chat, `📄 *${args[0]}*\n📏 ${content.length} karakter — terlalu panjang untuk ditampilkan.\n\nGunakan *.editfile ${args[0]}* (baris baru + isi baru) untuk mengubahnya langsung.`, m);
    }
    await sendText(sock, m.chat, `📄 *${args[0]}*\n\`\`\`${content}\`\`\``, m);
  },
};
