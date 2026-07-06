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
module.exports={
  command:["love","jodoh","lovemeter","cinta"],category:"fun",description:"Ukur cinta antara dua orang",
  async run({sock,m,args}){
    const mentioned=m.message?.extendedTextMessage?.contextInfo?.mentionedJid||[];
    let a=mentioned[0]?getTag(mentioned[0]):(args[0]||getTag(m.sender));
    let b=mentioned[1]?getTag(mentioned[1]):(args[1]||getTag(sock.user?.id||"bot"));
    const pct=Math.floor(Math.random()*101);
    const bar="█".repeat(Math.floor(pct/10))+"░".repeat(10-Math.floor(pct/10));
    let msg=pct>=80?"💕 WOW! Sangat cocok!":pct>=60?"❤️ Lumayan cocok!":pct>=40?"💛 Cukup cocok":"💔 Kurang cocok, coba lagi!";
    await sock.sendMessage(m.chat,{text:`╭──「 *💕 LOVE METER* 」\n│● ${a} ❤️ ${b}\n│● [${bar}] ${pct}%\n│● ${msg}\n╰───────────♢`},{quoted:m});
  },
};
