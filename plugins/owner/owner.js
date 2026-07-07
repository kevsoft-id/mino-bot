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
const { addOwner, removeOwner, getAllOwners, isDynOwner }
  = require("../../lib/database");
const { getTag } = require("../../lib/function");
const { sendText, sendList, sendButton } = require("../../lib/sender");
const config = require("../../config");

// Ambil nomor dari mention / arg teks
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

function fmt(ts) {
  return new Date(ts).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

module.exports = {
  command: ["addowner", "delowner", "listowner", "cekowner"],
  category: "owner",
  description: "Kelola daftar owner bot",
  ownerOnly: true,
  noLimit: true,

  async run({ sock, m, args, body, prefix }) {
    const p   = prefix || ".";
    const cmd = body.slice(p.length).trim().toLowerCase().split(/\s/)[0];

    // ════════════════════════════════
    //  .listowner — Daftar semua owner
    // ════════════════════════════════
    if (cmd === "listowner") {
      const superOwners = (config.owner || []);
      const dynOwners   = Object.values(getAllOwners());

      if (!superOwners.length && !dynOwners.length) {
        return sendText(sock, m.chat,
          `╭──「 *👑 DAFTAR OWNER* 」\n│● Belum ada owner terdaftar.\n╰───────────♢`, m);
      }

      // Pakai sendList agar interaktif
      const sections = [];

      if (superOwners.length) {
        sections.push({
          title: "👑 Super Owner (Permanen)",
          rows: superOwners.map((id, i) => ({
            id:          `superowner_${id}`,
            title:       `+${id}`,
            description: i === 0 ? "Owner Utama (dari konfigurasi)" : "Super Owner",
          })),
        });
      }

      if (dynOwners.length) {
        sections.push({
          title: "🛡️ Sub Owner (Database)",
          rows: dynOwners.map(o => ({
            id:          `dynowner_${o.id}`,
            title:       `+${o.id}`,
            description: `Ditambah: ${fmt(o.addedAt)} • Oleh: +${o.addedBy || "?"}`,
          })),
        });
      }

      const total = superOwners.length + dynOwners.length;
      return sendList(sock, m.chat, {
        text:       `*👑 Daftar Owner ${config.botName}*\n\nTotal: *${total} owner* terdaftar`,
        footer:     `${config.botName} • Owner Management`,
        title:      "OWNER LIST",
        buttonText: `Lihat ${total} Owner`,
        sections,
        quoted:     m,
      });
    }

    // ════════════════════════════════
    //  .cekowner @user — Cek status
    // ════════════════════════════════
    if (cmd === "cekowner") {
      const target = resolveTarget(m, args);
      if (!target) return sendText(sock, m.chat, `❌ Gunakan: ${p}cekowner @user`, m);
      const num  = getTag(target);
      const isSuperOwner = (config.owner || []).includes(num);
      const isDynamic    = isDynOwner(target);
      const dynOwners    = getAllOwners();
      const entry        = dynOwners[num];

      let status = "❌ Bukan Owner";
      let detail = "";
      if (isSuperOwner) {
        status = "👑 Super Owner";
        detail = "Permanen (dari konfigurasi)";
      } else if (isDynamic && entry) {
        status = "🛡️ Sub Owner";
        detail = `Ditambah: ${fmt(entry.addedAt)}\nOleh: +${entry.addedBy || "?"}`;
      }

      return sendText(sock, m.chat,
        `╭──「 *🔍 CEK OWNER* 」\n` +
        `│● User   : @${num}\n` +
        `│● Status : ${status}\n` +
        (detail ? `│● Detail : ${detail}\n` : "") +
        `╰───────────♢`,
        m
      );
    }

    // ════════════════════════════════
    //  .addowner @user — Tambah owner
    // ════════════════════════════════
    if (cmd === "addowner") {
      const target = resolveTarget(m, args);
      if (!target) {
        return sendButton(sock, m.chat, {
          text:    `*➕ Tambah Sub Owner*\n\nCara pakai:\n${p}addowner @user\n\nSub owner bisa menggunakan semua perintah owner.`,
          footer:  `${config.botName} • Owner Manager`,
          buttons: [{ id: "addowner_help", text: "📖 Cara pakai .addowner" }],
          quoted:  m,
        });
      }

      const num    = getTag(target);
      const result = addOwner(target, { addedBy: m.sender });

      if (result === "superowner") {
        return sendText(sock, m.chat,
          `╭──「 *⚠️ SUDAH OWNER* 」\n│● @${num} adalah Super Owner!\n│● Tidak perlu ditambah lagi.\n╰───────────♢`, m);
      }
      if (result === "exists") {
        return sendText(sock, m.chat,
          `╭──「 *⚠️ SUDAH ADA* 」\n│● @${num} sudah terdaftar sebagai Sub Owner.\n│● Gunakan ${p}delowner untuk menghapus.\n╰───────────♢`, m);
      }

      await sock.sendMessage(m.chat, {
        text:     `╭──「 *✅ OWNER DITAMBAH* 」\n│● User   : @${num}\n│● Status : 🛡️ Sub Owner\n│● Oleh   : @${getTag(m.sender)}\n│● Tanggal: ${fmt(Date.now())}\n╰───────────♢`,
        mentions: [target, m.sender],
      }, { quoted: m });
      return;
    }

    // ════════════════════════════════
    //  .delowner @user — Hapus owner
    // ════════════════════════════════
    if (cmd === "delowner") {
      const target = resolveTarget(m, args);
      if (!target) return sendText(sock, m.chat, `❌ Gunakan: ${p}delowner @user`, m);

      const num = getTag(target);
      if ((config.owner || []).includes(num)) {
        return sendText(sock, m.chat,
          `╭──「 *🚫 TIDAK BISA* 」\n│● @${num} adalah Super Owner!\n│● Super Owner tidak bisa dihapus dari DB.\n│● Ubah OWNER_NUMBER di file .env\n╰───────────♢`, m);
      }

      const ok = removeOwner(target);
      if (!ok) {
        return sendText(sock, m.chat,
          `╭──「 *❓ TIDAK DITEMUKAN* 」\n│● @${num} bukan Sub Owner.\n╰───────────♢`, m);
      }

      await sock.sendMessage(m.chat, {
        text:     `╭──「 *🗑️ OWNER DIHAPUS* 」\n│● User   : @${num}\n│● Oleh   : @${getTag(m.sender)}\n│● Status : Tidak lagi owner\n╰───────────♢`,
        mentions: [target, m.sender],
      }, { quoted: m });
    }
  },
};
