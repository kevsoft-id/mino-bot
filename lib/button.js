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

/**
 * Kirim pesan interaktif: gambar + teks + tombol.
 *
 * Urutan percobaan (dari format paling baru ke lama):
 *   1. interactiveMessage → nativeFlowMessage  (Baileys modern / WA terbaru)
 *   2. buttonsMessage                          (Baileys legacy)
 *   3. Fallback: teks/gambar biasa            (selalu berhasil)
 *
 * @param {object} sock     - Socket Baileys
 * @param {string} jid      - ID penerima
 * @param {object} opts
 * @param {string}  opts.text     - Teks utama
 * @param {string}  opts.footer   - Footer kecil di bawah tombol
 * @param {string|Buffer} opts.image - URL / path / buffer gambar (opsional)
 * @param {Array}   opts.buttons  - [{ id, text }] atau ["teks"]
 * @param {object}  opts.quoted   - Pesan yang di-quote (opsional)
 *
 * @example
 * await sendButton(sock, jid, {
 *   text: "Pilih opsi berikut:",
 *   footer: "Mino Bot Ultra",
 *   image: "https://example.com/img.jpg",
 *   buttons: [
 *     { id: "pilih_1", text: "✅ Ya" },
 *     { id: "pilih_2", text: "❌ Tidak" },
 *   ],
 *   quoted: m,
 * });
 */
async function sendButton(sock, jid, opts = {}) {
  const { text = "", footer = "", image = null, buttons = [], quoted = null } = opts;
  const qOpts = quoted ? { quoted } : {};
  const buf = image ? await getImageBuffer(image).catch(() => null) : null;

  // ── Normalisasi tombol ──────────────────────────────────────────────────
  const normalizeBtn = (b, i) => ({
    id:   (b && b.id)   || `btn_${i}`,
    text: (b && b.text) || String(b),
  });
  const normBtns = buttons.map(normalizeBtn);

  // ── Format 1: interactiveMessage (Baileys ≥ 6.x / WA modern) ───────────
  try {
    const nativeBtns = normBtns.map(b => ({
      name: "quick_reply",
      buttonParamsJson: JSON.stringify({ display_text: b.text, id: b.id }),
    }));

    // Bangun header: gambar atau teks judul
    let header;
    if (buf) {
      // Upload gambar terlebih dahulu, lalu gunakan sebagai header
      const uploaded = await sock.sendMessage(jid, { image: buf, caption: text, footer, buttons: [], viewOnce: false }, { ...qOpts, upload: true }).catch(() => null);
      // Jika upload helper tidak tersedia, lempar agar masuk Format 2
      if (!uploaded) throw new Error("upload_unavailable");

      header = {
        hasMediaAttachment: true,
        imageMessage: uploaded.message?.imageMessage || buf,
      };
    } else {
      header = { hasMediaAttachment: false, title: text };
    }

    return await sock.sendMessage(jid, {
      interactiveMessage: {
        header,
        body:   { text: buf ? text : "" },
        footer: { text: footer },
        nativeFlowMessage: { buttons: nativeBtns },
      },
    }, qOpts);
  } catch (_e1) { /* lanjut ke format berikutnya */ }

  // ── Format 2: buttonsMessage (Baileys legacy / WA lama) ─────────────────
  try {
    const btns = normBtns.map(b => ({
      buttonId:   b.id,
      buttonText: { displayText: b.text },
      type: 1,
    }));
    const content = {
      text,
      footer,
      buttons: btns,
      headerType: buf ? 4 : 1,
    };
    if (buf) content.image = buf;
    return await sock.sendMessage(jid, content, qOpts);
  } catch (_e2) { /* lanjut ke fallback */ }

  // ── Format 3: Fallback teks + gambar ────────────────────────────────────
  const listStr = normBtns.map((b, i) => `${i + 1}. ${b.text}`).join("\n");
  const fallback = [text, listStr, footer ? `_${footer}_` : ""].filter(Boolean).join("\n\n");
  if (buf) return sock.sendMessage(jid, { image: buf, caption: fallback }, qOpts).catch(() => {});
  return sock.sendMessage(jid, { text: fallback }, qOpts).catch(() => {});
}

/**
 * Kirim pesan list interaktif (menu bertingkat).
 *
 * @param {object} sock
 * @param {string} jid
 * @param {object} opts
 * @param {string}  opts.text        - Teks utama
 * @param {string}  opts.footer      - Footer
 * @param {string}  opts.title       - Judul di atas teks
 * @param {string}  opts.buttonText  - Label tombol pembuka list
 * @param {Array}   opts.sections    - [{ title, rows: [{ id, title, description }] }]
 * @param {object}  opts.quoted
 *
 * @example
 * await sendList(sock, jid, {
 *   text: "Pilih menu:",
 *   footer: "Mino Bot",
 *   buttonText: "Lihat Menu",
 *   sections: [{
 *     title: "Fitur AI",
 *     rows: [
 *       { id: "gpt", title: "GPT-4o",   description: "Chat AI canggih" },
 *       { id: "gem", title: "Gemini",   description: "AI dari Google" },
 *     ],
 *   }],
 * });
 */
async function sendList(sock, jid, opts = {}) {
  const {
    text = "",
    footer = "",
    title = "",
    buttonText = "Lihat Pilihan",
    sections = [],
    quoted = null,
  } = opts;
  const qOpts = quoted ? { quoted } : {};

  try {
    return await sock.sendMessage(jid, { text, footer, title, buttonText, sections }, qOpts);
  } catch {
    let fallback = text + "\n\n";
    for (const s of sections) {
      fallback += `*${s.title}*\n`;
      for (const r of s.rows || [])
        fallback += `▸ ${r.title}${r.description ? " — " + r.description : ""}\n`;
      fallback += "\n";
    }
    if (footer) fallback += `_${footer}_`;
    return sock.sendMessage(jid, { text: fallback.trim() }, qOpts).catch(() => {});
  }
}

module.exports = { sendButton, sendList };
