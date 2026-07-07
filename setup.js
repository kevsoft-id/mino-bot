#!/usr/bin/env node
/*
  ===========================================================
  [ WATERMARK & LICENSE NOTICE ]
  ===========================================================
  🤖 BOT NAME : MINOBOT
  👤 DEVELOPER: KEVIN (KevSoft-ID)
  🌐 GITHUB   : https://github.com/kevsoft-id
  ===========================================================
  Created by Kevin © 2026. All rights reserved.
  🌐 https://github.com/kevsoft-id/minobot
  ===========================================================
*/

"use strict";

const readline = require("readline");
const fs       = require("fs");
const path     = require("path");
const { execSync, spawn } = require("child_process");

// ── Warna ANSI (tidak butuh chalk) ─────────────────────────────────────────
const C = {
  reset:  "\x1b[0m",
  bold:   "\x1b[1m",
  dim:    "\x1b[2m",
  red:    "\x1b[31m",
  green:  "\x1b[32m",
  yellow: "\x1b[33m",
  blue:   "\x1b[34m",
  magenta:"\x1b[35m",
  cyan:   "\x1b[36m",
  white:  "\x1b[37m",
  bgBlue: "\x1b[44m",
  bgGreen:"\x1b[42m",
};
const c  = (color, str) => `${C[color]}${str}${C.reset}`;
const cb = (color, str) => `${C.bold}${C[color]}${str}${C.reset}`;

// ── Readline helper ──────────────────────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question, def = "") {
  return new Promise(resolve => {
    const defHint = def ? c("dim", ` [${def}]`) : "";
    rl.question(`  ${c("cyan","›")} ${question}${defHint}: `, ans => {
      resolve(ans.trim() || def);
    });
  });
}

function askSelect(question, options, def = 0) {
  return new Promise(resolve => {
    console.log(`\n  ${c("cyan","›")} ${question}`);
    options.forEach((o, i) => {
      const marker = i === def ? c("green", "●") : c("dim", "○");
      console.log(`    ${marker} [${i + 1}] ${o}`);
    });
    rl.question(`  ${c("cyan","›")} Pilihan [1-${options.length}] (default ${def + 1}): `, ans => {
      const idx = parseInt(ans.trim()) - 1;
      resolve((idx >= 0 && idx < options.length) ? idx : def);
    });
  });
}

function askYN(question, def = true) {
  return new Promise(resolve => {
    const hint = def ? c("dim", " [Y/n]") : c("dim", " [y/N]");
    rl.question(`  ${c("cyan","›")} ${question}${hint}: `, ans => {
      const a = ans.trim().toLowerCase();
      if (!a) resolve(def);
      else resolve(a === "y" || a === "yes");
    });
  });
}

// ── Banner ────────────────────────────────────────────────────────────────────
function clearScreen() { process.stdout.write("\x1Bc"); }

function printBanner() {
  clearScreen();
  console.log(cb("cyan", `
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   ███╗   ███╗██╗███╗   ██╗ ██████╗ ██████╗  ██████╗ ████████╗  ║
║   ████╗ ████║██║████╗  ██║██╔═══██╗██╔══██╗██╔═══██╗╚══██╔══╝  ║
║   ██╔████╔██║██║██╔██╗ ██║██║   ██║██████╔╝██║   ██║   ██║     ║
║   ██║╚██╔╝██║██║██║╚██╗██║██║   ██║██╔══██╗██║   ██║   ██║     ║
║   ██║ ╚═╝ ██║██║██║ ╚████║╚██████╔╝██████╔╝╚██████╔╝   ██║     ║
║   ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═════╝  ╚═════╝    ╚═╝     ║
║                                                          ║
║       🤖  WhatsApp Bot by KevSoft-ID  •  v2.0           ║
║       📦  150+ Fitur  •  AI Gemini  •  Anti-Error        ║
║       🌐  github.com/kevsoft-id/minobot                  ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝`));
  console.log();
}

