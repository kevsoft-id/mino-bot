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
