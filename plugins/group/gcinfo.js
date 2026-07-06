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

const moment = require("moment-timezone");
const config = require("../../config");
module.exports = {
  command: ["gcinfo","groupinfo","infogroup"], category: "group",
  description: "Info detail grup", groupOnly:true,
  async run({ sock, m }) {
    try {
      const meta = await sock.groupMetadata(m.chat);
      const admins = meta.participants.filter(p => p.admin);
      const created = moment(meta.creation*1000).tz(config.timezone).format("D MMM YYYY");
      let ppUrl; try { ppUrl = await sock.profilePictureUrl(m.chat, "image"); } catch {}
      const text = `╭──「 *ℹ️ INFO GRUP* 」\n│● Nama    : ${meta.subject}\n│● ID      : ${meta.id}\n│● Dibuat  : ${created}\n│● Anggota : ${meta.participants.length}\n│● Admin   : ${admins.length}\n│● Deskripsi:\n│${(meta.desc||"-").substring(0,200)}\n╰───────────♢`;
      if (ppUrl) await sock.sendMessage(m.chat, { image:{url:ppUrl}, caption:text }, { quoted: m });
      else await sock.sendMessage(m.chat, { text }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
