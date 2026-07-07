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

// Verifikasi watermark — WAJIB, jangan dihapus
const { verifyWatermark } = require("./lib/watermark");
verifyWatermark();

// Load .env jika ada
try { require("dotenv").config(); } catch {}

// ── Import Baileys dengan aman ─────────────────────────────────────────────────
// makeInMemoryStore dihapus di Baileys v6.7.x — di-handle manual di bawah
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  Browsers,
} = require("@whiskeysockets/baileys");

const { Boom }  = require("@hapi/boom");
const pino      = require("pino");
const fs        = require("fs");
const chalk     = require("chalk");
const config    = require("./config");
const { handleMessage, handleGroupUpdate } = require("./handler");
const { checkAllPremiumExpiry } = require("./lib/database");

const logger    = pino({ level: "silent" });
const startTime = Date.now();
let reconnectCount = 0;

// Cache pesan sederhana — pengganti makeInMemoryStore yang sudah dihapus Baileys
const msgCache = new Map();
const MSG_CACHE_MAX = 500;

function cacheMessage(msg) {
  if (!msg?.key?.id || !msg.message) return;
  msgCache.set(msg.key.id, msg.message);
  if (msgCache.size > MSG_CACHE_MAX) {
    // Hapus entri paling lama
    const firstKey = msgCache.keys().next().value;
    msgCache.delete(firstKey);
  }
}

// Saluran yang otomatis diikuti saat bot terhubung (opsional)
const AUTO_JOIN_NEWSLETTER = "120363403656957223@newsletter";

// ── Banner ────────────────────────────────────────────────────────────────────
function banner() {
  console.log(chalk.cyan(`
╔══════════════════════════════════════════╗
║   🤖  MINO BOT ULTRA  v2.0              ║
║       by KevSoft-ID                      ║
║   150+ Fitur | AI Gemini | Anti-Error    ║
║   github.com/kevsoft-id/minobot          ║
╚══════════════════════════════════════════╝`));
  console.log();
}
banner();

// ── Validasi konfigurasi penting ─────────────────────────────────────────────
function validateConfig() {
  const errors = [];

  const botNum = config.botNumber.replace(/[^0-9]/g, "");
  if (!botNum || botNum.length < 10) {
    errors.push("BOT_NUMBER belum diset atau tidak valid.");
    errors.push("  → Jalankan: node setup.js");
    errors.push("  → Atau isi BOT_NUMBER di file .env");
  }

  const ownerNums = config.owner.filter(n => n && n.replace(/[^0-9]/g, "").length >= 10);
  if (!ownerNums.length) {
    errors.push("OWNER_NUMBER belum diset.");
    errors.push("  → Jalankan: node setup.js");
  }

  if (errors.length) {
    console.log(chalk.red(`
╔══════════════════════════════════════════════════════════════╗
║   ❌  KONFIGURASI TIDAK LENGKAP                              ║
╠══════════════════════════════════════════════════════════════╣`));
    for (const e of errors) {
      console.log(chalk.red(`║  ${e.padEnd(62)}║`));
    }
    console.log(chalk.red(`╚══════════════════════════════════════════════════════════════╝`));
    console.log();
    process.exit(1);
  }

  if (!config.geminiKey) {
    console.log(chalk.yellow("⚠  GEMINI_API_KEY belum diset — fitur AI tidak aktif."));
    console.log(chalk.dim("   Dapatkan gratis di: https://aistudio.google.com/apikey\n"));
  }
}
validateConfig();

// ── Pastikan direktori ada ────────────────────────────────────────────────────
function ensureDirs() {
  const dirs = ["auth_info_baileys", "database", "logs", "assets/thumb"];
  for (const d of dirs) {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  }
  // Init semua database kosong jika belum ada
  const dbFiles = {
    [config.database]:   JSON.stringify({ users: {} }, null, 2),
    [config.groupDb]:    JSON.stringify({ groups: {} }, null, 2),
    [config.settingsDb]: JSON.stringify({}, null, 2),
    [config.ownerDb]:    JSON.stringify({ owners: {} }, null, 2),
    [config.premiumDb]:  JSON.stringify({ users: {} }, null, 2),
  };
  for (const [f, content] of Object.entries(dbFiles)) {
    if (!fs.existsSync(f)) {
      const dir = require("path").dirname(f);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(f, content);
    }
  }
}
ensureDirs();

