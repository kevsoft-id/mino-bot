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
