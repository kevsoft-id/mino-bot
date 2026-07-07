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
  reset:   "\x1b[0m",
  bold:    "\x1b[1m",
  dim:     "\x1b[2m",
  red:     "\x1b[31m",
  green:   "\x1b[32m",
  yellow:  "\x1b[33m",
  blue:    "\x1b[34m",
  magenta: "\x1b[35m",
  cyan:    "\x1b[36m",
  white:   "\x1b[37m",
};
const c  = (color, str) => `${C[color]}${str}${C.reset}`;
const cb = (color, str) => `${C.bold}${C[color]}${str}${C.reset}`;

// ── Readline helper ──────────────────────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q, def = "") => new Promise(res => {
  const hint = def ? c("dim", ` [${def}]`) : "";
  rl.question(`  ${c("cyan","›")} ${q}${hint}: `, ans => res(ans.trim() || def));
});
const askYN = (q, def = true) => new Promise(res => {
  const hint = def ? c("dim"," [Y/n]") : c("dim"," [y/N]");
  rl.question(`  ${c("cyan","›")} ${q}${hint}: `, ans => {
    const a = ans.trim().toLowerCase();
    res(!a ? def : a === "y" || a === "yes");
  });
});
const askSelect = (q, opts, def = 0) => new Promise(res => {
  console.log(`\n  ${c("cyan","›")} ${q}`);
  opts.forEach((o, i) => {
    const mark = i === def ? c("green","●") : c("dim","○");
    console.log(`    ${mark} [${i+1}] ${o}`);
  });
  rl.question(`  ${c("cyan","›")} Pilih [1-${opts.length}] (default ${def+1}): `, ans => {
    const idx = parseInt(ans.trim()) - 1;
    res((idx >= 0 && idx < opts.length) ? idx : def);
  });
});

// ── Cetak ─────────────────────────────────────────────────────────────────────
const printOk   = m => console.log(`  ${c("green","✓")} ${m}`);
const printWarn = m => console.log(`  ${c("yellow","⚠")} ${m}`);
const printErr  = m => console.log(`  ${c("red","✗")} ${m}`);
const printInfo = m => console.log(`  ${c("cyan","ℹ")} ${m}`);
const printSep  = () => console.log(`  ${c("dim","─".repeat(55))}`);

function printSection(title) {
  console.log();
  console.log(cb("yellow",`  ┌─────────────────────────────────────────┐`));
  console.log(cb("yellow",`  │  ${title.padEnd(41)}│`));
  console.log(cb("yellow",`  └─────────────────────────────────────────┘`));
  console.log();
}

function printBanner() {
  process.stdout.write("\x1Bc");
  console.log(cb("cyan",`
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    🤖 MINO BOT ULTRA v2.0 — INSTALLER
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`));
  console.log();
}

// ── Deteksi platform ──────────────────────────────────────────────────────────
function detectPlatform() {
  try {
    if (fs.existsSync("/data/data/com.termux")) return "termux";
    const u = execSync("uname -s 2>/dev/null", { encoding:"utf8" }).trim();
    if (u === "Darwin") return "macos";
    if (fs.existsSync("/etc/debian_version")) return "debian/ubuntu";
    if (fs.existsSync("/etc/redhat-release")) return "redhat/centos";
  } catch {}
  return "linux";
}

// ── Validasi nomor ────────────────────────────────────────────────────────────
function validatePhone(raw) {
  const clean = raw.replace(/[^0-9]/g, "");
  if (clean.length < 10 || clean.length > 15) return null;
  return clean;
}