function printSection(title) {
  console.log();
  console.log(cb("yellow", `  ┌─────────────────────────────────────────┐`));
  console.log(cb("yellow", `  │  ${title.padEnd(41)}│`));
  console.log(cb("yellow", `  └─────────────────────────────────────────┘`));
  console.log();
}

function printOk(msg)   { console.log(`  ${c("green", "✓")} ${msg}`); }
function printWarn(msg) { console.log(`  ${c("yellow", "⚠")} ${msg}`); }
function printErr(msg)  { console.log(`  ${c("red", "✗")} ${msg}`); }
function printInfo(msg) { console.log(`  ${c("cyan", "ℹ")} ${msg}`); }

// ── Cek platform ─────────────────────────────────────────────────────────────
function detectPlatform() {
  try {
    if (fs.existsSync("/data/data/com.termux")) return "termux";
    const uname = execSync("uname -s 2>/dev/null", { encoding:"utf8" }).trim();
    if (uname === "Darwin") return "macos";
    if (fs.existsSync("/etc/debian_version")) return "debian";
    if (fs.existsSync("/etc/redhat-release")) return "redhat";
  } catch {}
  return "unknown";
}

// ── Validasi nomor ────────────────────────────────────────────────────────────
function validatePhone(num) {
  const clean = num.replace(/[^0-9]/g, "");
  if (clean.length < 10 || clean.length > 15) return null;
  return clean;
}

// ── Tulis .env ────────────────────────────────────────────────────────────────
function writeEnv(data) {
  const lines = [
    "# ═══════════════════════════════════════════════════════",
    "#   MINO BOT ULTRA — File konfigurasi .env",
    "#   Di-generate otomatis oleh setup.js",
    "#   Jangan bagikan file ini kepada siapapun!",
    "# ═══════════════════════════════════════════════════════",
    "",
    "# ── Identitas Bot ──",
    `BOT_NAME=${data.botName}`,
    `BOT_NUMBER=${data.botNumber}`,
    `OWNER_NAME=${data.ownerName}`,
    `OWNER_NUMBER=${data.ownerNumbers.join(",")}`,
    `PREFIX=${data.prefix}`,
    `MODE=${data.mode}`,
    `TIMEZONE=${data.timezone}`,
    "",
    "# ── AI Gemini (opsional, tapi wajib untuk fitur AI) ──",
    `GEMINI_API_KEY=${data.geminiKey || ""}`,
    `GEMINI_MODEL=${data.geminiModel}`,
    `AI_PERSONA=${data.aiPersona}`,
    "",
    "# ── Fitur ──",
    `AUTO_TYPING=${data.autoTyping}`,
    `AUTO_READ=${data.autoRead}`,
    `AUTO_AI=${data.autoAI}`,
    `ANTI_LINK=${data.antiLink}`,
    `ANTI_SPAM=${data.antiSpam}`,
    `SPAM_LIMIT=${data.spamLimit}`,
    "",
    "# ── Ekonomi ──",
    `DAILY_COINS=${data.dailyCoins}`,
    `START_COINS=${data.startCoins}`,
    `WORK_MIN_COINS=${data.workMin}`,
    `WORK_MAX_COINS=${data.workMax}`,
    "",
    "# ── Sistem ──",
    "NODE_ENV=production",
  ];
  fs.writeFileSync(".env", lines.join("\n"), "utf-8");
}

// ── Init direktori & database ─────────────────────────────────────────────────
function initDirectories() {
  const dirs = ["database", "logs", "auth_info_baileys", "assets/thumb"];
  for (const d of dirs) {
    if (!fs.existsSync(d)) {
      fs.mkdirSync(d, { recursive: true });
      printOk(`Direktori dibuat: ${d}`);
    }
  }
  const dbFiles = {
    "database/users.json":    JSON.stringify({ users: {} }, null, 2),
    "database/groups.json":   JSON.stringify({ groups: {} }, null, 2),
    "database/settings.json": JSON.stringify({}, null, 2),
  };
  for (const [f, content] of Object.entries(dbFiles)) {
    if (!fs.existsSync(f)) {
      fs.writeFileSync(f, content);
      printOk(`Database diinisialisasi: ${f}`);
    }
  }
}

