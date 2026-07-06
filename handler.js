const fs = require("fs");
const path = require("path");
const config = require("./config");
const { getTag, isOwner, parseMessage, sleep } = require("./lib/function");
const { getCategoryList, loadAllPlugins } = require("./lib/menu");
const { getUser, saveUser, getGroup, saveGroup, getSettings } = require("./lib/database");
const { sendText, sendReact } = require("./lib/sender");

const pluginsDir = path.join(__dirname, "plugins");
let pluginsObj = {}, commandMap = {};
const spamMap = new Map(); // jid → { count, time }

function reloadPlugins() {
  for (const k of Object.keys(require.cache))
    if (k.includes(path.sep + "plugins" + path.sep)) delete require.cache[k];
  pluginsObj = {}; commandMap = {};
  function readDir(dir) {
    let items = []; try { items = fs.readdirSync(dir); } catch { return; }
    for (const item of items) {
      const full = path.join(dir, item);
      try {
        if (fs.statSync(full).isDirectory()) { readDir(full); continue; }
        if (!item.endsWith(".js")) continue;
        const mod = require(full); if (!mod) continue;
        const cat = (mod.category||"misc").toLowerCase();
        if (!pluginsObj[cat]) pluginsObj[cat] = [];
        const cmds = Array.isArray(mod.command) ? mod.command : mod.command ? [mod.command] : [];
        for (const cmd of cmds) {
          commandMap[cmd.toLowerCase()] = mod;
          pluginsObj[cat].push({ cmd: config.prefix + cmd, desc: mod.description||"" });
        }
      } catch (e) { console.error(`[Plugin] ${full}: ${e.message}`); }
    }
  }
  readDir(pluginsDir);
  const total = Object.values(pluginsObj).reduce((a,b) => a+b.length, 0);
  console.log(`[Plugin] Loaded ${total} commands`);
}
reloadPlugins();

function checkSpam(jid) {
  const now = Date.now(), window = 10000, limit = config.spamLimit;
  const entry = spamMap.get(jid) || { count: 0, time: now };
  if (now - entry.time > window) { entry.count = 1; entry.time = now; }
  else entry.count++;
  spamMap.set(jid, entry);
  return entry.count > limit;
}

