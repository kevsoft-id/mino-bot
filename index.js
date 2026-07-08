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

  ───────────────────────────────────────────────────────────
  CATATAN PERBAIKAN (v2.1 — REWRITE KONEKSI):
  ───────────────────────────────────────────────────────────
  1. TIDAK ADA LAGI QR CODE sama sekali. Bot 100% memakai
     Pairing Code sejak baris pertama socket dibuat.
  2. Pairing code sebelumnya diminta dengan MENUNGGU event
     "qr" dari connection.update — pada banyak versi Baileys
     event ini TIDAK SELALU muncul (tergantung timing/versi),
     sehingga pairing code sering tidak tampil / bot nge-hang.
     -> Sekarang pairing code diminta LANGSUNG setelah socket
        dibuat (sesuai cara resmi dari dokumentasi Baileys),
        dengan retry otomatis kalau percobaan pertama gagal.
  3. makeInMemoryStore SUDAH TIDAK DIPAKAI SAMA SEKALI (fungsi
     ini sudah dihapus dari Baileys versi baru). Semua fitur
     yang butuh cache pesan (reply/quote, dsb) memakai cache
     Map buatan sendiri (lihat msgCache) — jadi tidak mungkin
     lagi muncul error "makeInMemoryStore is not a function".
  4. Guard modul: kalau modul baileys ternyata rusak/kosong
     (kasus umum node_modules korup), bot kasih pesan error
     yang jelas + solusi, bukan crash diam-diam.
  ===========================================================
*/

// Verifikasi watermark — WAJIB, jangan dihapus
const { verifyWatermark } = require("./lib/watermark");
verifyWatermark();

// Load .env jika ada
try { require("dotenv").config(); } catch {}

const fs       = require("fs");
const path     = require("path");
const chalk    = require("chalk");
const pino     = require("pino");
const { Boom } = require("@hapi/boom");
const readline = require("readline");

const config  = require("./config");
const { handleMessage, handleGroupUpdate } = require("./handler");
const { checkAllPremiumExpiry } = require("./lib/database");

// ── Import Baileys dengan aman ──────────────────────────────────────────────
// PENTING: makeInMemoryStore TIDAK diimpor sama sekali (sudah dihapus dari
// Baileys sejak v6.7.x). Kalau di masa depan ada modul lain / dependency lama
// yang mencoba mengimpornya, itu BUKAN dari file ini.
let baileys;
try {
  baileys = require("@whiskeysockets/baileys");
} catch (e) {
  console.error(chalk.red("\n✗ Gagal memuat modul @whiskeysockets/baileys."));
  console.error(chalk.yellow("  Kemungkinan node_modules korup / belum terinstall dengan benar."));
  console.error(chalk.yellow("  Solusi:"));
  console.error(chalk.yellow("    1. rm -rf node_modules package-lock.json"));
  console.error(chalk.yellow("    2. npm install"));
  console.error(chalk.yellow("    3. node index.js\n"));
  process.exit(1);
}

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  Browsers,
  delay,
} = baileys;

if (typeof makeWASocket !== "function") {
  console.error(chalk.red("\n✗ makeWASocket tidak ditemukan di modul Baileys yang terinstall."));
  console.error(chalk.yellow("  node_modules kemungkinan korup atau versi tidak kompatibel."));
  console.error(chalk.yellow("  Solusi cepat:"));
  console.error(chalk.yellow("    rm -rf node_modules package-lock.json && npm install\n"));
  process.exit(1);
}

const logger    = pino({ level: "silent" });
const startTime = Date.now();
let reconnectCount = 0;

// ── Cache pesan sederhana — pengganti makeInMemoryStore yang sudah dihapus Baileys ──
const msgCache = new Map();
const MSG_CACHE_MAX = 500;

function cacheMessage(msg) {
  if (!msg?.key?.id || !msg.message) return;
  msgCache.set(msg.key.id, msg.message);
  if (msgCache.size > MSG_CACHE_MAX) {
    const firstKey = msgCache.keys().next().value;
    msgCache.delete(firstKey);
  }
}

// Saluran yang otomatis diikuti saat bot terhubung (opsional)
const AUTO_JOIN_NEWSLETTER = "120363403656957223@newsletter";

// ── Banner ────────────────────────────────────────────────────────────────
function banner() {
  console.log(chalk.cyan(`
╔══════════════════════════════════════════╗
║   🤖  MINO BOT ULTRA  v2.1              ║
║       by KevSoft-ID                      ║
║   150+ Fitur | AI Gemini | Pairing Only  ║
║   github.com/kevsoft-id/minobot          ║
╚══════════════════════════════════════════╝`));
  console.log();
}
banner();

