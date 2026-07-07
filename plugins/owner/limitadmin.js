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
const {
  getLimit, setUserLimit, addUserLimit, resetUserLimit, getAllUsers,
} = require("../../lib/database");
const { getTag } = require("../../lib/function");
const { sendText, sendList } = require("../../lib/sender");
const config = require("../../config");

function resolveTarget(m, args) {
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  if (mentioned[0]) return mentioned[0];
  if (args[0]) {
    const clean = args[0].replace(/[^0-9]/g, "");
    if (clean.length >= 10) return clean + "@s.whatsapp.net";
  }
  return null;
}

function bar(rem, total, len = 10) {
  if (!total) return "░".repeat(len);
  const f = Math.min(len, Math.round((rem / total) * len));
  return "█".repeat(f) + "░".repeat(len - f);
}

module.exports = {
  command: ["setlimit", "addlimit", "resetlimit", "resetalllimit", "ceklimit"],
  category: "owner",
  description: "Kelola limit user (admin)",
  ownerOnly: true,
  noLimit: true,

  async run({ sock, m, args, body, prefix }) {
    const p   = prefix || ".";
    const cmd = body.slice(p.length).trim().toLowerCase().split(/\s/)[0];

    // ════════════════════════════════
    //  .ceklimit @user — Cek limit siapapun
    // ════════════════════════════════
    if (cmd === "ceklimit") {
      const target = resolveTarget(m, args) || m.sender;
      const num    = getTag(target);
      const inf    = getLimit(target);
      const msLeft = Math.max(0, inf.resetAt - Date.now());
      const h      = Math.floor(msLeft / 3600000);
      const mn     = Math.floor((msLeft % 3600000) / 60000);

      return sendText(sock, m.chat,
        `╭──「 *⚡ CEK LIMIT* 」\n` +
        `│● User    : @${num}\n` +
        `│● Limit   : ${bar(inf.remaining, inf.total)}  *${inf.remaining}/${inf.total}*\n` +
        `│● Tipe    : ${inf.isPremium ? "💎 Premium" : "🆓 Free User"}\n` +
        `│● Reset   : ${h}j ${mn}m lagi\n` +
        `╰───────────♢`, m);
    }

    // ════════════════════════════════
    //  .setlimit @user <jumlah>
    // ════════════════════════════════
    if (cmd === "setlimit") {
      const target = resolveTarget(m, args);
      if (!target) return sendText(sock, m.chat, `❌ Gunakan: ${p}setlimit @user <jumlah>`, m);
      const numStr = args.find(a => /^\d+$/.test(a));
      if (!numStr) return sendText(sock, m.chat, `❌ Masukkan jumlah limit.\nContoh: ${p}setlimit @user 50`, m);

      const amount = parseInt(numStr, 10);
      const num    = getTag(target);
      setUserLimit(target, amount);
      const inf    = getLimit(target);

      await sock.sendMessage(m.chat, {
        text:
          `╭──「 *⚡ LIMIT DISET* 」\n` +
          `│● User    : @${num}\n` +
          `│● Limit   : ${bar(inf.remaining, inf.total)}  *${inf.remaining}/${inf.total}*\n` +
          `│● Oleh    : @${getTag(m.sender)}\n` +
          `╰───────────♢`,
        mentions: [target, m.sender],
      }, { quoted: m });
      return;
    }

    // ════════════════════════════════
    //  .addlimit @user <jumlah>
    // ════════════════════════════════
    if (cmd === "addlimit") {
      const target = resolveTarget(m, args);
      if (!target) return sendText(sock, m.chat, `❌ Gunakan: ${p}addlimit @user <jumlah>`, m);
      const numStr = args.find(a => /^\d+$/.test(a));
      if (!numStr) return sendText(sock, m.chat, `❌ Masukkan jumlah limit.\nContoh: ${p}addlimit @user 20`, m);

      const amount = parseInt(numStr, 10);
      const num    = getTag(target);
      addUserLimit(target, amount);
      const inf    = getLimit(target);

      await sock.sendMessage(m.chat, {
        text:
          `╭──「 *✅ LIMIT DITAMBAH* 」\n` +
          `│● User    : @${num}\n` +
          `│● Tambah  : +${amount} limit\n` +
          `│● Sisa    : ${bar(inf.remaining, inf.total)}  *${inf.remaining}/${inf.total}*\n` +
          `│● Oleh    : @${getTag(m.sender)}\n` +
          `╰───────────♢`,
        mentions: [target, m.sender],
      }, { quoted: m });
      return;
    }

    // ════════════════════════════════
    //  .resetlimit @user — Reset limit satu user
    // ════════════════════════════════
    if (cmd === "resetlimit") {
      const target = resolveTarget(m, args);
      if (!target) return sendText(sock, m.chat, `❌ Gunakan: ${p}resetlimit @user`, m);
      const num    = getTag(target);
      resetUserLimit(target);
      const inf    = getLimit(target);

      await sock.sendMessage(m.chat, {
        text:
          `╭──「 *🔄 LIMIT DIRESET* 」\n` +
          `│● User    : @${num}\n` +
          `│● Limit   : ${bar(inf.remaining, inf.total)}  *${inf.remaining}/${inf.total}*\n` +
          `│● Oleh    : @${getTag(m.sender)}\n` +
          `╰───────────♢`,
        mentions: [target, m.sender],
      }, { quoted: m });
      return;
    }

    // ════════════════════════════════
    //  .resetalllimit — Reset limit semua user
    // ════════════════════════════════
    if (cmd === "resetalllimit") {
      const allUsers = Object.keys(getAllUsers());
      let count = 0;
      for (const id of allUsers) {
        try { resetUserLimit(id); count++; } catch {}
      }
      await sendText(sock, m.chat,
        `╭──「 *🔄 RESET SEMUA LIMIT* 」\n` +
        `│● Total   : ${count} user direset\n` +
        `│● Oleh    : @${getTag(m.sender)}\n` +
        `╰───────────♢`, m);
    }
  },
};
