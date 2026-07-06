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

const axios = require("axios");
const books=["abu-dawud","tirmidzi","nasai","ibnu-majah","malik","ahmad","darimi"];
module.exports={
  command:["hadits","hadis"],category:"islamic",description:"Baca hadits random dari berbagai kitab",
  async run({sock,m,args}){
    const book=args[0]||books[Math.floor(Math.random()*books.length)];
    const num=Math.floor(Math.random()*100)+1;
    try{
      const r=await axios.get(`https://api.hadith.gading.dev/books/${book}/${num}`,{timeout:10000});
      const d=r.data?.data;
      if(!d)throw new Error("Tidak ditemukan");
      await sock.sendMessage(m.chat,{text:`╭──「 *📚 HADITS* 」\n│● Kitab : ${book.toUpperCase()}\n│● No    : ${d.number}\n│\n│ ${(d.arab||"").substring(0,300)}\n│\n│ _${(d.id||"").substring(0,400)}_\n│\n│ 🤲 Amalkan!\n╰───────────♢`},{quoted:m});
    }catch(e){await sock.sendMessage(m.chat,{text:`❌ Coba kitab lain. Tersedia: ${books.join(", ")}`},{quoted:m});}
  },
};
