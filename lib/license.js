'use strict';

// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
//
// ════════════════════════════════════════════════════════════
//  SISTEM PROTEKSI LISENSI & WATERMARK — KEVSOFT-ID
// ════════════════════════════════════════════════════════════
//  Modul ini HANYA memverifikasi watermark & kredit developer —
//  yaitu field kredit di set/settings.js dan file license.js ini
//  sendiri. Bot TIDAK PERNAH memindai/mempedulikan file kode lain
//  (index.js, handler.js, connection.js, utils.js, plugin, dll) —
//  jadi mengedit fitur, logika, atau file apa pun SELAIN area
//  kredit di bawah ini TIDAK PERNAH memicu error, sebebas apa pun
//  perubahannya.
//
//  Deteksi memakai pencocokan FUZZY (bukan exact-match) — jadi
//  reformat/typo kecil pada kredit TIDAK dianggap pelanggaran.
//  Bot hanya berhenti (hard error) kalau kredit benar-benar
//  HILANG TOTAL / DIGANTI TANPA JEJAK, contoh:
//    • Baris seal watermark di license.js ini dihapus, ATAU
//    • botTag / webUrl / footer / theme.footer di settings.js
//      diubah jadi sesuatu yang sama sekali tidak menyisakan
//      jejak kredit, ATAU
//    • Nama developer utama (Kevin / KevSoft-ID) dihapus total
//      dari SEMUA field kredit di settings.js.
//  Kalau kredit cuma direformat/dipindah tapi jejaknya masih ada,
//  bot TETAP JALAN NORMAL — tidak ada false-positive.
// ════════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');

const SEAL = '@minobot-seal:KevSoft-ID';

// Satu-satunya file kode yang diperiksa langsung: license.js ini
// sendiri (file lisensi). File kode lain (index.js, handler.js,
// connection.js, utils.js, plugin, dll) TIDAK pernah dipindai —
// bebas diedit tanpa risiko memicu error lisensi.
const REQUIRED_FILES = [
  path.join(__dirname, 'license.js'),
];

// Kata kunci identitas developer. Deteksi fuzzy: huruf besar/kecil,
// spasi, titik, underscore, strip — semua diabaikan saat dibandingkan,
// jadi "KevSoft-ID", "kevsoft_id", "Kev Soft ID" dst tetap dianggap SAH.
const KEYWORDS = ['kevsoft', 'kevin'];

