try { require("dotenv").config(); } catch {}

const config = {
  // ── Identitas Bot ──
  botName:     process.env.BOT_NAME     || "Mino Bot Ultra",
  botVersion:  "2.0.0",
  ownerName:   process.env.OWNER_NAME   || "kevsoft-id",
  owner:       (process.env.OWNER_NUMBER || "6281234567890").split(",").map(n => n.trim()),
  prefix:      process.env.PREFIX       || ".",
  mode:        process.env.MODE         || "public",   // public | self
  timezone:    process.env.TIMEZONE     || "Asia/Jakarta",

  // ── Nomor Bot (wajib diisi untuk pairing code) ──
  // Format: kode negara + nomor tanpa tanda + atau spasi
  // Contoh: "6281234567890" (Indonesia) atau "1234567890" (US)
  botNumber:   process.env.BOT_NUMBER   || "6281234567890",

  // ── AI Config ──
  geminiKey:   process.env.GEMINI_API_KEY || "",        // wajib untuk fitur AI
  geminiModel: process.env.GEMINI_MODEL   || "gemini-1.5-flash",
  aiPersona:   process.env.AI_PERSONA     || `Kamu adalah ${process.env.BOT_NAME || "Mino Bot Ultra"}, asisten WhatsApp yang cerdas, ramah, dan humoris. Jawab dalam Bahasa Indonesia yang santai.`,

  // ── Pesan Auto ──
  readMessage:     true,
  autoTyping:      true,
  welcomeMessage:  true,
  goodbyeMessage:  true,
  autoAI:          false,  // auto reply semua pesan di grup dengan AI

  // ── Anti-Fitur Default ──
  antiLink:    false,
  antiSpam:    true,
  spamLimit:   5,          // maks perintah per 10 detik per user
  cooldown:    2000,       // ms jeda antar perintah

  // ── Ekonomi ──
  dailyCoins:  500,
  workMinCoins: 50,
  workMaxCoins: 300,
  startCoins:  1000,

  // ── Asset ──
  thumbUrl:    "https://raw.githubusercontent.com/kevstore/Panelkev.store/refs/heads/main/IMG_20260701_210654.png",
  thumbLocal:  "./assets/thumb/kevsoft.jpg",

  // ── Database ──
  database:    "./database/users.json",
  groupDb:     "./database/groups.json",
  settingsDb:  "./database/settings.json",
};

module.exports = config;
