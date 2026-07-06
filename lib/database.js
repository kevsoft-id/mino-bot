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

const fs = require("fs");
const path = require("path");
const config = require("../config");

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

// ── User DB ──
const USER_DEF = { id:"", coins:0, premium:false, banned:false, banned_until:0,
  lastCmd:0, lastDaily:0, lastWork:0, lastRob:0, warn:0, level:1, xp:0,
  customBg:"", bio:"",
  inventory:[], stats:{ cmds:0, games_played:0, games_won:0 } };

function getDb() { return load(config.database, { users:{} }); }
function saveDb(db) { save(config.database, db); }

function getUser(jid) {
  const id = jid.replace(/@.+/,"").split(":")[0];
  const db = getDb();
  if (!db.users[id]) db.users[id] = { ...USER_DEF, id, coins: config.startCoins };
  const u = db.users[id];
  // backfill missing keys
  for (const k of Object.keys(USER_DEF)) if (u[k] === undefined) u[k] = USER_DEF[k];
  db.users[id] = u;
  saveDb(db);
  return u;
}

function saveUser(jid, data) {
  const id = jid.replace(/@.+/,"").split(":")[0];
  const db = getDb();
  db.users[id] = { ...(db.users[id] || { ...USER_DEF, id }), ...data };
  saveDb(db);
}

function getAllUsers() { return getDb().users; }

// ── Group DB ──
function getGroupDb() { return load(config.groupDb, { groups:{} }); }
function saveGroupDb(db) { save(config.groupDb, db); }

const GROUP_DEF = {
  id:"", antilink:false, welcome:false, goodbye:false,
  welcomeMsg:"", goodbyeMsg:"", mute:false, antinsfw:false,
  antispam:true, autoai:false, gcname:"", sewa:false,
  sewa_until:0,
};

function getGroup(id) {
  const db = getGroupDb();
  if (!db.groups[id]) db.groups[id] = { ...GROUP_DEF, id };
  const g = db.groups[id];
  for (const k of Object.keys(GROUP_DEF)) if (g[k] === undefined) g[k] = GROUP_DEF[k];
  db.groups[id] = g;
  saveGroupDb(db);
  return g;
}

function saveGroup(id, data) {
  const db = getGroupDb();
  db.groups[id] = { ...(db.groups[id] || { ...GROUP_DEF, id }), ...data };
  saveGroupDb(db);
}

function getAllGroups() { return getGroupDb().groups; }

// ── Settings DB (global) ──
function getSettings() {
  return load(config.settingsDb, {
    botName: config.botName, prefix: config.prefix, mode: config.mode,
    autoAI: config.autoAI, antiLink: config.antiLink,
    antiSpam: config.antiSpam, readMessage: config.readMessage,
    autoTyping: config.autoTyping, geminiModel: config.geminiModel,
  });
}
function saveSettings(data) { save(config.settingsDb, data); }

module.exports = {
  getUser, saveUser, getAllUsers,
  getGroup, saveGroup, getAllGroups,
  getSettings, saveSettings,
};
