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
const config = require("./config");

const { getTag, isOwner, parseMessage } = require("./lib/function");
const { getCategoryList, loadAllPlugins }  = require("./lib/menu");
const {
  getUser, saveUser, getGroup, saveGroup, getSettings,
  isDynOwner, checkPremiumExpiry, useLimit, getLimit,
} = require("./lib/database");
const { sendText, sendReact } = require("./lib/sender");

const pluginsDir = path.join(__dirname, "plugins");
let pluginsObj = {}, commandMap = {};
const spamMap  = new Map();

// ── Load ulang semua plugin dari disk ─────────────────────────────────────────
function reloadPlugins() {
  for (const k of Object.keys(require.cache))
    if (k.includes(path.sep + "plugins" + path.sep)) delete require.cache[k];
  pluginsObj = {}; commandMap = {};

  function readDir(dir) {
    let items = [];
    try { items = fs.readdirSync(dir); } catch { return; }
    for (const item of items) {
      const full = path.join(dir, item);
      try {
        if (fs.statSync(full).isDirectory()) { readDir(full); continue; }
        if (!item.endsWith(".js")) continue;
        const mod = require(full);
        if (!mod) continue;
        const cat  = (mod.category || "misc").toLowerCase();
        if (!pluginsObj[cat]) pluginsObj[cat] = [];
        const cmds = Array.isArray(mod.command) ? mod.command : mod.command ? [mod.command] : [];
        for (const cmd of cmds) {
          commandMap[cmd.toLowerCase()] = mod;
          pluginsObj[cat].push({ cmd: config.prefix + cmd, desc: mod.description || "" });
        }
      } catch (e) { console.error(`[Plugin] ${full}: ${e.message}`); }
    }
  }
  readDir(pluginsDir);
  const total = Object.values(pluginsObj).reduce((a, b) => a + b.length, 0);
  console.log(`[Plugin] ${total} perintah dimuat`);
}
reloadPlugins();

// ── Anti-spam check ───────────────────────────────────────────────────────────
function checkSpam(jid) {
  const now = Date.now(), window = 10_000, limit = config.spamLimit;
  const entry = spamMap.get(jid) || { count: 0, time: now };
  if (now - entry.time > window) { entry.count = 1; entry.time = now; }
  else entry.count++;
  spamMap.set(jid, entry);
  return entry.count > limit;
}

// ── Progress bar unicode ──────────────────────────────────────────────────────
function progressBar(current, total, len = 10) {
  if (!total || total <= 0) return "░".repeat(len);
  const filled = Math.min(len, Math.round((current / total) * len));
  return "█".repeat(filled) + "░".repeat(len - filled);
}

