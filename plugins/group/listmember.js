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

module.exports = {
  command: ["listmember","anggota","member"], category: "group",
  description: "Daftar anggota grup", groupOnly:true,
  async run({ sock, m }) {
    try {
      const meta = await sock.groupMetadata(m.chat);
      const admins = meta.participants.filter(p => p.admin).map(p => p.id);
      let text = `╭──「 *👥 ANGGOTA GRUP* 」\n│● Nama  : ${meta.subject}\n│● Total : ${meta.participants.length}\n│● Admin : ${admins.length}\n│\n`;
      for (const p of meta.participants) {
        const tag = p.id.replace(/@.+/,"");
        const role = p.admin === "superadmin" ? "👑" : p.admin ? "⭐" : "👤";
        text += `│${role} @${tag}\n`;
      }
      text += "╰───────────♢";
      const mentions = meta.participants.map(p => p.id);
      await sock.sendMessage(m.chat, { text, mentions }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
