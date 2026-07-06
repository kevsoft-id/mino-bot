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

const { getSettings } = require("../../lib/database");
const config = require("../../config");
module.exports = {
  command: ["help","h","bantuan"], category: "tools", description: "Cara penggunaan bot",
  async run({ sock, m }) {
    const cfg = getSettings();
    const p = cfg.prefix || config.prefix;
    await sock.sendMessage(m.chat, { text:
      `╭──「 *❓ BANTUAN* 」\n│\n│ Prefix  : ${p}\n│ Contoh  : ${p}menu\n│\n│ *Kategori Menu:*\n│● ${p}menumain       → menu utama\n│● ${p}menuai         → AI Gemini\n│● ${p}menutools      → tools\n│● ${p}menudownloader → download\n│● ${p}menugroup      → grup\n│● ${p}menugame       → game\n│● ${p}menufun        → seru-seruan\n│● ${p}menusearch     → pencarian\n│● ${p}menuislamic    → islami\n│● ${p}menueconomy    → ekonomi\n│● ${p}menuconverter  → konversi\n│● ${p}menuowner      → owner only\n│\n│ *Fitur Spesial:*\n│● ${p}ai <tanya>     → chat AI\n│● ${p}addfitur       → tambah fitur via AI!\n│● ${p}settings       → konfigurasi bot\n│\n╰───────────♢`
    }, { quoted: m });
  },
};