// ── Pesan limit habis ─────────────────────────────────────────────────────────
function limitExhaustedMsg(remaining, total, resetAt, prefix) {
  const p = prefix || ".";
  const msLeft = Math.max(0, resetAt - Date.now());
  const h = Math.floor(msLeft / 3600000);
  const m = Math.floor((msLeft % 3600000) / 60000);
  const bar = progressBar(remaining, total);
  return (
    `╭──「 *⚡ LIMIT HABIS* 」\n` +
    `│● Limit  : ${bar}  *${remaining}/${total}*\n` +
    `│● Reset  : ${h}j ${m}m lagi\n` +
    `│\n` +
    `│ 💡 *Cara tambah limit:*\n` +
    `│  ${p}claimlimit — Claim gratis (6j sekali)\n` +
    `│  ${p}buylimit   — Beli dengan koin 💰\n` +
    `╰───────────♢`
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  handleMessage — entry point utama setiap pesan masuk
// ══════════════════════════════════════════════════════════════════════════════
async function handleMessage(sock, raw, startTime) {
  try {
    if (!raw?.messages?.[0]?.message) return;
    if (raw.type !== "notify") return;

    const m = raw.messages[0];
    if (m.key.remoteJid === "status@broadcast") return;

    const parsed = parseMessage(m);
    if (!parsed) return;

    const { body, sender, chat, isGroup } = parsed;
    const cfg    = getSettings();
    const prefix = cfg.prefix || config.prefix;
    const mode   = cfg.mode   || config.mode;

    // ── Auto-read ────────────────────────────────────────────────────────────
    if (cfg.readMessage !== false) await sock.readMessages([m.key]).catch(() => {});

    // ── Cek gabungan owner: config + DB ──────────────────────────────────────
    const isOwnerUser = isOwner(sender, config.owner) || isDynOwner(sender) || m.key.fromMe;

    // ── Anti-link ─────────────────────────────────────────────────────────────
    if (isGroup && !isOwnerUser) {
      const grp = getGroup(chat);
      if (grp.antilink) {
        const linkRx = /(https?:\/\/chat\.whatsapp\.com\/\S+)/i;
        if (linkRx.test(body)) {
          await sock.sendMessage(chat, { delete: parsed.key }).catch(() => {});
          await sendText(sock, chat, `⚠️ @${getTag(sender)} dilarang mengirim link grup!`, parsed);
          return;
        }
      }
      if (grp.mute) return;
    }

    // ── onMessage hooks (game state, auto-ai, dll) ────────────────────────────
    const seenOnMsg = new Set();
    for (const mod of Object.values(commandMap)) {
      if (mod.onMessage && !seenOnMsg.has(mod)) {
        seenOnMsg.add(mod);
        try { await mod.onMessage({ sock, m: parsed, body, chat, sender, isGroup, pluginsObj, startTime }); } catch {}
      }
    }

    // ── Auto AI di grup ───────────────────────────────────────────────────────
    if (isGroup && !body.startsWith(prefix)) {
      const grp     = getGroup(chat);
      const botTag  = "@" + getTag(sock.user?.id || "");
      const isTagged = body.includes(botTag);
      if (grp.autoai || isTagged) {
        const q = body.replace(/@\d+/g, "").trim();
        if (q) {
          try {
            const { chat: aiChat } = require("./lib/gemini");
            const ans = await aiChat(sender + chat, q);
            await sendText(sock, chat, `🤖 ${ans}`, parsed);
          } catch (e) { await sendText(sock, chat, `❌ AI: ${e.message}`, parsed); }
          return;
        }
      }
    }

    if (!body.startsWith(prefix)) return;
    const fullCmd = body.slice(prefix.length).trim();
    if (!fullCmd) return;
    const [rawCmd, ...args] = fullCmd.split(/\s+/);
    const cmd = rawCmd.toLowerCase();

    // ── Mode self ─────────────────────────────────────────────────────────────
    if (mode === "self" && !isOwnerUser) return;

    // ── Anti-spam ─────────────────────────────────────────────────────────────
    if (cfg.antiSpam !== false && !isOwnerUser && checkSpam(sender)) {
      return sendText(sock, chat, "⏳ Terlalu cepat! Tunggu sebentar.", parsed);
    }

    // ── Cek & sync premium expiry ─────────────────────────────────────────────
    checkPremiumExpiry(sender);

    // ── Data user ─────────────────────────────────────────────────────────────
    const user = getUser(sender);
    if (user.banned) return sendText(sock, chat, "❌ Kamu dibanned dari bot.", parsed);

    // ── Auto-menutype shortcut ────────────────────────────────────────────────
    const cats          = getCategoryList(pluginsObj);
    const menuTypeMatch = cats.find(c => cmd === `menu${c}`);
    if (menuTypeMatch) {
      const mtMod = commandMap["menutype"];
      if (mtMod) {
        try { await mtMod.run({ sock, m: parsed, args, body, startTime, matchedCategory: menuTypeMatch, pluginsObj, prefix }); }
        catch (e) { await sendText(sock, chat, `❌ ${e.message}`, parsed); }
      }
      return;
    }

    const mod = commandMap[cmd];
    if (!mod) return;

    // ── Cek permission ────────────────────────────────────────────────────────
    if (mod.ownerOnly && !isOwnerUser)
      return sendText(sock, chat, "❌ Hanya untuk owner!", parsed);
    if (mod.premiumOnly && !user.premium && !isOwnerUser)
      return sendText(sock, chat, "❌ Fitur premium!\n│ Hubungi owner untuk upgrade.", parsed);
    if (mod.groupOnly && !isGroup)
      return sendText(sock, chat, "❌ Hanya di grup!", parsed);
    if (mod.privateOnly && isGroup)
      return sendText(sock, chat, "❌ Hanya di chat pribadi!", parsed);
    if (mod.adminOnly && isGroup) {
      try {
        const meta   = await sock.groupMetadata(chat);
        const admins = meta.participants.filter(p => p.admin).map(p => p.id);
        if (!admins.includes(sender) && !isOwnerUser)
          return sendText(sock, chat, "❌ Hanya admin grup!", parsed);
      } catch {}
    }
    if (mod.botAdminOnly && isGroup) {
      try {
        const meta  = await sock.groupMetadata(chat);
        const botJid = sock.user.id;
        const botP   = meta.participants.find(p => getTag(p.id) === getTag(botJid));
        if (!botP?.admin) return sendText(sock, chat, "❌ Bot harus jadi admin grup dulu!", parsed);
      } catch {}
    }

    // ── Sistem Limit (skip untuk owner dan perintah noLimit) ──────────────────
    if (!isOwnerUser && !mod.noLimit) {
      const limitResult = useLimit(sender);
      if (!limitResult.ok) {
        const inf = getLimit(sender);
        return sendText(sock, chat, limitExhaustedMsg(inf.remaining, inf.total, inf.resetAt, prefix), parsed);
      }
    }

    // ── Cooldown ──────────────────────────────────────────────────────────────
    const now   = Date.now();
    const cdKey = sender + "_" + cmd;
    if (!global._cooldownMap) global._cooldownMap = new Map();
    const lastUse = global._cooldownMap.get(cdKey) || 0;
    const cdTime  = mod.cooldown || config.cooldown || 2000;
    if (now - lastUse < cdTime && !isOwnerUser) {
      const wait = Math.ceil((cdTime - (now - lastUse)) / 1000);
      return sendText(sock, chat, `⏳ Tunggu *${wait} detik* lagi.`, parsed);
    }
    global._cooldownMap.set(cdKey, now);

    // ── Typing indicator ──────────────────────────────────────────────────────
    if (cfg.autoTyping !== false) await sock.sendPresenceUpdate("composing", chat).catch(() => {});

    // ── Catat statistik ───────────────────────────────────────────────────────
    user.stats = user.stats || {};
    user.stats.cmds = (user.stats.cmds || 0) + 1;
    user.lastCmd = now;
    saveUser(sender, user);

    // ── Jalankan plugin ───────────────────────────────────────────────────────
    try {
      await mod.run({ sock, m: parsed, args, body, startTime, pluginsObj, prefix, reloadPlugins, isOwnerUser });
    } catch (e) {
      console.error(`[CMD] ${prefix}${cmd}: ${e.message}`);
      await sendText(sock, chat, `❌ *Error:* ${e.message}`, parsed);
    }

    if (cfg.autoTyping !== false) await sock.sendPresenceUpdate("paused", chat).catch(() => {});

  } catch (e) { console.error("[Handler]", e.message); }
}

// ══════════════════════════════════════════════════════════════════════════════
//  handleGroupUpdate — welcome / goodbye
// ══════════════════════════════════════════════════════════════════════════════
async function handleGroupUpdate(sock, { id, participants, action }) {
  try {
    const grp = getGroup(id);
    if (action === "add" && grp.welcome) {
      const meta = await sock.groupMetadata(id).catch(() => null);
      if (!meta) return;
      for (const jid of participants) {
        const num = getTag(jid);
        const msg = (grp.welcomeMsg || `👋 Selamat datang @${num} di *${meta.subject}*!\nKetik *.menu* untuk lihat perintah.`)
          .replace(/@user/g, `@${num}`).replace(/@group/g, meta.subject);
        await sock.sendMessage(id, { text: msg, mentions: [jid] }).catch(() => {});
      }
    }
    if (action === "remove" && grp.goodbye) {
      const meta = await sock.groupMetadata(id).catch(() => null);
      if (!meta) return;
      for (const jid of participants) {
        const num = getTag(jid);
        const msg = (grp.goodbyeMsg || `👋 Selamat tinggal @${num}!\nSemoga sukses selalu 🙏`)
          .replace(/@user/g, `@${num}`).replace(/@group/g, meta.subject);
        await sock.sendMessage(id, { text: msg, mentions: [jid] }).catch(() => {});
      }
    }
  } catch {}
}

module.exports = { handleMessage, handleGroupUpdate, reloadPlugins, pluginsObj, commandMap };