// ── Install dependencies ──────────────────────────────────────────────────────
function installDeps() {
  const nm = path.join(__dirname, "node_modules");
  if (fs.existsSync(nm) && fs.existsSync(path.join(nm, "@whiskeysockets"))) {
    printOk("Dependencies sudah terinstall");
    return;
  }
  printInfo("Menginstall dependencies (ini bisa 2-5 menit pertama kali)...");
  try {
    execSync("npm install --production --no-fund --no-audit", {
      stdio: "inherit",
      cwd: __dirname,
    });
    printOk("Dependencies berhasil diinstall");
  } catch (e) {
    printErr("npm install gagal: " + e.message);
    printInfo("Coba jalankan manual: npm install");
    process.exit(1);
  }
}

// ── Install PM2 ───────────────────────────────────────────────────────────────
function ensurePm2() {
  try {
    execSync("pm2 --version", { stdio: "ignore" });
    printOk("PM2 sudah terinstall");
    return true;
  } catch {}
  printInfo("Menginstall PM2...");
  try {
    execSync("npm install -g pm2 --no-fund --no-audit", { stdio: "inherit" });
    printOk("PM2 berhasil diinstall");
    return true;
  } catch {
    printWarn("PM2 tidak bisa diinstall (mungkin butuh sudo). Lanjut tanpa PM2.");
    return false;
  }
}

// ── Jalankan bot dengan pairing code & tunggu koneksi ──────────────────────
function runBotPairing() {
  return new Promise((resolve) => {
    console.log();
    printInfo("Memulai bot untuk proses pairing...");
    console.log();

    const child = spawn("node", ["index.js"], {
      cwd: __dirname,
      env: { ...process.env },
      stdio: ["ignore", "pipe", "pipe"],
    });

    let connected = false;

    function onData(data) {
      const text = data.toString();
      process.stdout.write(text); // tampilkan output bot ke terminal

      // Deteksi berhasil terhubung — cocokkan dengan output index.js yang baru
      if (!connected && (
        text.includes("BOT BERHASIL TERHUBUNG") ||
        text.includes("MINO BOT ULTRA siap") ||
        text.includes("Mino Bot Ultra siap")
      )) {
        connected = true;
        setTimeout(() => {
          child.kill("SIGTERM");
          resolve({ success: true });
        }, 2500);
      }

      // Deteksi error fatal dari validateConfig() di index.js
      if (
        text.includes("KONFIGURASI TIDAK LENGKAP") ||
        text.includes("WATERMARK INTEGRITY VIOLATION")
      ) {
        child.kill("SIGTERM");
        resolve({ success: false, error: text.split("\n").find(l => l.trim()) || "Fatal error" });
      }
    }

    child.stdout.on("data", onData);
    child.stderr.on("data", onData);

    child.on("exit", (code) => {
      if (!connected) {
        resolve({ success: false, error: `Bot exit dengan kode: ${code}` });
      }
    });

    // Timeout 3 menit jika tidak ada respons
    setTimeout(() => {
      if (!connected) {
        child.kill("SIGTERM");
        resolve({ success: false, error: "Timeout menunggu koneksi" });
      }
    }, 180000);
  });
}

