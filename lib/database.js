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
const fs   = require("fs");
const path = require("path");
const config = require("../config");

// ══════════════════════════════════════════════════════════════════════════════
//  PRIMITIF: load / save JSON
// ══════════════════════════════════════════════════════════════════════════════
function load(filePath, def = {}) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(def, null, 2));
      return JSON.parse(JSON.stringify(def));
    }
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch { return JSON.parse(JSON.stringify(def)); }
}

function save(filePath, data) {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (e) { console.error("[DB]", e.message); }
}

/** Normalkan nomor: hapus semua non-digit, ambil sebelum titik dua */
function norm(jid) {
  return (jid || "").replace(/@.+/, "").split(":")[0].replace(/[^0-9]/g, "");
}

// ══════════════════════════════════════════════════════════════════════════════
//  USER DB  (database/users.json)
// ══════════════════════════════════════════════════════════════════════════════
const USER_DEF = {
  id: "", coins: 0, premium: false,
  banned: false, banned_until: 0,
  lastCmd: 0, lastDaily: 0, lastWork: 0, lastRob: 0,
  warn: 0, level: 1, xp: 0,
  customBg: "", bio: "",
  inventory: [],
  stats: { cmds: 0, games_played: 0, games_won: 0 },
  // ── Sistem Limit ──
  limit: null,          // null = belum diinit (akan diisi dari getLimit())
  limitTotal: null,
  limitResetAt: 0,      // timestamp reset berikutnya
  lastClaimLimit: 0,    // timestamp terakhir .claimlimit
};

function _getDb()      { return load(config.database,  { users: {} }); }
function _saveDb(db)   { save(config.database, db); }

function getUser(jid) {
  const id = norm(jid);
  if (!id) return { ...USER_DEF };
  const db = _getDb();
  if (!db.users[id]) db.users[id] = { ...USER_DEF, id, coins: config.startCoins };
  const u = db.users[id];
  for (const k of Object.keys(USER_DEF)) if (u[k] === undefined) u[k] = USER_DEF[k];
  db.users[id] = u;
  _saveDb(db);
  return u;
}

function saveUser(jid, data) {
  const id = norm(jid);
  if (!id) return;
  const db = _getDb();
  db.users[id] = { ...(db.users[id] || { ...USER_DEF, id }), ...data };
  _saveDb(db);
}

function getAllUsers() { return _getDb().users; }

// ══════════════════════════════════════════════════════════════════════════════
//  OWNER DB  (database/owners.json)
//  Owner "super" tetap dari config.owner (env).
//  Owner "sub" bisa ditambah/hapus via .addowner / .delowner → disimpan di DB.
// ══════════════════════════════════════════════════════════════════════════════
const OWNER_DB = () => config.ownerDb || "./database/owners.json";

function _getOwnerDb()    { return load(OWNER_DB(), { owners: {} }); }
function _saveOwnerDb(db) { save(OWNER_DB(), db); }

/**
 * Cek apakah jid adalah owner (config + database gabungan).
 * Ini adalah fungsi utama untuk semua cek owner di handler.
 */
function isDynOwner(jid) {
  const id = norm(jid);
  const db = _getOwnerDb();
  return !!db.owners[id];
}

function addOwner(jid, { addedBy = "", note = "Sub Owner" } = {}) {
  const id = norm(jid);
  if (!id) return false;
  // Jangan bisa add super owner (dari config) — sudah permanen
  if ((config.owner || []).includes(id)) return "superowner";
  const db = _getOwnerDb();
  if (db.owners[id]) return "exists";
  db.owners[id] = { id, addedBy: norm(addedBy), addedAt: Date.now(), note };
  _saveOwnerDb(db);
  return true;
}

function removeOwner(jid) {
  const id = norm(jid);
  const db = _getOwnerDb();
  if (!db.owners[id]) return false;
  delete db.owners[id];
  _saveOwnerDb(db);
  return true;
}

function getAllOwners() { return _getOwnerDb().owners; }

