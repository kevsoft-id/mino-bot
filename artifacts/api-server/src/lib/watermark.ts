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
  3. [DILARANG] Memperjualbelikan (momersialkan) script bot ini.

  🔄 [DIPERBOLEHKAN] Mengubah nama bot (Rename) sesuai keinginan,
     dengan catatan poin 1, 2, dan 3 di atas tetap ditaati.

  ===========================================================
  🚨 PERINGATAN KERAS & KONSEKUENSI (KALAU KETAUHAN BAHAYA!)
  ===========================================================
  Script ini dilindungi oleh hak cipta digital dan lisensi open-source.
  Jika Anda kedapatan menghapus kredit, watermark, atau memperjualbelikannya:

  * Takedown Massal (DMCA): Repository GitHub Anda akan dilaporkan
    dan di-takedown paksa oleh GitHub atas pelanggaran hak cipta.
  * Blacklist & Banned: Akun dan nomor WhatsApp Anda akan dimasukkan
    ke dalam daftar hitam (blacklist) global sistem bot kami, sehingga
    Anda tidak akan bisa menggunakan fitur atau update di masa depan.
  * Sanksi Sosial & Hukum: Identitas pelanggar akan dipublikasikan
    di komunitas sebagai pencuri karya (plagiator). Hargai developer
    yang sudah membagikan script ini secara gratis!

  Created by Kevin © 2026. All rights reserved.
  ===========================================================
*/

import { createHash } from "crypto";
import type { Request, Response, NextFunction } from "express";

// =============================================================
// ⚠️  JANGAN UBAH / HAPUS KONSTANTA DI BAWAH INI
//     Mengubah atau menghapus nilai-nilai ini akan membuat
//     server CRASH / berhenti berjalan secara otomatis.
// =============================================================

/** URL repositori resmi — TIDAK BOLEH DIUBAH */
export const WATERMARK_REPO = "https://github.com/kevsoft-id/minobot" as const;

/** Nama bot resmi */
export const WATERMARK_BOT = "MINOBOT" as const;

/** Developer asli */
export const WATERMARK_AUTHOR = "KEVIN (KevSoft-ID)" as const;

/** Tahun rilis */
export const WATERMARK_YEAR = "2026" as const;

/** Teks kredit lengkap yang dikirim di setiap response header */
export const WATERMARK_CREDIT =
  `${WATERMARK_BOT} by ${WATERMARK_AUTHOR} | ${WATERMARK_REPO}` as const;

// Tanda tangan integritas:
// SHA-256(WATERMARK_REPO + "|" + WATERMARK_BOT + "|" + WATERMARK_AUTHOR), 32 karakter pertama.
// JANGAN UBAH nilai ini — server langsung exit(1) jika tanda tangan tidak cocok.
const _INTEGRITY_SIG = "a50f9b48440ef6e038c7df10b220ad35" as const;

// =============================================================
// Fungsi internal — jangan dimodifikasi
// =============================================================

function _computeSig(): string {
  return createHash("sha256")
    .update(`${WATERMARK_REPO}|${WATERMARK_BOT}|${WATERMARK_AUTHOR}`)
    .digest("hex")
    .slice(0, 32);
}

function _printViolation(): void {
  process.stderr.write(
    "\n" +
      "╔══════════════════════════════════════════════════════════════╗\n" +
      "║         ❌  WATERMARK INTEGRITY VIOLATION ❌                  ║\n" +
      "╠══════════════════════════════════════════════════════════════╣\n" +
      "║  Script ini dilindungi watermark KevSoft-ID.                 ║\n" +
      "║  Watermark telah dihapus atau dimodifikasi secara ilegal.    ║\n" +
      "║  Server tidak dapat dijalankan.                              ║\n" +
      "║                                                              ║\n" +
      "║  🌐 Repo asli : https://github.com/kevsoft-id/minobot       ║\n" +
      "║  👤 Developer : KEVIN (KevSoft-ID)                           ║\n" +
      "╚══════════════════════════════════════════════════════════════╝\n\n",
  );
}

// =============================================================
// Ekspor publik
// =============================================================

/**
 * Verifikasi integritas watermark saat startup.
 * Dipanggil sebagai baris pertama di index.ts sebelum apapun.
 * Jika watermark dimodifikasi → server langsung `process.exit(1)`.
 */
export function verifyWatermark(): void {
  if (_computeSig() !== _INTEGRITY_SIG) {
    _printViolation();
    process.exit(1);
  }

  process.stdout.write(
    `[${WATERMARK_BOT}] ✅ Watermark verified — ${WATERMARK_AUTHOR} © ${WATERMARK_YEAR}\n`,
  );
}

/**
 * Express middleware — menyematkan kredit watermark ke SETIAP response
 * sebagai header `X-Powered-By`.
 *
 * Middleware ini WAJIB dipasang di app.ts. Jika dihapus, header hilang
 * dan server menjadi tidak sesuai lisensi.
 */
export function watermarkMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  res.setHeader("X-Powered-By", WATERMARK_CREDIT);
  res.setHeader("X-Repo", WATERMARK_REPO);
  next();
}

/**
 * Objek info kredit yang disertakan dalam respons /api/healthz.
 * Jangan hapus bagian ini dari health check response.
 */
export const WATERMARK_HEALTH_INFO = {
  bot: WATERMARK_BOT,
  developer: WATERMARK_AUTHOR,
  repo: WATERMARK_REPO,
  year: WATERMARK_YEAR,
} as const;