// ── Menu pilihan cara jalankan (promise-based) ────────────────────────────────
function showRunMenu(hasPm2) {
  return new Promise((resolve) => {
    console.log();
    console.log(cb("green", `
  ╔═══════════════════════════════════════════════════════╗
  ║   ✅  BOT BERHASIL TERHUBUNG KE WHATSAPP!            ║
  ║   Pilih cara menjalankan bot secara permanen          ║
  ╚═══════════════════════════════════════════════════════╝`));
    console.log();

    // Selalu tampilkan 4 opsi, tapi opsi PM2 di-dim jika tidak tersedia
    // Mapping tetap: 1=PM2, 2=Node, 3=Screen, 4=Selesai
    const menuRows = [
      {
        label: hasPm2
          ? "PM2    — Background, auto-restart, cocok untuk VPS (DIREKOMENDASIKAN)"
          : c("dim", "PM2    — (tidak tersedia, install dulu: npm i -g pm2)"),
        key: "pm2",
        enabled: hasPm2,
      },
      { label: "Node   — Jalankan langsung di terminal (mati jika terminal ditutup)", key: "node",   enabled: true },
      { label: "Screen — Background via screen/nohup (cocok Termux/VPS tanpa PM2)", key: "screen", enabled: true },
      { label: "Selesai — Saya akan jalankan sendiri nanti",                          key: "exit",   enabled: true },
    ];

    // Default: PM2 jika tersedia, Node jika tidak
    const defaultIdx = hasPm2 ? 1 : 2; // 1-based

    menuRows.forEach((row, i) => {
      const num = i + 1;
      const isDefault = num === defaultIdx;
      const marker = isDefault ? c("green", "●") : c("dim", "○");
      console.log(`    ${marker} [${num}] ${row.label}`);
    });

    console.log();
    rl.question(
      `  ${c("cyan","›")} Pilihan [1-4] (default ${defaultIdx}): `,
      async (ans) => {
        const raw = parseInt(ans.trim(), 10);
        const choice = (raw >= 1 && raw <= 4) ? raw : defaultIdx;
        const selected = menuRows[choice - 1]; // 0-based index

        console.log();

        if (selected.key === "pm2") {
          // ── PM2 ─────────────────────────────────────────────────────────
          console.log(cb("cyan", "  ┌── Menjalankan dengan PM2 ───────────────────────────┐"));
          try {
            execSync("pm2 start ecosystem.config.js", { stdio: "inherit", cwd: __dirname });
            execSync("pm2 save", { stdio: "inherit", cwd: __dirname });
            printOk("Bot berjalan di background dengan PM2!");
            printInfo("Perintah PM2 berguna:");
            console.log(`    pm2 logs mino-bot     ${c("dim","# lihat log real-time")}`);
            console.log(`    pm2 restart mino-bot  ${c("dim","# restart")}`);
            console.log(`    pm2 stop mino-bot     ${c("dim","# stop")}`);
            console.log(`    pm2 delete mino-bot   ${c("dim","# hapus dari PM2")}`);
          } catch (e) {
            printErr("Gagal menjalankan PM2: " + e.message);
            printInfo("Coba manual: pm2 start ecosystem.config.js");
          }
          resolve();

        } else if (selected.key === "node") {
          // ── Node langsung ────────────────────────────────────────────────
          console.log(cb("cyan", "  ┌── Menjalankan dengan Node ──────────────────────────┐"));
          printInfo("Menjalankan: node index.js");
          printWarn("Bot akan mati jika terminal ditutup!");
          console.log();
          printFinal();
          rl.close();
          // Spawn bot dengan stdio inherit (interaktif)
          const child = spawn("node", ["index.js"], {
            cwd: __dirname,
            stdio: "inherit",
            env: { ...process.env },
          });
          child.on("exit", () => process.exit(0));
          return; // jangan resolve — biarkan child process yang menentukan exit

        } else if (selected.key === "screen") {
          // ── Screen / nohup ───────────────────────────────────────────────
          console.log(cb("cyan", "  ┌── Menjalankan dengan Screen/Nohup ─────────────────┐"));
          const hasScreen = (() => {
            try { execSync("screen --version", { stdio: "ignore" }); return true; }
            catch { return false; }
          })();
          try {
            if (hasScreen) {
              execSync("screen -dmS minobot node index.js", { cwd: __dirname });
              printOk("Bot berjalan di background dengan screen!");
              console.log(`    screen -r minobot  ${c("dim","# masuk ke sesi bot")}`);
              console.log(`    Ctrl+A, D          ${c("dim","# keluar dari screen tanpa stop bot")}`);
            } else {
              printInfo("screen tidak ada, menggunakan nohup...");
              execSync("nohup node index.js > logs/nohup.out 2>&1 &", { cwd: __dirname, shell: true });
              printOk("Bot berjalan di background dengan nohup!");
              console.log(`    tail -f logs/nohup.out  ${c("dim","# lihat log")}`);
            }
          } catch (e) {
            printErr("Gagal menjalankan di background: " + e.message);
            printInfo("Coba manual: node index.js");
          }
          resolve();

        } else {
          // ── Selesai ──────────────────────────────────────────────────────
          printOk("Setup selesai! Jalankan bot kapan saja dengan:");
          console.log();
          if (hasPm2) console.log(`    ${cb("green","pm2 start ecosystem.config.js")}   ${c("dim","# background, auto-restart")}`);
          console.log(`    ${cb("green","node index.js")}                    ${c("dim","# langsung di terminal")}`);
          console.log(`    ${cb("green","bash start.sh")}                    ${c("dim","# via start script")}`);
          console.log();
          resolve();
        }
      }
    );
  });
}

