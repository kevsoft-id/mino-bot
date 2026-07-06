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
const { getTag, formatCoins } = require("../../lib/function");
module.exports={
  command:["balance","saldo","wallet","koin"],category:"economy",description:"Cek saldo koin",
  async run({sock,m}){
    const mentioned=m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const target=mentioned?.[0]||m.sender;
    const u=getUser(target);
    const num=getTag(target);
    await sock.sendMessage(m.chat,{text:`╭──「 *💰 SALDO* 」\n│● User    : @${num}\n│● Koin    : ${formatCoins(u.coins||0)} 🪙\n│● Level   : ${u.level||1}\n│● XP      : ${u.xp||0}\n│● Premium : ${u.premium?"✅":"❌"}\n╰───────────♢`,mentions:[target]},{quoted:m});
  },
};
