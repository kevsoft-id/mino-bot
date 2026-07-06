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

const { getTag } = require("../../lib/function");
module.exports = {
  command: ["kick","remove","keluarkan"], category: "group",
  description: "Kick member dari grup", adminOnly:true, groupOnly:true, botAdminOnly:true,
  async run({ sock, m, args }) {
    const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    let target = mentioned?.[0] || (args[0] ? (args[0].replace(/[^0-9]/g,"") + "@s.whatsapp.net") : null);
    if (!target) return sock.sendMessage(m.chat, { text: "❌ Tag user yang ingin dikick!" }, { quoted: m });
    try {
      await sock.groupParticipantsUpdate(m.chat, [target], "remove");
      await sock.sendMessage(m.chat, { text: `✅ @${getTag(target)} berhasil dikick!`, mentions:[target] }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
