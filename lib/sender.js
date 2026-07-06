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

const { getImageBuffer } = require("./function");
const { sendButton, sendList } = require("./button");
const config = require("../config");

// Re-export dari button.js supaya plugin bisa import satu tempat
module.exports.sendButton = sendButton;
module.exports.sendList   = sendList;

// ── sendText ────────────────────────────────────────────────────────────────
async function sendText(sock, jid, text, quoted = null) {
  return sock.sendMessage(jid, { text }, quoted ? { quoted } : {}).catch(() => {});
}

// ── sendImage ───────────────────────────────────────────────────────────────
/**
 * Kirim gambar dengan caption (opsional).
 * @param {string|Buffer} image - URL / path file / Buffer
 * @param {string} caption
 * @param {object} quoted
 */
async function sendImage(sock, jid, image, caption = "", quoted = null) {
  const buf = await getImageBuffer(image).catch(() => null);
  const opts = quoted ? { quoted } : {};
  if (buf) return sock.sendMessage(jid, { image: buf, caption }, opts).catch(() => {});
  return sendText(sock, jid, caption || "_(gambar gagal dimuat)_", quoted);
}

// ── sendImageButton ─────────────────────────────────────────────────────────
/**
 * Shortcut: kirim gambar + teks + tombol dalam satu panggilan.
 * Wrapper tipis dari sendButton agar kode plugin lebih ringkas.
 *
 * @example
 * await sendImageButton(sock, jid, {
 *   image: "https://example.com/img.jpg",
 *   text: "Pilih opsi:",
 *   footer: "Mino Bot",
 *   buttons: [{ id: "ok", text: "✅ OK" }, { id: "batal", text: "❌ Batal" }],
 *   quoted: m,
 * });
 */
async function sendImageButton(sock, jid, opts = {}) {
  return sendButton(sock, jid, opts);
}

// ── sendMenu ────────────────────────────────────────────────────────────────
async function sendMenu(sock, jid, opts = {}) {
  const { image, caption = "", footer = "", title = config.botName, quoted } = opts;
  const full = (title ? `*${title}*\n\n` : "") + caption + (footer ? `\n\n_${footer}_` : "");
  const buf = await getImageBuffer(image).catch(() => null);
  const qOpts = quoted ? { quoted } : {};
  try {
    if (buf) return await sock.sendMessage(jid, { image: buf, caption: full }, qOpts);
    return await sock.sendMessage(jid, { text: full }, qOpts);
  } catch {
    return sock.sendMessage(jid, { text: full }, qOpts).catch(() => {});
  }
}

// ── sendReact ───────────────────────────────────────────────────────────────
async function sendReact(sock, key, emoji) {
  return sock.sendMessage(key.remoteJid, { react: { text: emoji, key } }).catch(() => {});
}

module.exports = {
  sendText,
  sendImage,
  sendImageButton,
  sendMenu,
  sendReact,
  sendButton,
  sendList,
};
