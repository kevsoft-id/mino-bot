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

const { getUser } = require("../../lib/database");
const moment = require("moment-timezone");
module.exports = {
  command: ["inventory","inv","barang"], category: "economy",
  description: "Lihat inventaris item kamu",
  async run({ sock, m }) {
    const u = getUser(m.sender);
    const inv = u.inventory || [];
    if (!inv.length) return sock.sendMessage(m.chat, { text: "📦 Inventarismu kosong!\nBeli item di .shop" }, { quoted: m });
    let text = "╭──「 *📦 INVENTARIS* 」\n";
    inv.slice(-10).forEach((i, idx) => {
      text += `│● ${idx+1}. ${i.name}\n│   Dibeli: ${moment(i.bought).fromNow()}\n`;
    });
    text += "╰───────────♢";
    await sock.sendMessage(m.chat, { text }, { quoted: m });
  },
};