// ── Tulis .env ────────────────────────────────────────────────────────────────
function writeEnv(d) {
  const lines = [
    "# ══════════════════════════════════════════════════════",
    "#   MINO BOT ULTRA — Konfigurasi (.env)",
    "#   Di-generate otomatis oleh setup.js",
    "#   Jangan bagikan file ini kepada siapapun!",
    "# ══════════════════════════════════════════════════════",
    "",
    "# ── Identitas Bot ──",
    `BOT_NAME=${d.botName}`,
    `BOT_NUMBER=${d.botNumber}`,
    `OWNER_NAME=${d.ownerName}`,
    `OWNER_NUMBER=${d.ownerNumbers.join(",")}`,
    `PREFIX=${d.prefix}`,
    `MODE=${d.mode}`,
    `TIMEZONE=${d.timezone}`,
    "",
    "# ── AI Gemini ──",
    `GEMINI_API_KEY=${d.geminiKey || ""}`,
    `GEMINI_MODEL=${d.geminiModel}`,
    `AI_PERSONA=${d.aiPersona}`,
    "",
    "# ── Fitur ──",
    `AUTO_TYPING=${d.autoTyping}`,
    `AUTO_READ=${d.autoRead}`,
    `AUTO_AI=${d.autoAI}`,
    `ANTI_LINK=${d.antiLink}`,
    `ANTI_SPAM=${d.antiSpam}`,
    `SPAM_LIMIT=${d.spamLimit}`,
    "",
    "# ── Ekonomi ──",
    `DAILY_COINS=${d.dailyCoins}`,
    `START_COINS=${d.startCoins}`,
    `WORK_MIN_COINS=${d.workMin}`,
    `WORK_MAX_COINS=${d.workMax}`,
    "",
    "# ── Sistem Limit ──",
    `LIMIT_FREE=${d.limitFree}`,
    `LIMIT_PREMIUM=${d.limitPremium}`,
    `LIMIT_CLAIM_BONUS=${d.limitBonus}`,
    `LIMIT_CLAIM_CD=${d.limitCd}`,
    `LIMIT_BUY_COST=${d.limitBuyCost}`,
    `LIMIT_BUY_AMOUNT=${d.limitBuyAmount}`,
    "",
    "# ── Sistem ──",
    "NODE_ENV=production",
  ];
  fs.writeFileSync(".env", lines.join("\n"), "utf-8");
}

