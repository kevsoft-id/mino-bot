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
  addPremium, removePremium, getAllPremium, getPremiumInfo,
  parseDuration, durationLabel,
} = require("../../lib/database");
const { getTag, msToTime } = require("../../lib/function");
const { sendText, sendList, sendButton } = require("../../lib/sender");
const config = require("../../config");

function resolveTarget(m, args) {
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid
    || m.message?.imageMessage?.contextInfo?.mentionedJid
    || [];
  if (mentioned[0]) return mentioned[0];
  if (args[0]) {
    const clean = args[0].replace(/[^0-9]/g, "");
    if (clean.length >= 10) return clean + "@s.whatsapp.net";
  }
  return null;
}

function fmtDate(ts) {
  if (ts === -1) return "Permanent ♾️";
  return new Date(ts).toLocaleDateString("id-ID", {
    weekday: "short", day: "2-digit", month: "long", year: "numeric"
  });
}

function timeLeft(until) {
  if (until === -1) return "∞ Permanent";
  const ms = until - Date.now();
  if (ms <= 0) return "❌ Expired";
  return msToTime(ms);
}

module.exports = {
  command: ["addprem", "addpremium", "delprem", "delpremium", "listprem", "listpremium", "cekprem"],
  category: "owner",
  description: "Kelola user premium",
  ownerOnly: true,
  noLimit: true,

  async run({ sock, m, args, body, prefix }) {
    const p   = prefix || ".";
    const cmd = body.slice(p.length).trim().toLowerCase().split(/\s/)[0];

    // ════════════════════════════════
    //  .listprem — Daftar semua premium
    // ════════════════════════════════
    if (cmd === "listprem" || cmd === "listpremium") {
      const all     = getAllPremium();
      const entries = Object.values(all);
      if (!entries.length) {
        return sendText(sock, m.chat,
          `╭──「 *💎 PREMIUM LIST* 」\n│● Belum ada user premium.\n│\n│ Tambah dengan: ${p}addprem @user 30d\n╰───────────♢`, m);
      }

      const now    = Date.now();
      const active = entries.filter(e => e.until === -1 || e.until > now)
        .sort((a, b) => {
          if (a.until === -1) return -1;
          if (b.until === -1) return 1;
          return a.until - b.until;
        });
      const expired = entries.filter(e => e.until !== -1 && e.until <= now);

      const sections = [];

      if (active.length) {
        sections.push({
          title: `💎 Premium Aktif (${active.length})`,
          rows: active.map(e => ({
            id:          `prem_${e.id}`,
            title:       `+${e.id}`,
            description: e.until === -1
              ? "Permanent ♾️"
              : `Expires: ${fmtDate(e.until)} • Sisa: ${timeLeft(e.until)}`,
          })),
        });
      }

      if (expired.length) {
        sections.push({
          title: `💀 Sudah Expired (${expired.length})`,
          rows: expired.slice(0, 5).map(e => ({
            id:          `prem_exp_${e.id}`,
            title:       `+${e.id}`,
            description: `Expired: ${fmtDate(e.until)}`,
          })),
        });
      }

      return sendList(sock, m.chat, {
        text:       `*💎 Daftar User Premium ${config.botName}*\n\nAktif: *${active.length}* user`,
        footer:     `${config.botName} • Premium Manager`,
        title:      "PREMIUM LIST",
        buttonText: `Lihat ${entries.length} User Premium`,
        sections,
        quoted:     m,
      });
    }

    // ════════════════════════════════
    //  .cekprem @user — Cek status premium
    // ════════════════════════════════
    if (cmd === "cekprem") {
      const target = resolveTarget(m, args);
      if (!target) return sendText(sock, m.chat, `❌ Gunakan: ${p}cekprem @user`, m);

      const num  = getTag(target);
      const info = getPremiumInfo(target);

      if (!info) {
        return sendButton(sock, m.chat, {
          text:    `╭──「 *💎 STATUS PREMIUM* 」\n│● User   : @${num}\n│● Status : ❌ Free User\n╰───────────♢`,
          footer:  `${config.botName} • Premium`,
          buttons: [{ id: `addprem_${num}`, text: "➕ Jadikan Premium" }],
          quoted:  m,
        });
      }

      const now    = Date.now();
      const active = info.until === -1 || info.until > now;
      return sendButton(sock, m.chat, {
        text:
          `╭──「 *💎 STATUS PREMIUM* 」\n` +
          `│● User    : @${num}\n` +
          `│● Status  : ${active ? "✅ Premium Aktif" : "❌ Expired"}\n` +
          `│● Durasi  : ${durationLabel(info.durationMs === -1 ? -1 : info.durationMs)}\n` +
          `│● Sejak   : ${fmtDate(info.since)}\n` +
          `│● Sampai  : ${fmtDate(info.until)}\n` +
          `│● Sisa    : ${timeLeft(info.until)}\n` +
          `│● Oleh    : +${info.addedBy || "?"}\n` +
          `╰───────────♢`,
        footer:  `${config.botName} • Premium`,
        buttons: active
          ? [{ id: `delprem_${num}`, text: "🗑️ Hapus Premium" }]
          : [{ id: `addprem30_${num}`, text: "🔄 Perpanjang 30 Hari" }],
        quoted: m,
      });
    }

    // ════════════════════════════════
    //  .addprem @user [durasi]
    // ════════════════════════════════
    if (cmd === "addprem" || cmd === "addpremium") {
      const target = resolveTarget(m, args);
      if (!target) {
        return sendList(sock, m.chat, {
          text:
            `*➕ Tambah Premium User*\n\n` +
            `Cara pakai:\n${p}addprem @user [durasi]\n\n` +
            `Contoh:\n` +
            `${p}addprem @user 7d\n` +
            `${p}addprem @user 30d\n` +
            `${p}addprem @user perm`,
          footer:     `${config.botName} • Premium Manager`,
          title:      "PILIH DURASI",
          buttonText: "Lihat Paket Durasi",
          sections: [{
            title: "⏱️ Paket Durasi Premium",
            rows: [
              { id: "dur_1d",   title: "1 Hari",   description: "Untuk trial / coba-coba" },
              { id: "dur_7d",   title: "1 Minggu",  description: "Paket mingguan" },
              { id: "dur_30d",  title: "1 Bulan",   description: "Paket bulanan (paling populer)" },
              { id: "dur_90d",  title: "3 Bulan",   description: "Paket kuartalan" },
              { id: "dur_365d", title: "1 Tahun",   description: "Paket tahunan" },
              { id: "dur_perm", title: "Permanent ♾️", description: "Tidak ada batas waktu" },
            ],
          }],
          quoted: m,
        });
      }

      // Ambil durasi dari arg yang bukan mention
      const mentionedJid = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const durArg = args.find(a => !a.includes("@") && !/^\d{10,}$/.test(a)) || "30d";
      const ms     = parseDuration(durArg);

      if (ms === null) {
        return sendText(sock, m.chat,
          `❌ Durasi tidak valid: *${durArg}*\n\n` +
          `Format yang valid:\n` +
          `• ${p}addprem @user 1d   → 1 hari\n` +
          `• ${p}addprem @user 7d   → 7 hari\n` +
          `• ${p}addprem @user 30d  → 30 hari\n` +
          `• ${p}addprem @user perm → permanent`, m);
      }

      const num    = getTag(target);
      const result = addPremium(target, durArg, m.sender);

      if (!result.ok) {
        return sendText(sock, m.chat, `❌ Gagal menambah premium. Coba lagi.`, m);
      }

      await sock.sendMessage(m.chat, {
        text:
          `╭──「 *💎 PREMIUM DIAKTIFKAN* 」\n` +
          `│● User    : @${num}\n` +
          `│● Durasi  : ${result.label}\n` +
          `│● Sampai  : ${fmtDate(result.until)}\n` +
          `│● Diaktif : ${fmtDate(Date.now())}\n` +
          `│● Oleh    : @${getTag(m.sender)}\n` +
          `│\n│ ✨ User mendapat limit ${config.limitPremium || 200}/hari!\n` +
          `╰───────────♢`,
        mentions: [target, m.sender],
      }, { quoted: m });
      return;
    }

    // ════════════════════════════════
    //  .delprem @user — Cabut premium
    // ════════════════════════════════
    if (cmd === "delprem" || cmd === "delpremium") {
      const target = resolveTarget(m, args);
      if (!target) return sendText(sock, m.chat, `❌ Gunakan: ${p}delprem @user`, m);

      const num = getTag(target);
      const ok  = removePremium(target);

      if (!ok) {
        return sendText(sock, m.chat,
          `╭──「 *❓ TIDAK DITEMUKAN* 」\n│● @${num} bukan user premium.\n╰───────────♢`, m);
      }

      await sock.sendMessage(m.chat, {
        text:
          `╭──「 *🗑️ PREMIUM DICABUT* 」\n` +
          `│● User   : @${num}\n` +
          `│● Status : ❌ Free User\n` +
          `│● Oleh   : @${getTag(m.sender)}\n` +
          `╰───────────♢`,
        mentions: [target, m.sender],
      }, { quoted: m });
    }
  },
};
