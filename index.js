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

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  Browsers,
  makeInMemoryStore,
} = require("@whiskeysockets/baileys");
const { Boom }  = require("@hapi/boom");
const pino      = require("pino");
const fs        = require("fs");
const chalk     = require("chalk");
const config    = require("./config");
const { handleMessage, handleGroupUpdate } = require("./handler");

const logger    = pino({ level: "silent" });
const startTime = Date.now();
let reconnectCount = 0;

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
  // Init database kosong jika belum ada
  const dbFiles = {
    [config.database]:   { users: {} },
    [config.groupDb]:    { groups: {} },
    [config.settingsDb]: {},
  };
  for (const [f, def] of Object.entries(dbFiles)) {
    if (!fs.existsSync(f)) {
      const dir = require("path").dirname(f);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(f, JSON.stringify(def, null, 2));
    }
  }
}
ensureDirs();

// ── Tampilkan info pairing code ───────────────────────────────────────────────
function showPairingInfo(code) {
  console.log(chalk.cyan(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              🤖  M I N O B O T  U L T R A                   ║
║              github.com/kevsoft-id/minobot                   ║
║                                                              ║
║   ┌─────────────────────────────────────────────────────┐   ║
║   │          PAIRING CODE : ${chalk.bold.white(code.padEnd(12))}             │   ║
║   └─────────────────────────────────────────────────────┘   ║
║                                                              ║
║   Cara memasangkan:                                          ║
║     1. Buka WhatsApp                                         ║
║     2. Ketuk ⋮ → Setelan → Perangkat Tertaut                ║
║     3. Ketuk [Tautkan Perangkat]                             ║
║     4. Pilih [Tautkan dengan nomor telepon]                  ║
║     5. Masukkan kode di atas                                 ║
║                                                              ║
║   ⏳  Menunggu pemasangan...                                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`));
}

// ── Auto-join newsletter ──────────────────────────────────────────────────────
async function autoJoinNewsletter(sock) {
  try {
    await sock.newsletterFollow(AUTO_JOIN_NEWSLETTER);
    console.log(chalk.green(`✓ Bergabung ke saluran KevSoft-ID`));
  } catch (e) {
    if (!e.message?.includes("already")) {
      // Abaikan error — bukan fitur kritikal
    }
  }
}

// ── Fungsi utama bot ──────────────────────────────────────────────────────────
async function startBot() {
  const store = makeInMemoryStore({ logger });

  const { state, saveCreds } = await useMultiFileAuthState("./auth_info_baileys");

  // Ambil versi Baileys terbaru, fallback ke versi known-good
  let version;
  try {
    const result = await fetchLatestBaileysVersion();
    version = result.version;
  } catch {
    version = [2, 3000, 1015901307];
  }
  console.log(chalk.green(`✓ Baileys versi: ${version.join(".")}`));
  console.log(chalk.green(`✓ Nomor bot    : ${config.botNumber}`));
  console.log(chalk.green(`✓ Owner        : ${config.owner.join(", ")}`));
  console.log();

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    auth: state,
    browser: Browsers.macOS("Desktop"),
    syncFullHistory: false,
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: false,
    connectTimeoutMs: 60_000,
    keepAliveIntervalMs: 15_000,
    getMessage: async (key) => {
      try {
        return (await store.loadMessage(key.remoteJid, key.id))?.message
          || { conversation: "." };
      } catch {
        return { conversation: "." };
      }
    },
  });
  store.bind(sock.ev);

  // ── Request pairing code (hanya jika belum teregistrasi) ──────────────────
  if (!sock.authState.creds.registered) {
    const phoneNumber = config.botNumber.replace(/[^0-9]/g, "");

    // Tunggu sebentar agar socket siap
    await new Promise(res => setTimeout(res, 3000));

    try {
      const code = await sock.requestPairingCode(phoneNumber);
      const formatted = code?.match(/.{1,4}/g)?.join("-") || code;
      showPairingInfo(formatted || "????????");
    } catch (e) {
      console.log(chalk.red(`✗ Gagal meminta pairing code: ${e.message}`));
      console.log(chalk.yellow("  Pastikan nomor bot sudah benar di .env (BOT_NUMBER)"));
    }
  }

  // ── Event: koneksi ────────────────────────────────────────────────────────
  sock.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      // Jika muncul QR berarti ada masalah dengan pairing code
      console.log(chalk.yellow("⚠  QR Code muncul — coba hapus folder auth_info_baileys/ dan restart."));
    }

    if (connection === "close") {
      // Baca status code dengan aman — hindari wrapping ulang error yang sudah Boom
      const boomErr = lastDisconnect?.error;
      const code = boomErr?.output?.statusCode
        ?? (boomErr ? new Boom(boomErr).output?.statusCode : undefined);
      const reason = (code && DisconnectReason[code]) || `kode ${code ?? "tidak diketahui"}`;

      console.log(chalk.red(`✗ Koneksi terputus: ${reason}`));

      // Kode-kode yang memerlukan hapus sesi (guard undefined enum agar tidak false-positive)
      const fatalCodes = [
        DisconnectReason.badSession,
        DisconnectReason.loggedOut,
        DisconnectReason.invalidSession, // mungkin undefined di beberapa versi Baileys
      ].filter(v => v !== undefined);

      if (code !== undefined && fatalCodes.includes(code)) {
        console.log(chalk.yellow("⚠  Sesi tidak valid. Menghapus auth dan memulai ulang..."));
        try { fs.rmSync("./auth_info_baileys", { recursive: true, force: true }); } catch {}
        reconnectCount = 0;
      }

      // Batasi jumlah reconnect
      reconnectCount++;
      if (reconnectCount > 60) {
        console.log(chalk.red("✗ Terlalu banyak reconnect. Menghentikan bot."));
        console.log(chalk.yellow("  Jalankan ulang: node index.js"));
        process.exit(1);
      }

      // Backoff eksponensial (maks 30 detik)
      const delay = Math.min(3000 * reconnectCount, 30_000);
      console.log(chalk.cyan(`↺  Reconnect #${reconnectCount} dalam ${delay / 1000}s...`));
      setTimeout(startBot, delay);

    } else if (connection === "open") {
      reconnectCount = 0;

      const userInfo = sock.user;
      const num = (userInfo?.id || "").split(":")[0];
      console.log();
      console.log(chalk.green(`
╔══════════════════════════════════════════════════════════════╗
║   ✅  BOT BERHASIL TERHUBUNG!                                ║
║                                                              ║
║   Nama   : ${(userInfo?.name || "-").padEnd(50)}║
║   Nomor  : ${num.padEnd(50)}║
║   Ketik  .menu di WhatsApp untuk melihat semua fitur!        ║
╚══════════════════════════════════════════════════════════════╝`));
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
      await handleMessage(sock, raw, startTime);
    } catch (e) {
      console.error(chalk.red("[Handler Error]"), e.message);
    }
  });

  // ── Event: update peserta grup ────────────────────────────────────────────
  sock.ev.on("group-participants.update", async (ev) => {
    try {
      await handleGroupUpdate(sock, ev);
    } catch {}
  });
}

// ── Global error handler ──────────────────────────────────────────────────────
process.on("uncaughtException", (e) => {
  console.error(chalk.red("[Uncaught Exception]"), e.message);
  // Jangan exit — biarkan bot tetap jalan
});
process.on("unhandledRejection", (r) => {
  console.error(chalk.red("[Unhandled Rejection]"), r?.message || String(r));
});

// ── Start ─────────────────────────────────────────────────────────────────────
startBot().catch((e) => {
  console.error(chalk.red("[Start Error]"), e.message);
  setTimeout(startBot, 5000);
});