function printFinal() {
  console.log();
  console.log(cb("cyan", `
  ╔═══════════════════════════════════════════════════════╗
  ║   🤖  MINO BOT ULTRA  •  Setup Selesai!              ║
  ║                                                       ║
  ║   Ketik  .menu  di WhatsApp untuk lihat semua fitur  ║
  ║   🌐  github.com/kevsoft-id/minobot                  ║
  ║   👤  Developer: KEVIN (KevSoft-ID)                  ║
  ╚═══════════════════════════════════════════════════════╝`));
  console.log();
}

// ══════════════════════════════════════════════════════════════════════════════
//   MAIN — Alur setup interaktif
// ══════════════════════════════════════════════════════════════════════════════
async function main() {
  printBanner();

  const platform = detectPlatform();
  printOk(`Platform terdeteksi: ${platform}`);
  printOk(`Node.js: ${process.version}`);

  // Cek Node.js versi
  const [major] = process.version.replace("v","").split(".").map(Number);
  if (major < 18) {
    printErr(`Node.js v${process.version} terlalu lama! Minimal Node.js v18.`);
    printInfo("Update di: https://nodejs.org");
    process.exit(1);
  }

  // ── BAGIAN 1: Nomor & Pairing ───────────────────────────────────────────
  printSection("1 / 5  ·  NOMOR BOT & PAIRING");
  printInfo("Masukkan nomor WhatsApp yang akan dijadikan bot.");
  printInfo("Format: kode negara + nomor (tanpa + atau spasi)");
  printInfo("Contoh Indonesia: 6281234567890  •  Malaysia: 60123456789");
  console.log();

  let botNumber = "";
  while (!botNumber) {
    const raw = await ask("Nomor WhatsApp bot (untuk pairing)");
    const clean = validatePhone(raw);
    if (!clean) {
      printErr("Nomor tidak valid. Gunakan format: 6281234567890");
    } else {
      botNumber = clean;
      printOk(`Nomor bot: ${botNumber}`);
    }
  }

  // ── BAGIAN 2: Owner ─────────────────────────────────────────────────────
  printSection("2 / 5  ·  DATA OWNER / DEVELOPER");
  printInfo("Nomor owner adalah nomor yang bisa menggunakan perintah admin.");
  printInfo("Bisa diisi lebih dari satu (hingga 3 nomor).");
  console.log();

  const ownerNumbers = [];

  // Owner 1 (wajib)
  let owner1 = "";
  while (!owner1) {
    const raw = await ask("Nomor owner utama (wajib)");
    const clean = validatePhone(raw);
    if (!clean) {
      printErr("Nomor tidak valid.");
    } else {
      owner1 = clean;
      ownerNumbers.push(owner1);
      printOk(`Owner 1: ${owner1}`);
    }
  }

  // Owner 2 (opsional)
  const raw2 = await ask("Nomor owner ke-2 (kosongkan jika tidak ada)");
  if (raw2) {
    const clean2 = validatePhone(raw2);
    if (clean2) { ownerNumbers.push(clean2); printOk(`Owner 2: ${clean2}`); }
    else printWarn("Nomor ke-2 tidak valid, dilewati.");
  }

  // Owner 3 (opsional)
  const raw3 = await ask("Nomor owner ke-3 (kosongkan jika tidak ada)");
  if (raw3) {
    const clean3 = validatePhone(raw3);
    if (clean3) { ownerNumbers.push(clean3); printOk(`Owner 3: ${clean3}`); }
    else printWarn("Nomor ke-3 tidak valid, dilewati.");
  }

  const ownerName = await ask("Nama owner / developer", "KevSoft-ID");

  // ── BAGIAN 3: Identitas Bot ─────────────────────────────────────────────
  printSection("3 / 5  ·  IDENTITAS BOT");

  const botName = await ask("Nama bot", "Mino Bot Ultra");

  const prefix = await ask("Prefix perintah (karakter pemicu)", ".");

  const modeIdx = await askSelect(
    "Mode bot:",
    [
      "Public  — Semua orang bisa pakai bot",
      "Self    — Hanya owner yang bisa pakai",
    ],
    0
  );
  const mode = modeIdx === 0 ? "public" : "self";
  printOk(`Mode: ${mode}`);

  const timezone = await ask("Timezone", "Asia/Jakarta");

  // ── BAGIAN 4: AI Gemini ─────────────────────────────────────────────────
  printSection("4 / 5  ·  KONFIGURASI AI GEMINI");
  printInfo("Gemini API Key dibutuhkan untuk fitur AI (.ai, .gemini, .cerita, dll).");
  printInfo("Dapatkan GRATIS di: https://aistudio.google.com/apikey");
  console.log();

  const geminiKey = await ask("Gemini API Key (kosongkan jika belum punya / skip)");
  if (!geminiKey) {
    printWarn("Gemini API Key tidak diisi. Fitur AI tidak akan aktif.");
  } else {
    printOk("Gemini API Key tersimpan.");
  }

  const modelIdx = await askSelect(
    "Model Gemini:",
    [
      "gemini-1.5-flash   — Cepat & gratis (DIREKOMENDASIKAN)",
      "gemini-1.5-pro     — Lebih canggih (kuota lebih sedikit)",
      "gemini-2.0-flash   — Terbaru & cepat",
    ],
    0
  );
  const modelMap = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash"];
  const geminiModel = modelMap[modelIdx];
  printOk(`Model: ${geminiModel}`);

  const aiPersona = await ask(
    "Persona AI (Enter untuk default)",
    `Kamu adalah ${botName}, asisten WhatsApp cerdas dan ramah oleh ${ownerName}. Jawab dalam Bahasa Indonesia santai.`
  );

  // ── BAGIAN 5: Pengaturan Fitur ──────────────────────────────────────────
  printSection("5 / 5  ·  PENGATURAN FITUR & EKONOMI");

  const autoTyping = await askYN("Auto typing saat bot memproses perintah?", true);
  const autoRead   = await askYN("Auto read message (tanda centang biru)?", true);
  const autoAI     = await askYN("Auto AI di grup (balas semua pesan dengan AI)?", false);
  const antiLink   = await askYN("Anti-link di grup (hapus link WhatsApp otomatis)?", false);
  const antiSpam   = await askYN("Anti-spam (batasi frekuensi perintah per user)?", true);

  let spamLimit = 5;
  if (antiSpam) {
    const sl = await ask("Batas perintah per 10 detik (anti-spam limit)", "5");
    spamLimit = parseInt(sl) || 5;
    printOk(`Spam limit: ${spamLimit} perintah / 10 detik`);
  }

  console.log();
  printInfo("Konfigurasi ekonomi (koin virtual dalam game bot):");
  const dailyCoins = parseInt(await ask("Koin harian (.daily)", "500")) || 500;
  const startCoins = parseInt(await ask("Koin awal saat user pertama pakai bot", "1000")) || 1000;
  const workMin    = parseInt(await ask("Koin minimum dari .work", "50")) || 50;
  const workMax    = parseInt(await ask("Koin maksimum dari .work", "300")) || 300;

  // ── Konfirmasi & Simpan ──────────────────────────────────────────────────
  printSection("📋  RINGKASAN KONFIGURASI");

  const summary = [
    ["Nama Bot",          botName],
    ["Nomor Bot",         botNumber],
    ["Prefix",           prefix],
    ["Mode",             mode],
    ["Timezone",         timezone],
    ["Owner",            ownerNumbers.join(", ")],
    ["Nama Owner",       ownerName],
    ["Gemini API Key",   geminiKey ? `${geminiKey.substring(0, 8)}...` : c("dim", "(kosong)")],
    ["Model Gemini",     geminiModel],
    ["Auto Typing",      autoTyping ? c("green","✓") : c("dim","✗")],
    ["Auto Read",        autoRead   ? c("green","✓") : c("dim","✗")],
    ["Auto AI Grup",     autoAI     ? c("green","✓") : c("dim","✗")],
    ["Anti Link",        antiLink   ? c("green","✓") : c("dim","✗")],
    ["Anti Spam",        antiSpam   ? c("green","✓") : c("dim","✗")],
    ["Daily Coins",      dailyCoins],
    ["Start Coins",      startCoins],
  ];
  for (const [k, v] of summary) {
    console.log(`  ${c("dim","│")} ${k.padEnd(18)} : ${cb("white", String(v))}`);
  }
  console.log();

  const confirm = await askYN("Simpan konfigurasi dan lanjutkan instalasi?", true);
  if (!confirm) {
    printWarn("Instalasi dibatalkan. Jalankan setup.js lagi untuk memulai ulang.");
    rl.close();
    process.exit(0);
  }

  // ── Proses Instalasi ────────────────────────────────────────────────────
  printSection("⚙️   PROSES INSTALASI");

  // 1. Tulis .env
  const envData = {
    botName, botNumber, ownerName, ownerNumbers, prefix, mode, timezone,
    geminiKey, geminiModel, aiPersona,
    autoTyping, autoRead, autoAI, antiLink, antiSpam, spamLimit,
    dailyCoins, startCoins, workMin, workMax,
  };
  writeEnv(envData);
  // Reload env agar langsung aktif
  try { require("dotenv").config(); } catch {}
  printOk(".env berhasil dibuat");

  // 2. Direktori & database
  initDirectories();

  // 3. npm install
  installDeps();

  // 4. PM2
  printInfo("Mengecek PM2...");
  const hasPm2 = ensurePm2();

  // ── Pairing ─────────────────────────────────────────────────────────────
  printSection("📱  PAIRING WHATSAPP");
  printInfo("Bot akan dijalankan sebentar untuk mendapatkan pairing code.");
  printInfo("Buka WhatsApp → Setelan → Perangkat Tertaut → Tautkan dengan nomor telepon");
  printInfo("Masukkan kode 8 digit yang akan muncul di bawah.");
  console.log();

  const pairingResult = await runBotPairing();

  if (!pairingResult.success) {
    console.log();
    printErr("Pairing gagal atau timeout.");
    printErr(pairingResult.error || "");
    printInfo("Coba jalankan manual: node index.js");
    printInfo("Pastikan nomor bot sudah benar dan WhatsApp aktif.");
    console.log();
    const tryAgain = await askYN("Mau coba lagi?", true);
    if (tryAgain) {
      rl.close();
      // Restart setup
      const { execFileSync } = require("child_process");
      execFileSync(process.execPath, [__filename], { stdio: "inherit" });
      return;
    }
    printFinal();
    rl.close();
    process.exit(0);
  }

  // ── Pilih cara jalankan ──────────────────────────────────────────────────
  await showRunMenu(hasPm2);

  // Selesai
  printFinal();
  rl.close();
  process.exit(0);
}

main().catch(err => {
  console.error(c("red", "\n✗ Setup error: " + err.message));
  process.exit(1);
});
