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
