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

function loadAllPlugins(pluginsDir) {
  const plugins = {};
  function readDir(dir) {
    let items = []; try { items = fs.readdirSync(dir); } catch { return; }
    for (const item of items) {
      const full = path.join(dir, item);
      try {
        if (fs.statSync(full).isDirectory()) { readDir(full); continue; }
        if (!item.endsWith(".js")) continue;
        const mod = require(full);
        if (!mod?.command || !mod?.category) continue;
        const cat = mod.category.toLowerCase();
        if (!plugins[cat]) plugins[cat] = [];
        const cmds = Array.isArray(mod.command) ? mod.command : [mod.command];
        for (const cmd of cmds)
          plugins[cat].push({ cmd: config.prefix + cmd, desc: mod.description||"" });
      } catch {}
    }
  }
  readDir(pluginsDir);
  return plugins;
}

function getCategoryList(pluginsObj) {
  return Object.keys(pluginsObj).filter(c => c !== "system").sort();
}

const CAT_ICONS = {
  main:"⚙️", ai:"🤖", tools:"🔧", downloader:"📥", group:"👥",
  game:"🎮", fun:"😄", search:"🔍", islamic:"🕌", economy:"💰",
  converter:"🔄", owner:"👑", sticker:"🎨", addfitur:"✨",
};

function formatMenuCaption(pluginsObj, botName, ownerName, runtime, tag, mode) {
  const cats = getCategoryList(pluginsObj);
  let total = 0; for (const c of cats) total += pluginsObj[c].length;
  let catList = "╭──「 *KATEGORI* 」\n";
  for (const c of cats) {
    const icon = CAT_ICONS[c] || "📌";
    catList += `│${icon} .menu${c} (${pluginsObj[c].length})\n`;
  }
  catList += "╰───────────♢";
  return `╭──「 *${botName}* 」\n│● User    : @${tag}\n│● Plugin  : ${total} perintah\n│● Mode    : ${mode}\n│● Versi   : 2.0.0\n│● Owner   : ${ownerName}\n│● Runtime : ${runtime}\n╰───────────♢\n\n` + catList;
}

function formatCategoryMenu(category, cmds, botName) {
  const icon = CAT_ICONS[category] || "📌";
  let t = `╭──「 ${icon} *${botName}* 」\n│● Kategori: *${category.toUpperCase()}*\n│\n`;
  for (const c of cmds) t += `│● ${c.cmd}\n│  └ ${c.desc}\n`;
  t += `╰───────────♢\n\n╭──「 *INFO* 」\n│● Total : ${cmds.length} perintah\n│● Prefix: ${config.prefix}\n╰───────────♢`;
  return t;
}

module.exports = { loadAllPlugins, getCategoryList, formatMenuCaption, formatCategoryMenu, CAT_ICONS };
