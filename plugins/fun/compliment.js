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

const c=["Kamu adalah orang yang luar biasa! ✨","Senyummu bisa menerangi hari seseorang ☀️","Kamu lebih kuat dari yang kamu kira 💪","Dunia lebih baik dengan kehadiranmu 🌍","Kamu punya kemampuan yang tidak dimiliki semua orang 🎯","Kreativitasmu sungguh menginspirasi 🎨","Kamu adalah teman yang seseorang harapkan 💙","Caramu memandang masalah sangat unik dan cerdas 🧠","Kamu memiliki sifat yang membuat orang nyaman 🤗","Setiap usahamu pasti membuahkan hasil 🌱"];
const { getTag } = require("../../lib/function");
module.exports={
  command:["compliment","pujian","puji"],category:"fun",description:"Berikan pujian untuk seseorang",
  async run({sock,m}){
    const mentioned=m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const target=mentioned?.[0]||m.sender;
    const num=getTag(target);
    const msg=c[Math.floor(Math.random()*c.length)];
    await sock.sendMessage(m.chat,{text:`╭──「 *💝 PUJIAN* 」\n│● Untuk @${num}:\n│\n│ ${msg}\n│\n╰───────────♢`,mentions:[target]},{quoted:m});
  },
};