// ── Tampilkan pairing code dengan kotak UI ─────────────────────────────────────
function showPairingInfo(code) {
  console.log();
  console.log(chalk.cyan("╔══════════════════════════════════════════════════════════════╗"));
  console.log(chalk.cyan("║                                                              ║"));
  console.log(chalk.cyan("║              🤖  M I N O B O T  U L T R A                   ║"));
  console.log(chalk.cyan("║              github.com/kevsoft-id/minobot                   ║"));
  console.log(chalk.cyan("║                                                              ║"));
  console.log(chalk.cyan("║   ┌──────────────────────────────────────────────────────┐   ║"));
  console.log(chalk.cyan("║   │") + "  PAIRING CODE:  " + chalk.bold.white(code.padEnd(8)) + "                            " + chalk.cyan("│   ║"));
  console.log(chalk.cyan("║   └──────────────────────────────────────────────────────┘   ║"));
  console.log(chalk.cyan("║                                                              ║"));
  console.log(chalk.cyan("║") + chalk.white("   Cara memasangkan:                                          ") + chalk.cyan("║"));
  console.log(chalk.cyan("║") + chalk.white("     1. Buka WhatsApp kamu                                    ") + chalk.cyan("║"));
  console.log(chalk.cyan("║") + chalk.white("     2. Ketuk ⋮ (tiga titik) → Setelan                        ") + chalk.cyan("║"));
  console.log(chalk.cyan("║") + chalk.white("     3. Perangkat Tertaut → Tautkan Perangkat                 ") + chalk.cyan("║"));
  console.log(chalk.cyan("║") + chalk.white("     4. Pilih  [Tautkan dengan nomor telepon]                 ") + chalk.cyan("║"));
  console.log(chalk.cyan("║") + chalk.yellow.bold("     5. Masukkan kode " + code + " di WhatsApp                  ") + chalk.cyan("║"));
  console.log(chalk.cyan("║                                                              ║"));
  console.log(chalk.cyan("║") + chalk.green("   ⏳  Menunggu pemasangan... (30 detik tersisa)              ") + chalk.cyan("║"));
  console.log(chalk.cyan("║                                                              ║"));
  console.log(chalk.cyan("╚══════════════════════════════════════════════════════════════╝"));
  console.log();
}

// ── Auto-join newsletter ──────────────────────────────────────────────────────
async function autoJoinNewsletter(sock) {
  try {
    await sock.newsletterFollow(AUTO_JOIN_NEWSLETTER);
  } catch {}
}

