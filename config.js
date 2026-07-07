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

try { require("dotenv").config(); } catch {}

const config = {
  // ── Identitas Bot ─────────────────────────────────────────────────────────
  botName:    process.env.BOT_NAME    || "Mino Bot Ultra",
  botVersion: "2.0.0",
  ownerName:  process.env.OWNER_NAME  || "KevSoft-ID",

  owner: (process.env.OWNER_NUMBER || "")
    .split(",")
    .map(n => n.replace(/[^0-9]/g, "").trim())
    .filter(n => n.length >= 10),

  prefix:   process.env.PREFIX   || ".",
  mode:     process.env.MODE     || "public",
  timezone: process.env.TIMEZONE || "Asia/Jakarta",

  // ── Nomor Bot ─────────────────────────────────────────────────────────────
  botNumber: (process.env.BOT_NUMBER || "").replace(/[^0-9]/g, ""),

  // ── AI Gemini ─────────────────────────────────────────────────────────────
  geminiKey:   process.env.GEMINI_API_KEY || "",
  geminiModel: process.env.GEMINI_MODEL   || "gemini-1.5-flash",
  aiPersona:   process.env.AI_PERSONA
    || `Kamu adalah ${process.env.BOT_NAME || "Mino Bot Ultra"}, asisten WhatsApp yang cerdas, ramah, dan humoris oleh ${process.env.OWNER_NAME || "KevSoft-ID"}. Jawab dalam Bahasa Indonesia yang santai.`,

  // ── Fitur Auto ────────────────────────────────────────────────────────────
  readMessage: process.env.AUTO_READ   !== "false",
  autoTyping:  process.env.AUTO_TYPING !== "false",
  autoAI:      process.env.AUTO_AI     === "true",

  // ── Anti-Fitur ────────────────────────────────────────────────────────────
  antiLink:  process.env.ANTI_LINK  === "true",
  antiSpam:  process.env.ANTI_SPAM  !== "false",
  spamLimit: parseInt(process.env.SPAM_LIMIT || "5", 10),
  cooldown:  2000,

  // ── Ekonomi ───────────────────────────────────────────────────────────────
  dailyCoins:   parseInt(process.env.DAILY_COINS    || "500",  10),
  startCoins:   parseInt(process.env.START_COINS    || "1000", 10),
  workMinCoins: parseInt(process.env.WORK_MIN_COINS || "50",   10),
  workMaxCoins: parseInt(process.env.WORK_MAX_COINS || "300",  10),

  // ── Sistem Limit ──────────────────────────────────────────────────────────
  limitFree:          parseInt(process.env.LIMIT_FREE    || "25",  10),  // limit/hari user biasa
  limitPremium:       parseInt(process.env.LIMIT_PREMIUM || "200", 10),  // limit/hari premium
  limitClaimBonus:    parseInt(process.env.LIMIT_CLAIM_BONUS || "15", 10), // bonus per .claimlimit
  limitClaimCooldown: parseInt(process.env.LIMIT_CLAIM_CD   || String(6 * 3600 * 1000), 10), // 6 jam
  limitBuyCost:       parseInt(process.env.LIMIT_BUY_COST   || "100", 10), // koin per paket
  limitBuyAmount:     parseInt(process.env.LIMIT_BUY_AMOUNT || "10",  10), // limit per paket

  // ── Asset ─────────────────────────────────────────────────────────────────
  thumbUrl:   "https://raw.githubusercontent.com/kevstore/Panelkev.store/refs/heads/main/IMG_20260701_210654.png",
  thumbLocal: "./assets/thumb/kevsoft.jpg",

  // ── Database paths ─────────────────────────────────────────────────────────
  database:   "./database/users.json",
  groupDb:    "./database/groups.json",
  settingsDb: "./database/settings.json",
  ownerDb:    "./database/owners.json",
  premiumDb:  "./database/premium.json",
};

module.exports = config;
