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

const j=["✅ Ya, pasti!","✅ Tentu saja!","✅ Kemungkinan besar iya","✅ Sangat mungkin!","✅ Iya!","🤔 Tidak yakin, coba lagi","🤔 Mungkin saja...","🤔 Tanyakan nanti","❌ Tidak","❌ Sangat tidak mungkin","❌ Jangan berharap","❌ Nope!"];
module.exports={
  command:["8ball","ramal","prediksi"],category:"game",description:"Ramalan ajaib 8-ball",
  async run({sock,m,args}){
    if(!args[0])return sock.sendMessage(m.chat,{text:"❌ .8ball <pertanyaan>"},{quoted:m});
    const ans=j[Math.floor(Math.random()*j.length)];
    await sock.sendMessage(m.chat,{text:`╭──「 *🎱 8BALL* 」\n│● Pertanyaan: ${args.join(" ")}\n│● Jawaban   : ${ans}\n╰───────────♢`},{quoted:m});
  },
};