function normalize(str) {
  return String(str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function hasAnyKeyword(str) {
  const n = normalize(str);
  return KEYWORDS.some((k) => n.includes(k));
}

// Field kredit wajib di set/settings.js yang masing-masing harus
// menyisakan jejak "kevsoft" di dalamnya.
const CREDIT_FIELDS = [
  { key: 'botTag', label: 'botTag' },
  { key: 'webUrl',  label: 'webUrl' },
  { key: 'footer',  label: 'footer' },
];

global.__license = { ok: true, violations: [], checkedAt: 0 };

/* ── 1. File inti wajib menyisakan jejak watermark ───────────── */
function scanFiles() {
  const violations = [];
  for (const file of REQUIRED_FILES) {
    let content;
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch {
      continue; // Belum ada saat instalasi pertama — bukan pelanggaran.
    }
    // Lolos kalau seal PERSIS ada, ATAU minimal jejak kata kunci masih ada
    // di mana pun dalam file (reformat/pindah posisi tetap dianggap sah).
    if (content.includes(SEAL) || hasAnyKeyword(content)) continue;
    violations.push(`Watermark developer hilang total di ${path.basename(file)} (tidak ada jejak sama sekali)`);
  }
  return violations;
}

/* ── 2. Kredit di settings.js wajib menyisakan jejak per-field ── */
function scanSettingsCredit() {
  const violations = [];
  let settings;
  try {
    settings = require('../set/settings');
  } catch {
    return ['set/settings.js gagal dimuat — file rusak?'];
  }

  for (const { key, label } of CREDIT_FIELDS) {
    if (!hasAnyKeyword(settings[key])) {
      violations.push(`Kredit "${label}" di set/settings.js diubah/dihapus tanpa jejak`);
    }
  }
  if (settings.theme && !hasAnyKeyword(settings.theme.footer)) {
    violations.push('Kredit "theme.footer" di set/settings.js diubah/dihapus tanpa jejak');
  }
  return violations;
}

/* ── 3. Nama developer utama wajib ada di SETIDAKNYA satu field
 *      kredit di settings.js (bukan di seluruh source code) ──── */
function scanMainDevPresence() {
  let combined = '';
  try {
    const settings = require('../set/settings');
    combined = [
      settings.botTag,
      settings.webUrl,
      settings.footer,
      settings.theme && settings.theme.footer,
      settings.credits && settings.credits.mainDev,
    ].filter(Boolean).join(' ');
  } catch { /* skip */ }

  const n = normalize(combined);
  const missing = KEYWORDS.filter((k) => !n.includes(k));
  if (missing.length === KEYWORDS.length) {
    return ['Nama developer utama (Kevin / KevSoft-ID) dihapus total dari seluruh project'];
  }
  return [];
}

/* ── Banner error — mencolok, tidak boleh dilewatkan ─────────── */
function printFatalBanner(violations) {
  const W = 62;
  const line = (ch) => ch.repeat(W);
  const pad = (s) => ' ' + s + ' '.repeat(Math.max(0, W - s.length - 1));

  console.error('');
  console.error(`\x1b[1m\x1b[41m\x1b[97m${line('▓')}\x1b[0m`);
  console.error(`\x1b[1m\x1b[41m\x1b[97m${pad('  🛑  LICENSE INTEGRITY VIOLATION — SYSTEM HALTED  🛑')}\x1b[0m`);
  console.error(`\x1b[1m\x1b[41m\x1b[97m${line('▓')}\x1b[0m`);
  console.error(`\x1b[31m${line('─')}\x1b[0m`);
  for (const v of violations) console.error(`\x1b[31m  ✗ ${v}\x1b[0m`);
  console.error(`\x1b[31m${line('─')}\x1b[0m`);
  console.error('\x1b[33m  ⚠️  JANGAN HAPUS ATAU MENGUBAH WATERMARK / KREDIT DEVELOPER!\x1b[0m');
  console.error('\x1b[33m  ⚠️  DO NOT REMOVE OR MODIFY THE LICENSE / WATERMARK!\x1b[0m');
  console.error('\x1b[36m  Kembalikan file ke versi asli (git checkout / re-download)\x1b[0m');
  console.error('\x1b[36m  lalu jalankan ulang bot. Source resmi:\x1b[0m');
  console.error('\x1b[36m  → https://github.com/kevsoft-id/mino-bot\x1b[0m');
  console.error(`\x1b[1m\x1b[41m\x1b[97m${line('▓')}\x1b[0m`);
  console.error('');
}

/**
 * Jalankan verifikasi penuh. Dipanggil saat startup (index.js) dan
 * secara berkala selama bot berjalan (lihat startWatch()).
 *
 * PENTING: hanya menghasilkan violation kalau watermark/kredit BENAR-
 * BENAR hilang tanpa jejak sama sekali — reformat/typo kecil tidak
 * dianggap pelanggaran (lihat hasAnyKeyword()). Kalau ada violation,
 * proses langsung dihentikan (process.exit) — tidak ada mode "lunak".
 * @returns {{ok: boolean, violations: string[]}}
 */
function verifyIntegrity() {
  const violations = [
    ...scanFiles(),
    ...scanSettingsCredit(),
    ...scanMainDevPresence(),
  ];
  const ok = violations.length === 0;
  global.__license = { ok, violations, checkedAt: Date.now() };

  if (!ok) {
    printFatalBanner(violations);
    process.exit(1);
  }

  return { ok, violations };
}

/**
 * Mulai pengecekan berkala (default tiap 10 menit) agar file yang
 * diedit saat bot sudah berjalan (tanpa restart) tetap terdeteksi.
 * @param {number} intervalMs
 */
function startWatch(intervalMs = 10 * 60 * 1000) {
  const timer = setInterval(() => {
    try { verifyIntegrity(); } catch (err) {
      console.error('[LICENSE] Gagal verifikasi berkala:', err.message);
    }
  }, intervalMs);
  if (typeof timer.unref === 'function') timer.unref();
  return timer;
}

module.exports = { verifyIntegrity, startWatch };
