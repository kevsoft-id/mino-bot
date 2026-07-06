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

const { ask } = require("../../lib/gemini");
module.exports = {
  command: ["grammar","koreksi","perbaiki"], category: "ai",
  description: "Koreksi tata bahasa dengan AI",
  async run({ sock, m, args }) {
    let text = args.join(" ");
    if (!text && m.quoted?.message?.conversation) text = m.quoted.message.conversation;
    if (!text) return sock.sendMessage(m.chat, { text: "❌ .grammar <teks> atau reply pesan" }, { quoted: m });
    try {
      const ans = await ask(`Koreksi tata bahasa, ejaan, dan gaya penulisan teks berikut dalam Bahasa Indonesia. Tampilkan: (1) Teks asli (2) Teks setelah koreksi (3) Penjelasan perubahan.\n\nTeks: ${text}`);
      await sock.sendMessage(m.chat, { text: `✏️ *Koreksi Grammar:*\n\n${ans}` }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ " + e.message }, { quoted: m }); }
  },
};