// ══════════════════════════════════════════════════════════════════════════════
//  PREMIUM DB  (database/premium.json)
//  Terpisah dari users.json agar mudah list & expire.
//  Field premium di users.json tetap disync otomatis.
// ══════════════════════════════════════════════════════════════════════════════
const PREM_DB = () => config.premiumDb || "./database/premium.json";

function _getPremDb()    { return load(PREM_DB(), { users: {} }); }
function _savePremDb(db) { save(PREM_DB(), db); }

/**
 * Parsing durasi: "1d"=1 hari, "7d"=1 minggu, "30d"=1 bulan,
 * "perm"/"selamanya"/"-1" = permanent.
 * Return ms atau -1 untuk permanent.
 */
function parseDuration(str) {
  if (!str) return null;
  const s = String(str).toLowerCase().trim();
  if (["perm","permanent","selamanya","-1","∞"].includes(s)) return -1;
  const match = s.match(/^(\d+)(d|h|w|m|y)$/);
  if (!match) return null;
  const [, n, unit] = match;
  const num = parseInt(n, 10);
  const map = { d: 86400000, h: 3600000, w: 604800000, m: 2592000000, y: 31536000000 };
  return num * (map[unit] || 86400000);
}

function durationLabel(ms) {
  if (ms === -1) return "Permanent ♾️";
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  if (d >= 365) return `${Math.floor(d / 365)} tahun`;
  if (d >= 30)  return `${Math.floor(d / 30)} bulan`;
  if (d >= 7)   return `${Math.floor(d / 7)} minggu`;
  if (d > 0)    return `${d} hari`;
  return `${h} jam`;
}

/**
 * Tambah atau perpanjang premium.
 * @param {string} jid
 * @param {string} duration — "1d","7d","30d","perm", dll
 * @param {string} addedBy — jid owner yang menambahkan
 * @returns {{ ok: boolean, until: number, label: string }}
 */
function addPremium(jid, duration = "30d", addedBy = "") {
  const id = norm(jid);
  if (!id) return { ok: false };
  const ms = parseDuration(duration);
  if (ms === null) return { ok: false, reason: "durasi_invalid" };

  const db  = _getPremDb();
  const now = Date.now();
  const until = ms === -1 ? -1 : now + ms;

  db.users[id] = {
    id,
    since: now,
    until,
    duration,
    durationMs: ms,
    addedBy: norm(addedBy),
  };
  _savePremDb(db);

  // Sync ke users.json
  const u = getUser(id);
  saveUser(id, { ...u, premium: true });

  return { ok: true, until, label: durationLabel(ms) };
}

function removePremium(jid) {
  const id = norm(jid);
  const db = _getPremDb();
  if (!db.users[id]) return false;
  delete db.users[id];
  _savePremDb(db);
  // Sync ke users.json
  const u = getUser(id);
  saveUser(id, { ...u, premium: false });
  return true;
}

/**
 * Cek dan hapus premium yang sudah expire (auto-remove).
 * Panggil ini di handler sebelum cek premium.
 */
function checkPremiumExpiry(jid) {
  const id = norm(jid);
  const db = _getPremDb();
  const entry = db.users[id];
  if (!entry) return;
  if (entry.until === -1) return; // permanent, skip
  if (Date.now() > entry.until) {
    delete db.users[id];
    _savePremDb(db);
    // Sync
    const u = getUser(id);
    if (u.premium) saveUser(id, { ...u, premium: false });
  }
}

/** Jalankan expiry check untuk semua user premium (panggil saat startup / periodic) */
function checkAllPremiumExpiry() {
  const db = _getPremDb();
  const now = Date.now();
  let changed = false;
  for (const [id, entry] of Object.entries(db.users)) {
    if (entry.until !== -1 && now > entry.until) {
      delete db.users[id];
      changed = true;
      const u = getUser(id);
      if (u.premium) saveUser(id, { ...u, premium: false });
    }
  }
  if (changed) _savePremDb(db);
}

function getAllPremium() { return _getPremDb().users; }

