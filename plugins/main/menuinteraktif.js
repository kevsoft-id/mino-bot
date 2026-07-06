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

const { sendButton } = require("../../lib/button");
const config = require("../../config");

module.exports = {
  command: ["ui", "menuinteraktif", "menubtn"],
  category: "main",
  description: "Menu interaktif unik dengan gambar & tombol (button+image)",
  cooldown: 4000,
  async run({ sock, m, pluginsObj, prefix }) {
    const total = Object.values(pluginsObj).reduce((a, b) => a + b.length, 0);
    await sendButton(sock, m.chat, {
      text:
        `╭─❪ ✨ *${config.botName}* ✨ ❫\n` +
        `│\n` +
        `│ Halo! Ini adalah menu interaktif\n` +
        `│ dengan tombol asli WhatsApp 🎛️\n` +
        `│\n` +
        `│ Tersedia *${total}+* fitur siap pakai.\n` +
        `╰─────────────`,
      footer: "Mino Bot Ultra • by kevsoft-id",
      image: config.thumbLocal || config.thumbUrl,
      buttons: [
        { id: `${prefix}menu`, text: "📜 Lihat Semua Menu" },
        { id: `${prefix}profile`, text: "🖼️ Profile Canvas" },
        { id: `${prefix}kevsoft`, text: "ℹ️ Tentang Kami" },
      ],
      quoted: m,
    });
  },
};
