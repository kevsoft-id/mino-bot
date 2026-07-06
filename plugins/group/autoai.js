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

const { getGroup, saveGroup } = require("../../lib/database");
module.exports = {
  command: ["autoai","aion","aioff"], category: "group",
  description: "Aktifkan auto AI di grup", adminOnly:true, groupOnly:true,
  async run({ sock, m, body, prefix, args }) {
    const p = prefix || ".";
    const isOff = body.toLowerCase().startsWith(p+"aioff");
    const mode = isOff ? "off" : (args[0]?.toLowerCase() === "off" ? "off" : "on");
    const grp = getGroup(m.chat);
    grp.autoai = mode === "on";
    saveGroup(m.chat, grp);
    await sock.sendMessage(m.chat, { text: `🤖 Auto AI *${mode.toUpperCase()}* di grup ini.\n${mode === "on" ? "Bot akan otomatis merespons semua pesan!" : ""}` }, { quoted: m });
  },
};
