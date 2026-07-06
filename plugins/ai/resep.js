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
  command: ["resep","masak","recipe"], category: "ai",
  description: "Minta resep masakan dari AI",
  cooldown: 3000,
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .resep <nama masakan>\nContoh: .resep nasi goreng ayam" }, { quoted: m });
    const masakan = args.join(" ");
    await sock.sendMessage(m.chat, { text: "👨‍🍳 _Menyiapkan resep..._" }, { quoted: m }).catch(() => {});
    try {
      const ans = await ask(`Berikan resep lengkap untuk ${masakan} dengan format:\n- Bahan-bahan\n- Langkah memasak\n- Tips\n\nBahasa Indonesia yang jelas.`);
      await sock.sendMessage(m.chat, { text: `👨‍🍳 *Resep ${masakan}:*\n\n${ans}` }, { quoted: m });
    } catch (e) { await sock.sendMessage(m.chat, { text: `❌ ${e.message}` }, { quoted: m }); }
  },
};
