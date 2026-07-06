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

"use strict";
const crypto = require("crypto");

// =============================================================
// ⚠️  JANGAN UBAH / HAPUS KONSTANTA DI BAWAH INI
//     Mengubah atau menghapus nilai-nilai ini akan membuat
//     bot CRASH / berhenti berjalan secara otomatis.
// =============================================================

/** URL repositori resmi — TIDAK BOLEH DIUBAH */
const WATERMARK_REPO   = "https://github.com/kevsoft-id/minobot";

/** Nama bot */
const WATERMARK_BOT    = "MINOBOT";

/** Developer asli */
const WATERMARK_AUTHOR = "KEVIN (KevSoft-ID)";

/** Tahun rilis */
const WATERMARK_YEAR   = "2026";

// Tanda tangan integritas — JANGAN UBAH
// SHA-256(REPO + "|" + BOT + "|" + AUTHOR), 32 karakter pertama
const _SIG = "a50f9b48440ef6e038c7df10b220ad35";

function _fail() {
  process.stderr.write([
    "",
    "╔══════════════════════════════════════════════════════════════╗",
    "║         ❌  WATERMARK INTEGRITY VIOLATION ❌                  ║",
    "╠══════════════════════════════════════════════════════════════╣",
    "║  Script ini dilindungi watermark KevSoft-ID.                 ║",
    "║  Watermark telah dihapus atau dimodifikasi secara ilegal.    ║",
    "║  Bot tidak dapat dijalankan.                                 ║",
    "║                                                              ║",
    "║  🌐 Repo asli : https://github.com/kevsoft-id/minobot       ║",
    "║  👤 Developer : KEVIN (KevSoft-ID)                           ║",
    "╚══════════════════════════════════════════════════════════════╝",
    "",
  ].join("\n") + "\n");
  process.exit(1);
}

/**
 * Verifikasi integritas watermark.
 * Dipanggil otomatis saat bot pertama kali menyala.
 * Jika watermark dimodifikasi → bot langsung exit(1).
 */
function verifyWatermark() {
  const computed = crypto
    .createHash("sha256")
    .update(WATERMARK_REPO + "|" + WATERMARK_BOT + "|" + WATERMARK_AUTHOR)
    .digest("hex")
    .slice(0, 32);

  if (computed !== _SIG) _fail();
}

module.exports = {
  verifyWatermark,
  WATERMARK_REPO,
  WATERMARK_BOT,
  WATERMARK_AUTHOR,
  WATERMARK_YEAR,
};
