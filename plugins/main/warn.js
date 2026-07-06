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

const { getUser, saveUser } = require("../../lib/database");
const { getTag } = require("../../lib/function");
const MAX_WARN = 3;
module.exports = {
  command: ["warn","peringatan","hapuswarn"], category: "main",
  description: "Beri/hapus peringatan user", adminOnly: true, groupOnly: false,
  async run({ sock, m, args, body, prefix }) {
    const p = prefix || ".";
    const isReset = body.toLowerCase().startsWith(p + "hapuswarn");
    const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const target = mentioned?.[0] || (args[0] ? args[0].replace(/[^0-9]/g,"") + "@s.whatsapp.net" : null);
    if (!target) return sock.sendMessage(m.chat, { text: "❌ Tag user yang ingin diberi peringatan!" }, { quoted: m });
    const u = getUser(target);
    if (isReset) {
      u.warn = 0; saveUser(target, u);
      return sock.sendMessage(m.chat, { text: `✅ Peringatan @${getTag(target)} direset (0/${MAX_WARN})`, mentions: [target] }, { quoted: m });
    }
    u.warn = (u.warn || 0) + 1;
    const reason = args[mentioned ? 0 : 1] || "Tidak ada alasan";
    if (u.warn >= MAX_WARN) {
      u.banned = true; u.warn = 0; saveUser(target, u);
      return sock.sendMessage(m.chat, { text: `🚫 @${getTag(target)} di-BAN! (${MAX_WARN}/${MAX_WARN} peringatan)\n│● Alasan: ${reason}`, mentions: [target] }, { quoted: m });
    }
    saveUser(target, u);
    await sock.sendMessage(m.chat, { text: `⚠️ Peringatan untuk @${getTag(target)}\n│● Warn  : ${u.warn}/${MAX_WARN}\n│● Alasan: ${reason}`, mentions: [target] }, { quoted: m });
  },
};