// ── Fungsi utama bot ──────────────────────────────────────────────────────────
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth_info_baileys");

  // Ambil versi Baileys terbaru, fallback ke versi known-good
  let version;
  try {
    const result = await fetchLatestBaileysVersion();
    version = result.version;
  } catch {
    version = [2, 3000, 1015901307];
  }
  console.log(chalk.green(`✓ Baileys versi : ${version.join(".")}`));
  console.log(chalk.green(`✓ Nomor bot     : ${config.botNumber}`));
  console.log(chalk.green(`✓ Owner         : ${config.owner.join(", ")}`));
  console.log();

  const sock = makeWASocket({
    version,
    logger,
    // QR dinonaktifkan — selalu pakai pairing code
    printQRInTerminal: false,
    auth: state,
    browser: Browsers.ubuntu("Desktop"),
    syncFullHistory: false,
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: false,
    connectTimeoutMs: 60_000,
    keepAliveIntervalMs: 15_000,
    // Cache pesan sederhana untuk reply/quote
    getMessage: async (key) => {
      return msgCache.get(key.id) || { conversation: "." };
    },
  });

  // Flag agar pairing code hanya diminta sekali
  let pairingCodeRequested = false;

  // ── Event: koneksi ────────────────────────────────────────────────────────
  sock.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {

    // ── Pairing code dipicu oleh event QR ─────────────────────────────────
    // Saat Baileys siap auth, ia mengirim event qr.
    // Kita intercept qr tersebut dan gunakan pairing code sebagai gantinya.
    if (qr && !pairingCodeRequested && !sock.authState.creds.registered) {
      pairingCodeRequested = true;
      const phoneNumber = config.botNumber.replace(/[^0-9]/g, "");

      console.log(chalk.cyan(`⏳ Meminta pairing code untuk: +${phoneNumber}...`));

      try {
        const code = await sock.requestPairingCode(phoneNumber);
        const formatted = code?.match(/.{1,4}/g)?.join("-") || code || "????????";
        showPairingInfo(formatted);
      } catch (e) {
        console.log(chalk.red(`✗ Gagal meminta pairing code: ${e.message}`));
        console.log(chalk.yellow("  Solusi:"));
        console.log(chalk.yellow("    1. Pastikan BOT_NUMBER sudah benar di .env"));
        console.log(chalk.yellow("    2. Hapus folder auth_info_baileys/ lalu restart"));
        console.log(chalk.yellow("    3. Pastikan versi WhatsApp kamu terbaru"));
      }
    }

    if (connection === "close") {
      // Baca status code dengan aman
      const boomErr = lastDisconnect?.error;
      const code    = boomErr?.output?.statusCode
        ?? (boomErr ? new Boom(boomErr).output?.statusCode : undefined);
      const reason  = (code && DisconnectReason[code]) || `kode ${code ?? "tidak diketahui"}`;

      console.log(chalk.red(`✗ Koneksi terputus: ${reason}`));

      // Kode fatal yang memerlukan hapus sesi
      const fatalCodes = [
        DisconnectReason.badSession,
        DisconnectReason.loggedOut,
        DisconnectReason.invalidSession,
      ].filter(v => v !== undefined);

      if (code !== undefined && fatalCodes.includes(code)) {
        console.log(chalk.yellow("⚠  Sesi tidak valid. Menghapus auth dan restart..."));
        try { fs.rmSync("./auth_info_baileys", { recursive: true, force: true }); } catch {}
        reconnectCount = 0;
        pairingCodeRequested = false; // izinkan pairing code baru
      }

      // Batasi reconnect
      reconnectCount++;
      if (reconnectCount > 60) {
        console.log(chalk.red("✗ Terlalu banyak reconnect. Jalankan ulang: node index.js"));
        process.exit(1);
      }

      // Backoff eksponensial (maks 30 detik)
      const delay = Math.min(3000 * reconnectCount, 30_000);
      console.log(chalk.cyan(`↺  Reconnect #${reconnectCount} dalam ${delay / 1000}s...`));
      setTimeout(startBot, delay);

    } else if (connection === "open") {
      reconnectCount = 0;
      pairingCodeRequested = false;

      const userInfo = sock.user;
      const num = (userInfo?.id || "").split(":")[0];

      // Jalankan pembersihan premium yang expired saat startup
      try { checkAllPremiumExpiry(); } catch {}

      console.log();
      console.log(chalk.green(
        "╔══════════════════════════════════════════════════════════════╗\n" +
        "║   ✅  BOT BERHASIL TERHUBUNG!                                ║\n" +
        "║                                                              ║\n" +
        `║   Nama   : ${(userInfo?.name || "-").padEnd(50)}║\n` +
        `║   Nomor  : ${num.padEnd(50)}║\n` +
        "║                                                              ║\n" +
        "║   Ketik  .menu  di WhatsApp untuk lihat semua fitur!         ║\n" +
        "╚══════════════════════════════════════════════════════════════╝"
      ));
      console.log();

      // Auto-join saluran KevSoft-ID (opsional)
      await autoJoinNewsletter(sock);
    }
  });

  // ── Event: simpan kredensial ──────────────────────────────────────────────
  sock.ev.on("creds.update", saveCreds);

  // ── Event: pesan masuk ────────────────────────────────────────────────────
  sock.ev.on("messages.upsert", async (raw) => {
    try {
      // Cache setiap pesan untuk keperluan quote/reply
      if (raw?.messages) {
        for (const msg of raw.messages) cacheMessage(msg);
      }
      await handleMessage(sock, raw, startTime);
    } catch (e) {
      console.error(chalk.red("[Handler Error]"), e.message);
    }
  });

  // ── Event: update peserta grup ────────────────────────────────────────────
  sock.ev.on("group-participants.update", async (ev) => {
    try { await handleGroupUpdate(sock, ev); } catch {}
  });

  return sock;
}

// ── Global error handler ──────────────────────────────────────────────────────
process.on("uncaughtException", (e) => {
  console.error(chalk.red("[Uncaught Exception]"), e.message);
  // Jangan exit — biarkan bot tetap jalan
});
process.on("unhandledRejection", (r) => {
  console.error(chalk.red("[Rejection]"), r?.message || String(r));
});

// ── Start ─────────────────────────────────────────────────────────────────────
startBot().catch((e) => {
  console.error(chalk.red("[Start Error]"), e.message);
  console.log(chalk.yellow("Mencoba restart dalam 5 detik..."));
  setTimeout(startBot, 5000);
});
