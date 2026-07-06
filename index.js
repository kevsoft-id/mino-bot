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

try { require("dotenv").config(); } catch {}
const {
  default: makeWASocket, useMultiFileAuthState, DisconnectReason,
  fetchLatestBaileysVersion, Browsers, makeInMemoryStore,
} = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const pino = require("pino");
const fs = require("fs");
const chalk = require("chalk");
const config = require("./config");
const { handleMessage, handleGroupUpdate } = require("./handler");

const logger = pino({ level: "silent" });
const startTime = Date.now();
let reconnectCount = 0;

// Saluran yang otomatis diikuti saat bot terhubung
const AUTO_JOIN_NEWSLETTER = "120363403656957223@newsletter";

function banner() {
  console.log(chalk.cyan(`
╔══════════════════════════════════════╗
║   🤖  MINO BOT ULTRA  v2.0          ║
║       by kevsoft-id                  ║
║   150+ Fitur | AI Gemini | Anti-Err  ║
╚══════════════════════════════════════╝`));
}
banner();

function showPairingInfo(code) {
  console.log(chalk.cyan(`
╔══════════════════════════════════════════════╗
║                                              ║
║              🤖  M I N O B O T              ║
║           GitHub : @kevsoft-id               ║
║                                              ║
║         [ Pairing Code : ${chalk.bold.white(code)} ]         ║
║                                              ║
║  Buka WhatsApp:                              ║
║    Pengaturan                                ║
║    → Perangkat Tertaut                       ║
║    → Tautkan dengan nomor telepon            ║
║    → Masukkan kode di atas                   ║
║                                              ║
║  ⏳ Menunggu...                              ║
║                                              ║
╚══════════════════════════════════════════════╝`));
}

async function autoJoinNewsletter(sock) {
  try {
    await sock.newsletterFollow(AUTO_JOIN_NEWSLETTER);
    console.log(chalk.green(`✓ Bergabung ke saluran: ${AUTO_JOIN_NEWSLETTER}`));
  } catch (e) {
    // Mungkin sudah bergabung, atau versi Baileys tidak support
    if (!e.message?.includes("already")) {
      console.log(chalk.yellow(`⚠ Gagal join saluran: ${e.message}`));
    } else {
      console.log(chalk.green(`✓ Sudah bergabung ke saluran newsletter`));
    }
  }
}

async function startBot() {
  const store = makeInMemoryStore({ logger });
  ["auth_info_baileys","database","logs","assets/thumb"].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  const { state, saveCreds } = await useMultiFileAuthState("./auth_info_baileys");
  let version;
  try { ({ version } = await fetchLatestBaileysVersion()); }
  catch { version = [2,3000,1015901307]; }

  console.log(chalk.green(`✓ Baileys v${version}`));
  if (!config.geminiKey) console.log(chalk.yellow("⚠ GEMINI_API_KEY belum diset — fitur AI nonaktif"));

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    auth: state,
    browser: Browsers.macOS("Desktop"),
    syncFullHistory: false,
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: false,
    connectTimeoutMs: 60000,
    keepAliveIntervalMs: 15000,
    getMessage: async (key) => {
      try { return (await store.loadMessage(key.remoteJid, key.id))?.message || { conversation: "." }; }
      catch { return { conversation: "." }; }
    },
  });
  store.bind(sock.ev);

  // Request pairing code jika belum teregistrasi
  if (!sock.authState.creds.registered) {
    const phoneNumber = config.botNumber.replace(/[^0-9]/g, "");
    if (!phoneNumber || phoneNumber === "6281234567890") {
      console.log(chalk.red("✗ Harap isi botNumber di config.js dengan nomor WhatsApp bot Anda!"));
      console.log(chalk.yellow("  Contoh: botNumber: \"6281234567890\""));
      process.exit(1);
    }

    // Tunggu sebentar agar koneksi socket siap
    await new Promise(res => setTimeout(res, 3000));
    try {
      const code = await sock.requestPairingCode(phoneNumber);
      // Format kode menjadi XXXX-XXXX
      const formatted = code?.match(/.{1,4}/g)?.join("-") || code;
      showPairingInfo(formatted);
    } catch (e) {
      console.log(chalk.red("✗ Gagal meminta pairing code: " + e.message));
    }
  }

  sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
    if (connection === "close") {
      const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
      console.log(chalk.red(`✗ Putus: ${DisconnectReason[code] || code}`));
      if ([DisconnectReason.badSession, DisconnectReason.loggedOut, DisconnectReason.invalidSession].includes(code)) {
        try { fs.rmSync("./auth_info_baileys", { recursive: true, force: true }); } catch {}
        reconnectCount = 0;
      }
      if (++reconnectCount > 60) { console.log(chalk.red("✗ Max reconnect. Exit.")); process.exit(1); }
      setTimeout(startBot, Math.min(3000 * reconnectCount, 30000));
    } else if (connection === "open") {
      reconnectCount = 0;
      console.log(chalk.green(`✓ Terhubung: ${sock.user?.name} (${(sock.user?.id||"").split(":")[0]})`));
      console.log(chalk.cyan("✓ Mino Bot Ultra siap! Ketik .menu\n"));

      // Auto-join saluran newsletter
      await autoJoinNewsletter(sock);
    }
  });

  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("messages.upsert", raw => handleMessage(sock, raw, startTime).catch(e => console.error("[Msg]", e.message)));
  sock.ev.on("group-participants.update", ev => handleGroupUpdate(sock, ev).catch(() => {}));
}

process.on("uncaughtException", e => console.error(chalk.red("[Uncaught]"), e.message));
process.on("unhandledRejection", r => console.error(chalk.red("[Rejection]"), r?.message || r));
startBot().catch(e => { console.error(chalk.red("[Start]"), e.message); setTimeout(startBot, 5000); });
