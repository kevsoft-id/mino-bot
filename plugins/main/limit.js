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
const { getLimit, claimLimit, buyLimit } = require("../../lib/database");
const { getTag, msToTime, formatCoins } = require("../../lib/function");
const { sendText, sendButton } = require("../../lib/sender");
const config = require("../../config");

function bar(rem, total, len = 12) {
  if (!total) return "░".repeat(len);
  const f = Math.min(len, Math.round((rem / total) * len));
  return "█".repeat(f) + "░".repeat(len - f);
}

function resetIn(resetAt) {
  const ms = Math.max(0, resetAt - Date.now());
  if (ms === 0) return "Sekarang";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (h) return `${h}j ${m}m lagi`;
  if (m) return `${m}m ${s}d lagi`;
  return `${s}d lagi`;
}

function claimCdLeft(lastClaim) {
  const cd      = config.limitClaimCooldown || 6 * 3600 * 1000;
  const elapsed = Date.now() - (lastClaim || 0);
  const left    = cd - elapsed;
  if (left <= 0) return null;
  return left;
}

module.exports = {
  command: ["limit", "claimlimit", "buylimit", "mylimit"],
  category: "main",
  description: "Cek, claim, dan beli limit harian",
  noLimit: true, // perintah limit tidak memotong limit

  async run({ sock, m, args, body, prefix }) {
    const p   = prefix || ".";
    const cmd = body.slice(p.length).trim().toLowerCase().split(/\s/)[0];
    const num = getTag(m.sender);

    // ════════════════════════════════
    //  .limit / .mylimit — Cek status limit
    // ════════════════════════════════
    if (cmd === "limit" || cmd === "mylimit") {
      const inf = getLimit(m.sender);
      const pct = inf.total > 0 ? Math.round((inf.remaining / inf.total) * 100) : 0;
      const cdLeft = claimCdLeft(inf.lastClaim);
      const canClaim = !cdLeft;

      const claimInfo = canClaim
        ? `✅ Tersedia — ketik ${p}claimlimit`
        : `⏳ Cooldown ${msToTime(cdLeft)}`;

      const typeEmoji = inf.isPremium ? "💎" : "🆓";
      const typeName  = inf.isPremium ? "Premium" : "Free User";

      const card =
        `╭──「 *⚡ STATUS LIMIT* 」\n` +
        `│● User    : @${num}\n` +
        `│● Tipe    : ${typeEmoji} ${typeName}\n` +
        `│\n` +
        `│● Limit   : ${bar(inf.remaining, inf.total)}  *${inf.remaining}/${inf.total}* (${pct}%)\n` +
        `│● Reset   : ${resetIn(inf.resetAt)}\n` +
        `│\n` +
        `│● Claim   : ${claimInfo}\n` +
        `│● Beli    : ${p}buylimit — +${config.limitBuyAmount || 10} limit (${config.limitBuyCost || 100}🪙)\n` +
        `╰───────────♢`;

      const buttons = [];
      if (canClaim) {
        buttons.push({ id: "claimlimit_do", text: `⚡ Claim +${config.limitClaimBonus || 15} Limit` });
      }
      buttons.push({ id: "buylimit_1", text: `💳 Beli +${config.limitBuyAmount || 10} Limit (${config.limitBuyCost || 100}🪙)` });

      return sendButton(sock, m.chat, {
        text:    card,
        footer:  `${config.botName} • Limit System`,
        buttons,
        quoted:  m,
      });
    }

    // ════════════════════════════════
    //  .claimlimit — Claim bonus limit gratis
    // ════════════════════════════════
    if (cmd === "claimlimit") {
      const result = claimLimit(m.sender);

      if (!result.ok) {
        const cdStr = msToTime(result.cooldownLeft);
        return sendButton(sock, m.chat, {
          text:
            `╭──「 *⏳ COOLDOWN AKTIF* 」\n` +
            `│● Kamu sudah claim limit tadi.\n` +
            `│● Tunggu: *${cdStr}* lagi.\n` +
            `│\n` +
            `│ 💡 Atau beli limit dengan koin:\n` +
            `│   ${p}buylimit\n` +
            `╰───────────♢`,
          footer:  `${config.botName} • Limit System`,
          buttons: [{ id: "buylimit_1", text: `💳 Beli Limit (${config.limitBuyCost || 100}🪙)` }],
          quoted:  m,
        });
      }

      const inf = getLimit(m.sender);
      return sendButton(sock, m.chat, {
        text:
          `╭──「 *⚡ LIMIT DIKLAIM!* 」\n` +
          `│● Bonus   : +${result.bonus} limit 🎁\n` +
          `│● Sisa    : ${bar(inf.remaining, inf.total)}  *${inf.remaining}/${inf.total}*\n` +
          `│● Reset   : ${resetIn(inf.resetAt)}\n` +
          `│\n` +
          `│ Claim lagi dalam ${msToTime(config.limitClaimCooldown || 6 * 3600 * 1000)}\n` +
          `╰───────────♢`,
        footer:  `${config.botName} • Limit System`,
        buttons: [
          { id: "limit_check", text: "⚡ Cek Limit Saya" },
          { id: "buylimit_1",  text: `💳 Beli Lebih (+${config.limitBuyAmount || 10} Limit)` },
        ],
        quoted: m,
      });
    }

    // ════════════════════════════════
    //  .buylimit [jumlah paket] — Beli limit dengan koin
    // ════════════════════════════════
    if (cmd === "buylimit") {
      // Tampilkan menu jika tanpa arg
      if (!args[0]) {
        const inf = getLimit(m.sender);
        const { getUser } = require("../../lib/database");
        const u = getUser(m.sender);
        const costPerPack  = config.limitBuyCost   || 100;
        const gainPerPack  = config.limitBuyAmount  || 10;

        return sendButton(sock, m.chat, {
          text:
            `╭──「 *💳 BELI LIMIT* 」\n` +
            `│● User    : @${num}\n` +
            `│● Koin    : ${formatCoins(u.coins || 0)} 🪙\n` +
            `│● Limit   : ${bar(inf.remaining, inf.total)}  *${inf.remaining}/${inf.total}*\n` +
            `│\n` +
            `│ *Harga Paket:*\n` +
            `│  1 paket  = +${gainPerPack} limit  (${costPerPack}🪙)\n` +
            `│  5 paket  = +${gainPerPack * 5} limit  (${costPerPack * 5}🪙)\n` +
            `│  10 paket = +${gainPerPack * 10} limit (${costPerPack * 10}🪙)\n` +
            `│\n` +
            `│ Ketik: ${p}buylimit <jumlah paket>\n` +
            `│ Contoh: ${p}buylimit 5\n` +
            `╰───────────♢`,
          footer:  `${config.botName} • Limit Shop`,
          buttons: [
            { id: "buylimit_1",  text: `1 Paket  (+${gainPerPack} limit)` },
            { id: "buylimit_5",  text: `5 Paket  (+${gainPerPack * 5} limit)` },
            { id: "buylimit_10", text: `10 Paket (+${gainPerPack * 10} limit)` },
          ],
          quoted: m,
        });
      }

      const qty = Math.max(1, Math.min(100, parseInt(args[0], 10) || 1));
      const result = buyLimit(m.sender, qty);

      if (!result.ok) {
        if (result.reason === "kurang_koin") {
          return sendButton(sock, m.chat, {
            text:
              `╭──「 *❌ KOIN TIDAK CUKUP* 」\n` +
              `│● Koin kamu: ${formatCoins(result.have)} 🪙\n` +
              `│● Butuh    : ${formatCoins(result.need)} 🪙\n` +
              `│● Kurang   : ${formatCoins(result.need - result.have)} 🪙\n` +
              `│\n` +
              `│ 💡 Cara dapat koin:\n` +
              `│  ${p}daily   — Klaim harian\n` +
              `│  ${p}work    — Kerja dapat koin\n` +
              `│  ${p}gamble  — Judi koin\n` +
              `╰───────────♢`,
            footer:  `${config.botName} • Limit Shop`,
            buttons: [
              { id: "daily_claim", text: "🎁 Klaim Daily" },
              { id: "work_now",    text: "💼 Kerja Sekarang" },
            ],
            quoted: m,
          });
        }
        return sendText(sock, m.chat, `❌ Gagal membeli limit. Coba lagi.`, m);
      }

      const inf = getLimit(m.sender);
      return sendButton(sock, m.chat, {
        text:
          `╭──「 *✅ LIMIT DIBELI!* 」\n` +
          `│● Dibeli  : +${result.bought} limit 🎉\n` +
          `│● Biaya   : -${formatCoins(result.cost)} 🪙\n` +
          `│● Sisa    : ${bar(inf.remaining, inf.total)}  *${inf.remaining}/${inf.total}*\n` +
          `│● Reset   : ${resetIn(inf.resetAt)}\n` +
          `╰───────────♢`,
        footer:  `${config.botName} • Limit Shop`,
        buttons: [
          { id: "limit_check",  text: "⚡ Cek Limit Saya" },
          { id: "buylimit_more", text: "💳 Beli Lagi" },
        ],
        quoted: m,
      });
    }
  },
};