function getPremiumInfo(jid) {
  const id = norm(jid);
  checkPremiumExpiry(id);
  return _getPremDb().users[id] || null;
}

// ══════════════════════════════════════════════════════════════════════════════
//  SISTEM LIMIT  (disimpan di users.json per user)
//  Free   : config.limitFree  (default 25) per hari
//  Premium: config.limitPremium (default 200) per hari
//  Owner  : unlimited (handler yang cek)
// ══════════════════════════════════════════════════════════════════════════════

const DAY_MS = 24 * 60 * 60 * 1000;

/** Ambil batas dasar sesuai tipe user */
function _baseLimit(isPremium) {
  return isPremium
    ? (config.limitPremium  || 200)
    : (config.limitFree     || 25);
}

/**
 * Ambil info limit user (reset otomatis jika hari baru).
 * @returns {{ remaining, total, resetAt, lastClaim, isPremium }}
 */
function getLimit(jid) {
  const id   = norm(jid);
  const u    = getUser(id);
  const now  = Date.now();
  const base = _baseLimit(u.premium);

  // Reset harian
  if (!u.limitResetAt || now >= u.limitResetAt) {
    const newReset = new Date().setHours(24, 0, 0, 0); // tengah malam berikutnya
    saveUser(id, {
      ...u,
      limit: base,
      limitTotal: base,
      limitResetAt: newReset,
    });
    return { remaining: base, total: base, resetAt: newReset, lastClaim: u.lastClaimLimit || 0, isPremium: u.premium };
  }

  const remaining = u.limit !== null ? u.limit : base;
  const total     = u.limitTotal !== null ? u.limitTotal : base;
  return { remaining, total, resetAt: u.limitResetAt, lastClaim: u.lastClaimLimit || 0, isPremium: u.premium };
}

/**
 * Kurangi 1 limit. Kembalikan { ok, remaining, total, resetAt }.
 * Jika limit habis, kembalikan ok:false.
 */
function useLimit(jid) {
  const id  = norm(jid);
  const inf = getLimit(id);               // pastikan reset sudah dilakukan
  const u   = getUser(id);

  if (inf.remaining <= 0) {
    return { ok: false, remaining: 0, total: inf.total, resetAt: inf.resetAt };
  }

  const newRemaining = inf.remaining - 1;
  saveUser(id, { ...u, limit: newRemaining });
  return { ok: true, remaining: newRemaining, total: inf.total, resetAt: inf.resetAt };
}

/**
 * Claim bonus limit harian (cooldown terpisah dari reset harian).
 * @returns {{ ok, bonus, remaining, cooldownLeft }}
 */
function claimLimit(jid) {
  const id  = norm(jid);
  const now = Date.now();
  const cd  = config.limitClaimCooldown || 6 * 3600 * 1000;
  const bonus = config.limitClaimBonus  || 15;

  // Baca cooldown dari user SEBELUM getLimit (agar tidak overwrite reset)
  const uRaw = getUser(id);
  const elapsed = now - (uRaw.lastClaimLimit || 0);
  if (elapsed < cd) {
    return { ok: false, cooldownLeft: cd - elapsed };
  }

  // getLimit() menangani reset harian dan menyimpan ke DB terlebih dahulu
  const inf = getLimit(id);
  // Baca ulang user SETELAH getLimit() agar data limitResetAt sudah fresh
  const u   = getUser(id);

  const newRemaining = (inf.remaining || 0) + bonus;
  const newTotal     = Math.max(inf.total || 0, newRemaining);
  saveUser(id, { ...u, limit: newRemaining, limitTotal: newTotal, lastClaimLimit: now });
  return { ok: true, bonus, remaining: newRemaining };
}

/**
 * Beli tambahan limit pakai koin.
 * @returns {{ ok, bought, remaining, cost, reason }}
 */
