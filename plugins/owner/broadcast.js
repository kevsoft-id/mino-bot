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

const { getAllGroups } = require("../../lib/database");
module.exports={
  command:["broadcast","bc","siarkan"],category:"owner",description:"Broadcast pesan ke semua grup",
  ownerOnly:true,
  async run({sock,m,args}){
    if(!args[0])return sock.sendMessage(m.chat,{text:"❌ .broadcast <pesan>"},{quoted:m});
    const msg=args.join(" ");
    const groups=Object.keys(getAllGroups());
    if(!groups.length)return sock.sendMessage(m.chat,{text:"❌ Tidak ada grup tersimpan"},{quoted:m});
    let sent=0,failed=0;
    await sock.sendMessage(m.chat,{text:`📢 Mengirim ke ${groups.length} grup...`},{quoted:m});
    for(const id of groups){
      try{await sock.sendMessage(id,{text:`📢 *BROADCAST*\n\n${msg}`});sent++;}
      catch{failed++;}
      await new Promise(r=>setTimeout(r,1000));
    }
    await sock.sendMessage(m.chat,{text:`✅ Broadcast selesai!\n│● Berhasil: ${sent}\n│● Gagal   : ${failed}`},{quoted:m});
  },
};