async function handleMessage(sock, raw, startTime) {
  try {
    if (!raw?.messages?.[0]?.message) return;
    if (raw.type !== "notify") return;
    const m = raw.messages[0];
    if (m.key.remoteJid === "status@broadcast") return;
    const parsed = parseMessage(m); if (!parsed) return;
    const { body, sender, chat, isGroup } = parsed;

    const cfg = getSettings();
    const prefix = cfg.prefix || config.prefix;
    const mode = cfg.mode || config.mode;

    if (cfg.readMessage !== false) await sock.readMessages([m.key]).catch(() => {});

    // ── Antilink ──
    if (isGroup) {
      const grp = getGroup(chat);
      if (grp.antilink && !isOwner(sender, config.owner)) {
        const linkRx = /(https?:\/\/chat\.whatsapp\.com\/\S+)/i;
        if (linkRx.test(body)) {
          await sock.sendMessage(chat, { delete: parsed.key }).catch(() => {});
          await sendText(sock, chat, `⚠️ @${getTag(sender)} dilarang mengirim link grup!`, parsed);
          return;
        }
      }
      // Mute check
      if (grp.mute && !isOwner(sender, config.owner)) return;
    }

    // ── Run onMessage handlers (games, auto-ai etc) ──
    const seenOnMsg = new Set();
    for (const mod of Object.values(commandMap)) {
      if (mod.onMessage && !seenOnMsg.has(mod)) {
        seenOnMsg.add(mod);
        try { await mod.onMessage({ sock, m: parsed, body, chat, sender, isGroup, pluginsObj, startTime }); } catch {}
      }
    }

    // ── Auto AI ──
    if (isGroup && !body.startsWith(prefix)) {
      const grp = getGroup(chat);
      const isTagged = body.includes("@" + getTag(sock.user?.id || ""));
      if (grp.autoai || isTagged) {
        const q = isTagged ? body.replace(/@\d+/g,"").trim() : body.trim();
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
    const fullCmd = body.slice(prefix.length).trim(); if (!fullCmd) return;
    const [rawCmd, ...args] = fullCmd.split(/\s+/);
    const cmd = rawCmd.toLowerCase();

    // ── Mode check ──
    if (mode === "self" && !isOwner(sender, config.owner) && !m.key.fromMe) return;

    // ── Anti-spam ──
    if (cfg.antiSpam !== false && !isOwner(sender, config.owner) && checkSpam(sender)) {
      return sendText(sock, chat, "⏳ Terlalu cepat! Tunggu sebentar.", parsed);
    }

    // ── User check ──
    const user = getUser(sender);
    if (user.banned) return sendText(sock, chat, "❌ Kamu dibanned dari bot.", parsed);

    // ── Auto menutype ──
    const cats = getCategoryList(pluginsObj);
    const menuTypeMatch = cats.find(c => cmd === `menu${c}`);
    if (menuTypeMatch) {
      const mtMod = commandMap["menutype"];
      if (mtMod) {
        try { await mtMod.run({ sock, m: parsed, args, body, startTime, matchedCategory: menuTypeMatch, pluginsObj, prefix }); }
        catch (e) { await sendText(sock, chat, `❌ ${e.message}`, parsed); }
      }
      return;
    }

    const mod = commandMap[cmd]; if (!mod) return;

    // ── Permissions ──
    if (mod.ownerOnly && !isOwner(sender, config.owner) && !m.key.fromMe)
      return sendText(sock, chat, "❌ Hanya untuk owner!", parsed);
    if (mod.premiumOnly && !user.premium && !isOwner(sender, config.owner))
      return sendText(sock, chat, "❌ Fitur premium! Hubungi owner.", parsed);
    if (mod.groupOnly && !isGroup)
      return sendText(sock, chat, "❌ Hanya di grup!", parsed);
    if (mod.privateOnly && isGroup)
      return sendText(sock, chat, "❌ Hanya di chat pribadi!", parsed);
    if (mod.adminOnly && isGroup) {
      try {
        const meta = await sock.groupMetadata(chat);
        const admins = meta.participants.filter(p => p.admin).map(p => p.id);
        if (!admins.includes(sender) && !isOwner(sender, config.owner))
          return sendText(sock, chat, "❌ Hanya admin grup!", parsed);
      } catch {}
    }
    if (mod.botAdminOnly && isGroup) {
      try {
        const meta = await sock.groupMetadata(chat);
        const botJid = sock.user.id;
        const botP = meta.participants.find(p => getTag(p.id) === getTag(botJid));
        if (!botP?.admin) return sendText(sock, chat, "❌ Bot harus jadi admin grup dulu!", parsed);
      } catch {}
    }

    // ── Cooldown ──
    const now = Date.now();
    const cdKey = sender + "_" + cmd;
    const lastUse = global._cooldownMap?.get(cdKey) || 0;
    const cdTime = mod.cooldown || config.cooldown || 2000;
    if (!global._cooldownMap) global._cooldownMap = new Map();
    if (now - lastUse < cdTime && !isOwner(sender, config.owner)) {
      const wait = Math.ceil((cdTime - (now - lastUse)) / 1000);
      return sendText(sock, chat, `⏳ Tunggu ${wait} detik lagi.`, parsed);
    }
    global._cooldownMap.set(cdKey, now);

    if (cfg.autoTyping !== false) await sock.sendPresenceUpdate("composing", chat).catch(() => {});

    user.stats = user.stats || {};
    user.stats.cmds = (user.stats.cmds || 0) + 1;
    user.lastCmd = now;
    saveUser(sender, user);

    try {
      await mod.run({ sock, m: parsed, args, body, startTime, pluginsObj, prefix, reloadPlugins });
    } catch (e) {
      console.error(`[CMD] .${cmd}: ${e.message}`);
      await sendText(sock, chat, `❌ Error: ${e.message}`, parsed);
    }
    if (cfg.autoTyping !== false) await sock.sendPresenceUpdate("paused", chat).catch(() => {});
  } catch (e) { console.error("[Handler]", e.message); }
}

async function handleGroupUpdate(sock, { id, participants, action }) {
  try {
    const grp = getGroup(id);
    if (action === "add" && grp.welcome) {
      const meta = await sock.groupMetadata(id).catch(() => null); if (!meta) return;
      for (const jid of participants) {
        const num = getTag(jid);
        const msg = (grp.welcomeMsg || `👋 Selamat datang @${num} di *${meta.subject}*!\nKetik *.menu* untuk lihat perintah.`)
          .replace(/@user/g, `@${num}`).replace(/@group/g, meta.subject);
        await sock.sendMessage(id, { text: msg, mentions: [jid] }).catch(() => {});
      }
    }
    if (action === "remove" && grp.goodbye) {
      const meta = await sock.groupMetadata(id).catch(() => null); if (!meta) return;
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