// ── Validasi konfigurasi penting ───────────────────────────────────────────
function askQuestion(query) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(query, (ans) => { rl.close(); resolve(ans); }));
}

async function validateConfig() {
  const errors = [];

  let botNum = config.botNumber.replace(/[^0-9]/g, "");
  if (!botNum || botNum.length < 10) {
    // Coba minta langsung secara interaktif alih-alih langsung exit,
    // supaya proses pairing tetap bisa lanjut tanpa harus edit .env manual dulu.
    console.log(chalk.yellow("⚠  BOT_NUMBER belum diset di .env / .env kosong."));
    const input = await askQuestion(chalk.cyan("  Masukkan nomor WhatsApp bot (contoh 6281234567890): "));
    botNum = input.replace(/[^0-9]/g, "");
    if (!botNum || botNum.length < 10) {
      errors.push("Nomor bot tidak valid. Jalankan: node setup.js");
    } else {
      config.botNumber = botNum;
      try {
        const envPath = path.join(__dirname, ".env");
        const line = `BOT_NUMBER=${botNum}\n`;
        if (fs.existsSync(envPath)) {
          let content = fs.readFileSync(envPath, "utf8");
          if (/^BOT_NUMBER=/m.test(content)) content = content.replace(/^BOT_NUMBER=.*$/m, `BOT_NUMBER=${botNum}`);
          else content += `\n${line}`;
          fs.writeFileSync(envPath, content);
        } else {
          fs.writeFileSync(envPath, line);
        }
      } catch { /* abaikan kalau gagal simpan, tidak fatal */ }
    }
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

// ── Pastikan direktori & database ada ──────────────────────────────────────
function ensureDirs() {
  const dirs = ["auth_info_baileys", "database", "logs", "assets/thumb"];
  for (const d of dirs) {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  }
  const dbFiles = {
    [config.database]:   JSON.stringify({ users: {} }, null, 2),
    [config.groupDb]:    JSON.stringify({ groups: {} }, null, 2),
    [config.settingsDb]: JSON.stringify({}, null, 2),
    [config.ownerDb]:    JSON.stringify({ owners: {} }, null, 2),
    [config.premiumDb]:  JSON.stringify({ users: {} }, null, 2),
  };
  for (const [f, content] of Object.entries(dbFiles)) {
    if (!fs.existsSync(f)) {
      const dir = path.dirname(f);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(f, content);
    }
  }
}

// ── Tampilkan pairing code dengan kotak UI ─────────────────────────────────
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
  console.log(chalk.cyan("║") + chalk.white("     2. Ketuk ⋮ (tiga titik) → Perangkat Tertaut              ") + chalk.cyan("║"));
  console.log(chalk.cyan("║") + chalk.white("     3. Tautkan Perangkat                                     ") + chalk.cyan("║"));
  console.log(chalk.cyan("║") + chalk.white("     4. Pilih  [Tautkan dengan nomor telepon]                 ") + chalk.cyan("║"));
  console.log(chalk.cyan("║") + chalk.yellow.bold("     5. Masukkan kode " + code + "                            ") + chalk.cyan("║"));
  console.log(chalk.cyan("║                                                              ║"));
  console.log(chalk.cyan("║") + chalk.green("   ⏳  Menunggu pemasangan... (kode berlaku ~60 detik)        ") + chalk.cyan("║"));
  console.log(chalk.cyan("║                                                              ║"));
  console.log(chalk.cyan("╚══════════════════════════════════════════════════════════════╝"));
  console.log();
}

// ── Auto-join newsletter ────────────────────────────────────────────────────
async function autoJoinNewsletter(sock) {
  try { await sock.newsletterFollow(AUTO_JOIN_NEWSLETTER); } catch {}
}

// ── Minta pairing code dengan retry ─────────────────────────────────────────
// Ini bagian INTI perbaikan: pairing code diminta langsung setelah socket
// dibuat (bukan menunggu event "qr" yang tidak selalu terpicu), dengan
// beberapa kali percobaan ulang kalau permintaan pertama gagal (mis. koneksi
// belum stabil / rate-limit sesaat dari WhatsApp).
async function requestPairingWithRetry(sock, phoneNumber, maxRetry = 5) {
  for (let attempt = 1; attempt <= maxRetry; attempt++) {
    if (sock.authState.creds.registered) return; // sudah login duluan

    try {
      // Beri jeda kecil supaya websocket benar-benar siap sebelum request
      await delay(attempt === 1 ? 2000 : 3000);

      if (sock.authState.creds.registered) return;

      const code = await sock.requestPairingCode(phoneNumber);
      const formatted = code?.match(/.{1,4}/g)?.join("-") || code || "????????";
      showPairingInfo(formatted);
      return; // berhasil, selesai
    } catch (e) {
      console.log(chalk.red(`✗ Gagal meminta pairing code (percobaan ${attempt}/${maxRetry}): ${e?.message || e}`));
      if (attempt === maxRetry) {
        console.log(chalk.yellow("  Solusi:"));
        console.log(chalk.yellow("    1. Pastikan BOT_NUMBER di .env benar & aktif (format: 62xxxxxxxxxx)"));
        console.log(chalk.yellow("    2. Hapus folder auth_info_baileys/ lalu jalankan ulang"));
        console.log(chalk.yellow("    3. Pastikan aplikasi WhatsApp di HP kamu versi terbaru"));
        console.log(chalk.yellow("    4. Coba lagi setelah beberapa menit (kemungkinan rate-limit WhatsApp)"));
      } else {
        console.log(chalk.cyan(`  Mencoba lagi dalam 3 detik...`));
      }
    }
  }
}

// ── Fungsi utama bot ─────────────────────────────────────────────────────────
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
    // QR TOTAL DIMATIKAN — bot ini 100% memakai Pairing Code
    printQRInTerminal: false,
    auth: state,
    browser: Browsers.ubuntu("Chrome"),
    syncFullHistory: false,
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: false,
    connectTimeoutMs: 60_000,
    keepAliveIntervalMs: 15_000,
    // Cache pesan sederhana untuk reply/quote — pengganti makeInMemoryStore
    getMessage: async (key) => {
      return msgCache.get(key.id) || { conversation: "." };
    },
  });

  // ── Minta pairing code SEGERA setelah socket dibuat ──────────────────────
  // Tidak menunggu event "qr" sama sekali — ini yang membuat pairing code
  // dulu kadang tidak muncul. Sekarang selalu dipicu di sini.
  if (!sock.authState.creds.registered) {
    const phoneNumber = config.botNumber.replace(/[^0-9]/g, "");
    console.log(chalk.cyan(`⏳ Menyiapkan pairing code untuk: +${phoneNumber}...`));
    requestPairingWithRetry(sock, phoneNumber);
  }

  // ── Event: koneksi ────────────────────────────────────────────────────────
  sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
    if (connection === "close") {
      const boomErr = lastDisconnect?.error;
      const code    = boomErr?.output?.statusCode
        ?? (boomErr ? new Boom(boomErr).output?.statusCode : undefined);
      const reason  = (code && DisconnectReason[code]) || `kode ${code ?? "tidak diketahui"}`;

      console.log(chalk.red(`✗ Koneksi terputus: ${reason}`));

      const fatalCodes = [
        DisconnectReason.badSession,
        DisconnectReason.loggedOut,
        DisconnectReason.invalidSession,
      ].filter(v => v !== undefined);

      if (code !== undefined && fatalCodes.includes(code)) {
        console.log(chalk.yellow("⚠  Sesi tidak valid. Menghapus auth dan restart..."));
        try { fs.rmSync("./auth_info_baileys", { recursive: true, force: true }); } catch {}
        reconnectCount = 0;
      }

      reconnectCount++;
      if (reconnectCount > 60) {
        console.log(chalk.red("✗ Terlalu banyak reconnect. Jalankan ulang: node index.js"));
        process.exit(1);
      }

      const delayMs = Math.min(3000 * reconnectCount, 30_000);
      console.log(chalk.cyan(`↺  Reconnect #${reconnectCount} dalam ${delayMs / 1000}s...`));
      setTimeout(startBot, delayMs);

    } else if (connection === "open") {
      reconnectCount = 0;

      const userInfo = sock.user;
      const num = (userInfo?.id || "").split(":")[0];

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

      await autoJoinNewsletter(sock);
    }
  });

  // ── Event: simpan kredensial ──────────────────────────────────────────────
  sock.ev.on("creds.update", saveCreds);

  // ── Event: pesan masuk ────────────────────────────────────────────────────
  sock.ev.on("messages.upsert", async (raw) => {
    try {
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

// ── Global error handler ─────────────────────────────────────────────────────
process.on("uncaughtException", (e) => {
  console.error(chalk.red("[Uncaught Exception]"), e.message);
  // Jangan exit — biarkan bot tetap jalan
});
process.on("unhandledRejection", (r) => {
  console.error(chalk.red("[Rejection]"), r?.message || String(r));
});

// ── Start ──────────────────────────────────────────────────────────────────
(async () => {
  await validateConfig();
  ensureDirs();
  startBot().catch((e) => {
    console.error(chalk.red("[Start Error]"), e.message);
    console.log(chalk.yellow("Mencoba restart dalam 5 detik..."));
    setTimeout(startBot, 5000);
  });
})();
