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
module.exports={
  command:["ytsearch","cariyt","youtube"],category:"search",description:"Cari video YouTube",
  async run({sock,m,args}){
    if(!args[0])return sock.sendMessage(m.chat,{text:"❌ .ytsearch <judul lagu/video>"},{quoted:m});
    const q=args.join(" ");
    try{
      const r=await axios.get(`https://api.siputzx.my.id/api/s/youtube?q=${encodeURIComponent(q)}`,{timeout:15000});
      const items=(r.data?.data||[]).slice(0,5);
      if(!items.length)throw new Error("Tidak ditemukan");
      let text=`╭──「 *🔍 YouTube: ${q}* 」\n`;
      for(const i of items) text+=`│● *${i.title}*\n│  👤 ${i.channel||"-"} | ⏱ ${i.duration||"-"}\n│  🔗 ${i.url||"-"}\n│\n`;
      text+="╰───────────♢";
      await sock.sendMessage(m.chat,{text},{quoted:m});
    }catch(e){await sock.sendMessage(m.chat,{text:"❌ "+e.message},{quoted:m});}
  },
};
