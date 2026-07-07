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
  Created by Kevin © 2026. All rights reserved.
  🌐 https://github.com/kevsoft-id/minobot
  ===========================================================
*/

// .env di-load oleh index.js sebelum require('./config')
// Tapi load lagi di sini agar config.js bisa di-require secara mandiri
try { require("dotenv").config(); } catch {}

const config = {
  // ── Identitas Bot ──────────────────────────────────────────────────────────
  botName:    process.env.BOT_NAME    || "Mino Bot Ultra",
  botVersion: "2.0.0",
  ownerName:  process.env.OWNER_NAME  || "KevSoft-ID",

  // Nomor owner — bisa lebih dari satu, pisahkan dengan koma di .env
  // Contoh: OWNER_NUMBER=6281234567890,6289876543210
  owner: (process.env.OWNER_NUMBER || "")
    .split(",")
    .map(n => n.replace(/[^0-9]/g, "").trim())
    .filter(n => n.length >= 10),

  prefix:   process.env.PREFIX   || ".",
  mode:     process.env.MODE     || "public",   // public | self
  timezone: process.env.TIMEZONE || "Asia/Jakarta",

  // ── Nomor Bot (untuk pairing code) ────────────────────────────────────────
  // Wajib diisi! Set via: node setup.js  atau  isi BOT_NUMBER di .env
  // Format: kode negara + nomor tanpa + atau spasi. Contoh: 6281234567890
  botNumber: (process.env.BOT_NUMBER || "").replace(/[^0-9]/g, ""),

  // ── AI Gemini ──────────────────────────────────────────────────────────────
  geminiKey:   process.env.GEMINI_API_KEY || "",
  geminiModel: process.env.GEMINI_MODEL   || "gemini-1.5-flash",
  aiPersona:   process.env.AI_PERSONA
    || `Kamu adalah ${process.env.BOT_NAME || "Mino Bot Ultra"}, asisten WhatsApp yang cerdas, ramah, dan humoris oleh ${process.env.OWNER_NAME || "KevSoft-ID"}. Jawab dalam Bahasa Indonesia yang santai.`,

  // ── Fitur Auto ────────────────────────────────────────────────────────────
  readMessage:    process.env.AUTO_READ    !== "false",
  autoTyping:     process.env.AUTO_TYPING  !== "false",
  welcomeMessage: true,
  goodbyeMessage: true,
  autoAI:         process.env.AUTO_AI     === "true",

  // ── Anti-Fitur ────────────────────────────────────────────────────────────
  antiLink:  process.env.ANTI_LINK  === "true",
  antiSpam:  process.env.ANTI_SPAM  !== "false",
  spamLimit: parseInt(process.env.SPAM_LIMIT || "5", 10),
  cooldown:  2000, // ms jeda minimum antar perintah

  // ── Ekonomi ───────────────────────────────────────────────────────────────
  dailyCoins:   parseInt(process.env.DAILY_COINS    || "500",  10),
  startCoins:   parseInt(process.env.START_COINS    || "1000", 10),
  workMinCoins: parseInt(process.env.WORK_MIN_COINS || "50",   10),
  workMaxCoins: parseInt(process.env.WORK_MAX_COINS || "300",  10),

  // ── Asset ─────────────────────────────────────────────────────────────────
  thumbUrl:   "https://raw.githubusercontent.com/kevstore/Panelkev.store/refs/heads/main/IMG_20260701_210654.png",
  thumbLocal: "./assets/thumb/kevsoft.jpg",

  // ── Database ──────────────────────────────────────────────────────────────
  database:   "./database/users.json",
  groupDb:    "./database/groups.json",
  settingsDb: "./database/settings.json",
};

module.exports = config;
