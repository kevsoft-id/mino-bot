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

module.exports={
  command:["gclist","listgrup","grouplist"],category:"owner",description:"Daftar semua grup bot",ownerOnly:true,
  async run({sock,m}){
    try{
      const groups=await sock.groupFetchAllParticipating();
      const list=Object.values(groups);
      if(!list.length)return sock.sendMessage(m.chat,{text:"❌ Bot belum di grup manapun"},{quoted:m});
      let text=`╭──「 *📋 DAFTAR GRUP (${list.length})* 」\n`;
      list.forEach((g,i)=>{text+=`│● ${i+1}. ${g.subject} (${g.participants.length} anggota)\n│   ${g.id}\n`;});
      text+="╰───────────♢";
      await sock.sendMessage(m.chat,{text},{quoted:m});
    }catch(e){await sock.sendMessage(m.chat,{text:"❌ "+e.message},{quoted:m});}
  },
};