function buyLimit(jid, qty = 1) {
  const id   = norm(jid);
  const cost = (config.limitBuyCost   || 100) * qty;
  const gain = (config.limitBuyAmount || 10)  * qty;

  // Cek koin SEBELUM getLimit (getUser saja sudah cukup untuk cek koin)
  const uCoins = getUser(id);
  if ((uCoins.coins || 0) < cost) {
    return { ok: false, reason: "kurang_koin", need: cost, have: uCoins.coins || 0 };
  }

  // getLimit() menangani reset harian dan menyimpan ke DB terlebih dahulu
  const inf = getLimit(id);
  // Baca ulang user SETELAH getLimit() agar limitResetAt sudah fresh
  const u   = getUser(id);

  const newRemaining = (inf.remaining || 0) + gain;
  const newTotal     = Math.max(inf.total || 0, newRemaining);
  saveUser(id, { ...u, coins: (u.coins || 0) - cost, limit: newRemaining, limitTotal: newTotal });
  return { ok: true, bought: gain, remaining: newRemaining, cost };
}

/**
 * Set limit user secara manual (admin).
 */
function setUserLimit(jid, amount) {
  const id = norm(jid);
  const u  = getUser(id);
  saveUser(id, { ...u, limit: amount, limitTotal: Math.max(u.limitTotal || 0, amount) });
}

/**
 * Tambah limit user (admin atau sistem).
 */
function addUserLimit(jid, amount) {
  const id  = norm(jid);
  const inf = getLimit(id);
  setUserLimit(id, (inf.remaining || 0) + amount);
}

/**
 * Reset limit user ke nilai default (admin).
 */
function resetUserLimit(jid) {
  const id = norm(jid);
  const u  = getUser(id);
  const base = _baseLimit(u.premium);
  saveUser(id, { ...u, limit: base, limitTotal: base });
}

// ══════════════════════════════════════════════════════════════════════════════
//  GROUP DB  (database/groups.json)
// ══════════════════════════════════════════════════════════════════════════════
function _getGroupDb()    { return load(config.groupDb, { groups: {} }); }
function _saveGroupDb(db) { save(config.groupDb, db); }

const GROUP_DEF = {
  id: "", antilink: false, welcome: false, goodbye: false,
  welcomeMsg: "", goodbyeMsg: "", mute: false, antinsfw: false,
  antispam: true, autoai: false, gcname: "", sewa: false, sewa_until: 0,
};

function getGroup(id) {
  const db = _getGroupDb();
  if (!db.groups[id]) db.groups[id] = { ...GROUP_DEF, id };
  const g = db.groups[id];
  for (const k of Object.keys(GROUP_DEF)) if (g[k] === undefined) g[k] = GROUP_DEF[k];
  db.groups[id] = g;
  _saveGroupDb(db);
  return g;
}

function saveGroup(id, data) {
  const db = _getGroupDb();
  db.groups[id] = { ...(db.groups[id] || { ...GROUP_DEF, id }), ...data };
  _saveGroupDb(db);
}

function getAllGroups() { return _getGroupDb().groups; }

// ══════════════════════════════════════════════════════════════════════════════
//  SETTINGS DB  (database/settings.json)
// ══════════════════════════════════════════════════════════════════════════════
function getSettings() {
  return load(config.settingsDb, {
    botName: config.botName, prefix: config.prefix, mode: config.mode,
    autoAI: config.autoAI, antiLink: config.antiLink, antiSpam: config.antiSpam,
    readMessage: config.readMessage, autoTyping: config.autoTyping,
    geminiModel: config.geminiModel,
  });
}
function saveSettings(data) { save(config.settingsDb, data); }

// ══════════════════════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════════════════════
module.exports = {
  // User
  getUser, saveUser, getAllUsers, norm,

  // Owner
  isDynOwner, addOwner, removeOwner, getAllOwners,

  // Premium
  addPremium, removePremium, getAllPremium, getPremiumInfo,
  checkPremiumExpiry, checkAllPremiumExpiry,
  parseDuration, durationLabel,

  // Limit
  getLimit, useLimit, claimLimit, buyLimit,
  setUserLimit, addUserLimit, resetUserLimit,

  // Group
  getGroup, saveGroup, getAllGroups,

  // Settings
  getSettings, saveSettings,
};