// ── Init direktori & database ─────────────────────────────────────────────────
function initDirectories() {
  const dirs = ["database","logs","auth_info_baileys","assets/thumb"];
  for (const d of dirs) {
    if (!fs.existsSync(d)) {
      fs.mkdirSync(d, { recursive: true });
      printOk(`Direktori dibuat: ${d}/`);
    }
  }
  const dbFiles = {
    "database/users.json":    JSON.stringify({ users: {} }, null, 2),
    "database/groups.json":   JSON.stringify({ groups: {} }, null, 2),
    "database/settings.json": JSON.stringify({}, null, 2),
    "database/owners.json":   JSON.stringify({ owners: {} }, null, 2),
    "database/premium.json":  JSON.stringify({ users: {} }, null, 2),
  };
  for (const [f, content] of Object.entries(dbFiles)) {
    if (!fs.existsSync(f)) {
      fs.writeFileSync(f, content);
      printOk(`Database: ${f}`);
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
  console.log();
  printInfo("Menginstall dependencies (bisa 2–5 menit pertama kali)...");
  try {
    execSync("npm install --production --no-fund --no-audit", {
      stdio: "inherit",
      cwd: __dirname,
    });
    printOk("Dependencies berhasil diinstall");
  } catch (e) {
    printErr("npm install gagal: " + e.message);
    printInfo("Coba manual: npm install");
    process.exit(1);
  }
}

// ── Cek PM2 ───────────────────────────────────────────────────────────────────
function ensurePm2() {
  try { execSync("pm2 --version", { stdio: "ignore" }); printOk("PM2 sudah tersedia"); return true; }
  catch {}
  printInfo("Menginstall PM2 (global)...");
  try {
    execSync("npm install -g pm2 --no-fund --no-audit", { stdio: "inherit" });
    printOk("PM2 berhasil diinstall"); return true;
  } catch {
    printWarn("PM2 gagal diinstall (mungkin butuh sudo). Lanjut tanpa PM2.");
    return false;
  }
}

// ════════════════════════════════════════════════════════════════════════════════
//  PAIRING FLOW — Jalankan bot & tampilkan pairing code ke terminal
//  Menggunakan stdio: "inherit" agar semua output bot (termasuk kotak pairing)
//  langsung terlihat oleh user tanpa buffer.
// ════════════════════════════════════════════════════════════════════════════════
function runBotPairing() {
  return new Promise((resolve) => {
    console.log();
    printInfo("Menjalankan bot untuk proses pairing...");
    printInfo("Tunggu kotak PAIRING CODE muncul di bawah ini.");
    console.log();
    printSep();
    console.log();

    // stdio: "pipe" untuk stdout/stderr agar kita bisa detect "TERHUBUNG",
    // tapi semua output diteruskan langsung ke terminal user
    const child = spawn("node", ["index.js"], {
      cwd: __dirname,
      env: { ...process.env },
      stdio: ["ignore", "pipe", "pipe"],
    });

    let connected = false;
    let outputBuf = "";

    function onData(chunk) {
      const text = chunk.toString();
      // Forward semua output ke terminal user — agar pairing code terlihat
      process.stdout.write(text);
      outputBuf += text;

      // Deteksi koneksi berhasil
      if (!connected && (
        text.includes("BOT BERHASIL TERHUBUNG") ||
        text.includes("MINO BOT ULTRA siap") ||
        outputBuf.includes("BOT BERHASIL TERHUBUNG")
      )) {
        connected = true;
        // Beri jeda 2 detik lalu matikan subprocess pairing
        setTimeout(() => {
          try { child.kill("SIGTERM"); } catch {}
          resolve({ success: true });
        }, 2500);
      }

      // Deteksi error konfigurasi fatal dari index.js
      if (text.includes("KONFIGURASI TIDAK LENGKAP") ||
          text.includes("WATERMARK INTEGRITY VIOLATION")) {
        try { child.kill("SIGTERM"); } catch {}
        resolve({ success: false, error: "Konfigurasi tidak lengkap. Jalankan setup.js ulang." });
      }
    }

    child.stdout.on("data", onData);
    child.stderr.on("data", onData);

    child.on("exit", (code) => {
      if (!connected) {
        resolve({ success: false, error: `Bot berhenti dengan kode: ${code ?? "?"}` });
      }
    });

    // Timeout 5 menit
    setTimeout(() => {
      if (!connected) {
        try { child.kill("SIGTERM"); } catch {}
        resolve({ success: false, error: "Timeout — koneksi tidak berhasil dalam 5 menit" });
      }
    }, 300_000);
  });
}

// ── Menu pilih cara jalankan ──────────────────────────────────────────────────
function showRunMenu(hasPm2) {
  return new Promise((resolve) => {
    console.log();
    console.log(cb("green",`
  ╔═══════════════════════════════════════════════════════════╗
  ║   ✅  BOT BERHASIL TERHUBUNG KE WHATSAPP!               ║
  ║   Pilih cara menjalankan bot secara permanen             ║
  ╚═══════════════════════════════════════════════════════════╝`));
    console.log();

    const menuRows = [
      {
        label: hasPm2
          ? "PM2    — Background, auto-restart, rekomen untuk VPS ⭐"
          : c("dim","PM2    — (tidak tersedia, install: npm i -g pm2)"),
        key: "pm2", enabled: hasPm2,
      },
      { label: "Node   — Jalankan di terminal (mati jika terminal ditutup)", key: "node",   enabled: true },
      { label: "Screen — Background via screen/nohup (Termux/VPS)         ", key: "screen", enabled: true },
      { label: "Selesai — Saya akan jalankan sendiri nanti                 ", key: "exit",   enabled: true },
    ];

    const defaultIdx = hasPm2 ? 1 : 2; // 1-based

    menuRows.forEach((row, i) => {
      const num  = i + 1;
      const mark = num === defaultIdx ? c("green","●") : c("dim","○");
      console.log(`    ${mark} [${num}] ${row.label}`);
    });

    console.log();
    rl.question(`  ${c("cyan","›")} Pilihan [1-4] (default ${defaultIdx}): `, async (ans) => {
      const raw    = parseInt(ans.trim(), 10);
      const choice = (raw >= 1 && raw <= 4) ? raw : defaultIdx;
      const sel    = menuRows[choice - 1];
      console.log();

      if (sel.key === "pm2") {
        console.log(cb("cyan","  ┌── PM2 ──────────────────────────────────────────────┐"));
        try {
          execSync("pm2 start ecosystem.config.js", { stdio:"inherit", cwd:__dirname });
          execSync("pm2 save", { stdio:"inherit", cwd:__dirname });
          printOk("Bot berjalan di background dengan PM2!");
          console.log(`\n    pm2 logs mino-bot     ${c("dim","# log real-time")}`);
          console.log(`    pm2 restart mino-bot  ${c("dim","# restart")}`);
          console.log(`    pm2 stop mino-bot     ${c("dim","# stop")}`);
        } catch (e) {
          printErr("PM2 gagal: " + e.message);
          printInfo("Coba manual: pm2 start ecosystem.config.js");
        }
        resolve();

      } else if (sel.key === "node") {
        console.log(cb("cyan","  ┌── Node.js ───────────────────────────────────────────┐"));
        printInfo("Menjalankan: node index.js");
        printWarn("Bot akan mati jika terminal ditutup!");
        console.log();
        printFinal();
        rl.close();
        const child = spawn("node", ["index.js"], {
          cwd: __dirname, stdio: "inherit", env: { ...process.env },
        });
        child.on("exit", () => process.exit(0));
        return; // biarkan child yang exit

      } else if (sel.key === "screen") {
        console.log(cb("cyan","  ┌── Screen/Nohup ──────────────────────────────────────┐"));
        const hasScreen = (() => {
          try { execSync("screen --version", { stdio:"ignore" }); return true; } catch { return false; }
        })();
        try {
          if (hasScreen) {
            execSync("screen -dmS minobot node index.js", { cwd:__dirname });
            printOk("Bot berjalan di background dengan screen!");
            console.log(`\n    screen -r minobot   ${c("dim","# masuk ke sesi bot")}`);
            console.log(`    Ctrl+A, D           ${c("dim","# keluar tanpa stop bot")}`);
          } else {
            printInfo("screen tidak ada, pakai nohup...");
            execSync("nohup node index.js > logs/nohup.out 2>&1 &", {
              cwd: __dirname, shell: true,
            });
            printOk("Bot berjalan di background dengan nohup!");
            console.log(`\n    tail -f logs/nohup.out  ${c("dim","# lihat log")}`);
          }
        } catch (e) {
          printErr("Gagal menjalankan background: " + e.message);
          printInfo("Coba manual: node index.js");
        }
        resolve();

      } else {
        printOk("Oke! Jalankan bot kapan saja dengan:");
        console.log();
        console.log(`    ${cb("green","node index.js")}          ${c("dim","# jalankan langsung")}`);
        console.log(`    ${cb("green","bash start.sh")}          ${c("dim","# via start script")}`);
        if (hasPm2)
          console.log(`    ${cb("green","pm2 start ecosystem.config.js")}  ${c("dim","# via PM2 (background)")}`);
        resolve();
      }
    });
  });
}

function printFinal() {
  console.log();
  console.log(cb("cyan",`
  ╔══════════════════════════════════════════════════════╗
  ║   🤖  MINO BOT ULTRA  •  Setup Selesai!             ║
  ║                                                      ║
  ║   Ketik  .menu  di WhatsApp untuk lihat fitur        ║
  ║   🌐  github.com/kevsoft-id/minobot                  ║
  ║   👤  Developer: KEVIN (KevSoft-ID)                  ║
  ╚══════════════════════════════════════════════════════╝`));
  console.log();
}

// ════════════════════════════════════════════════════════════════════════════════
//  MAIN — Alur setup interaktif
// ════════════════════════════════════════════════════════════════════════════════
async function main() {
  printBanner();

  const platform = detectPlatform();
  printOk(`Platform: ${platform}`);
  printOk(`Node.js : ${process.version}`);

  const [major] = process.version.replace("v","").split(".").map(Number);
  if (major < 18) {
    printErr(`Node.js ${process.version} terlalu lama! Minimal v18.`);
    printInfo("Update di: https://nodejs.org");
    process.exit(1);
  }

  // ── BAGIAN 1: Nomor Bot ───────────────────────────────────────────────────
  printSection("1 / 5  ·  NOMOR BOT (untuk Pairing Code)");
  printInfo("Masukkan nomor WhatsApp yang akan dijadikan bot.");
  printInfo("Format: kode negara + nomor tanpa spasi atau simbol");
  printInfo("Contoh  ID : 6281234567890");
  printInfo("Contoh  MY : 60123456789");
  console.log();

  let botNumber = "";
  while (!botNumber) {
    const raw  = await ask("Nomor WhatsApp bot");
    const clean = validatePhone(raw);
    if (!clean) printErr("Nomor tidak valid. Harus 10–15 digit angka.");
    else { botNumber = clean; printOk(`Nomor bot: +${botNumber}`); }
  }

  // ── BAGIAN 2: Owner ───────────────────────────────────────────────────────
  printSection("2 / 5  ·  NOMOR OWNER / DEVELOPER");
  printInfo("Owner bisa menggunakan semua perintah admin bot.");
  printInfo("Bisa isi hingga 3 nomor owner.");
  console.log();

  const ownerNumbers = [];

  let owner1 = "";
  while (!owner1) {
    const raw  = await ask("Nomor owner utama (wajib)");
    const clean = validatePhone(raw);
    if (!clean) printErr("Nomor tidak valid.");
    else { owner1 = clean; ownerNumbers.push(owner1); printOk(`Owner 1: +${owner1}`); }
  }

  const raw2 = await ask("Nomor owner ke-2 (kosongkan jika tidak ada)");
  if (raw2) {
    const c2 = validatePhone(raw2);
    if (c2) { ownerNumbers.push(c2); printOk(`Owner 2: +${c2}`); }
    else printWarn("Nomor ke-2 tidak valid, dilewati.");
  }

  const raw3 = await ask("Nomor owner ke-3 (kosongkan jika tidak ada)");
  if (raw3) {
    const c3 = validatePhone(raw3);
    if (c3) { ownerNumbers.push(c3); printOk(`Owner 3: +${c3}`); }
    else printWarn("Nomor ke-3 tidak valid, dilewati.");
  }

  const ownerName = await ask("Nama owner / developer", "KevSoft-ID");

  // ── BAGIAN 3: Identitas Bot ───────────────────────────────────────────────
  printSection("3 / 5  ·  IDENTITAS BOT");

  const botName  = await ask("Nama bot", "Mino Bot Ultra");
  const prefix   = await ask("Prefix perintah", ".");
  const modeIdx  = await askSelect(
    "Mode bot:",
    ["Public  — Semua orang bisa pakai", "Self    — Hanya owner yang bisa pakai"],
    0
  );
  const mode     = modeIdx === 0 ? "public" : "self";
  const timezone = await ask("Timezone", "Asia/Jakarta");
  printOk(`Mode: ${mode} | Timezone: ${timezone}`);

  // ── BAGIAN 4: AI Gemini ───────────────────────────────────────────────────
  printSection("4 / 5  ·  KONFIGURASI AI GEMINI");
  printInfo("Gemini API Key untuk fitur .ai, .gemini, .cerita, dll.");
  printInfo("Gratis di: https://aistudio.google.com/apikey");
  console.log();

  const geminiKey = await ask("Gemini API Key (Enter untuk skip)");
  if (!geminiKey) printWarn("Fitur AI tidak aktif (tidak ada API key).");
  else printOk("Gemini API Key tersimpan.");

  const modelIdx = await askSelect("Model Gemini:", [
    "gemini-1.5-flash  — Cepat & gratis (REKOMEN)",
    "gemini-1.5-pro    — Lebih canggih (kuota kecil)",
    "gemini-2.0-flash  — Terbaru & cepat",
  ], 0);
  const geminiModel = ["gemini-1.5-flash","gemini-1.5-pro","gemini-2.0-flash"][modelIdx];
  const aiPersona = await ask(
    "Persona AI (Enter untuk default)",
    `Kamu adalah ${botName}, asisten WhatsApp cerdas dan ramah oleh ${ownerName}. Jawab dalam Bahasa Indonesia santai.`
  );

  // ── BAGIAN 5: Fitur & Ekonomi ─────────────────────────────────────────────
  printSection("5 / 5  ·  FITUR, LIMIT & EKONOMI");

  const autoTyping = await askYN("Auto typing saat proses perintah?", true);
  const autoRead   = await askYN("Auto read message (centang biru)?", true);
  const autoAI     = await askYN("Auto AI di grup (balas semua pesan)?", false);
  const antiLink   = await askYN("Anti-link di grup?", false);
  const antiSpam   = await askYN("Anti-spam (batasi frekuensi perintah)?", true);

  let spamLimit = 5;
  if (antiSpam) {
    const sl = await ask("Batas perintah per 10 detik", "5");
    spamLimit = parseInt(sl) || 5;
  }

  console.log();
  printInfo("Sistem Limit (berapa perintah max per hari per user):");
  const limitFree     = parseInt(await ask("Limit harian user biasa",   "25"))  || 25;
  const limitPremium  = parseInt(await ask("Limit harian user premium", "200")) || 200;
  const limitBonus    = parseInt(await ask("Bonus per .claimlimit",      "15"))  || 15;
  const limitCd       = 6 * 3600 * 1000; // 6 jam, tidak ditanya (bisa edit .env)
  const limitBuyCost  = parseInt(await ask("Harga beli limit (koin)",   "100")) || 100;
  const limitBuyAmount= parseInt(await ask("Limit dapat per beli",       "10"))  || 10;

  console.log();
  printInfo("Ekonomi koin virtual:");
  const dailyCoins = parseInt(await ask("Koin dari .daily",   "500"))  || 500;
  const startCoins = parseInt(await ask("Koin awal user baru","1000")) || 1000;
  const workMin    = parseInt(await ask("Koin min dari .work", "50"))   || 50;
  const workMax    = parseInt(await ask("Koin max dari .work", "300"))  || 300;

  // ── Ringkasan & Konfirmasi ────────────────────────────────────────────────
  printSection("📋  RINGKASAN KONFIGURASI");

  const summary = [
    ["Nomor Bot",      `+${botNumber}`],
    ["Nama Bot",       botName],
    ["Prefix",         prefix],
    ["Mode",           mode],
    ["Timezone",       timezone],
    ["Owner",          ownerNumbers.map(n=>`+${n}`).join(", ")],
    ["Nama Owner",     ownerName],
    ["Gemini Key",     geminiKey ? `${geminiKey.slice(0,8)}…` : c("dim","(kosong)")],
    ["Model AI",       geminiModel],
    ["Limit Free",     `${limitFree}/hari`],
    ["Limit Premium",  `${limitPremium}/hari`],
    ["Claim Bonus",    `+${limitBonus} limit (cd 6j)`],
    ["Beli Limit",     `${limitBuyCost} koin → +${limitBuyAmount} limit`],
    ["Daily Coins",    dailyCoins],
    ["Start Coins",    startCoins],
  ];
  for (const [k, v] of summary)
    console.log(`  ${c("dim","│")} ${k.padEnd(14)} : ${cb("white", String(v))}`);
  console.log();

  const ok = await askYN("Simpan konfigurasi dan lanjutkan instalasi?", true);
  if (!ok) {
    printWarn("Instalasi dibatalkan. Jalankan setup.js lagi kapan saja.");
    rl.close(); process.exit(0);
  }

  // ── Proses Instalasi ──────────────────────────────────────────────────────
  printSection("⚙️   PROSES INSTALASI");

  const envData = {
    botName, botNumber, ownerName, ownerNumbers, prefix, mode, timezone,
    geminiKey, geminiModel, aiPersona,
    autoTyping, autoRead, autoAI, antiLink, antiSpam, spamLimit,
    dailyCoins, startCoins, workMin, workMax,
    limitFree, limitPremium, limitBonus, limitCd, limitBuyCost, limitBuyAmount,
  };
  writeEnv(envData);
  try { require("dotenv").config(); } catch {}
  printOk(".env berhasil dibuat");

  initDirectories();
  installDeps();

  printInfo("Mengecek PM2...");
  const hasPm2 = ensurePm2();

  // ── Pairing WhatsApp ──────────────────────────────────────────────────────
  printSection("📱  PAIRING WHATSAPP");
  printInfo(`Nomor bot yang akan dipasangkan: ${cb("white","+"+botNumber)}`);
  console.log();
  printInfo("Langkah-langkah:");
  printInfo("  1. Buka WhatsApp di HP kamu");
  printInfo("  2. Ketuk ⋮ → Setelan → Perangkat Tertaut");
  printInfo("  3. Ketuk [Tautkan Perangkat]");
  printInfo("  4. Pilih [Tautkan dengan nomor telepon]");
  printInfo("  5. Masukkan kode 8 digit yang akan muncul");
  console.log();

  const pairingResult = await runBotPairing();

  if (!pairingResult.success) {
    console.log();
    printErr("Pairing gagal atau timeout.");
    if (pairingResult.error) printErr(pairingResult.error);
    console.log();
    printInfo("Solusi:");
    printInfo("  1. Hapus folder auth_info_baileys/ lalu coba lagi");
    printInfo("  2. Pastikan nomor bot sudah benar");
    printInfo("  3. Pastikan WhatsApp kamu terbaru");
    printInfo("  4. Coba jalankan manual: node index.js");
    console.log();
    const retry = await askYN("Mau coba pairing lagi?", true);
    if (retry) {
      try { fs.rmSync("./auth_info_baileys", { recursive:true, force:true }); } catch {}
      printOk("Session lama dihapus. Mencoba ulang...");
      const retry2 = await runBotPairing();
      if (!retry2.success) {
        printErr("Pairing tetap gagal. Jalankan manual: node index.js");
      }
    } else {
      printFinal();
      rl.close();
      process.exit(0);
    }
  }

  // ── Pilih cara jalankan ───────────────────────────────────────────────────
  await showRunMenu(hasPm2);

  printFinal();
  rl.close();
  process.exit(0);
}

main().catch(err => {
  console.error(c("red", "\n✗ Setup error: " + (err.message || err)));
  process.exit(1);
});
