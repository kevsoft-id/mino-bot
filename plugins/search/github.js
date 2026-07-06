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
  command:["github","gh","gitprofil"],category:"search",description:"Cari profil GitHub",
  async run({sock,m,args}){
    if(!args[0])return sock.sendMessage(m.chat,{text:"❌ .github <username>"},{quoted:m});
    try{
      const r=await axios.get(`https://api.github.com/users/${args[0]}`,{timeout:10000,headers:{"User-Agent":"Mozilla/5.0"}});
      const d=r.data;
      const text=`╭──「 *🐙 GITHUB* 」\n│● Nama    : ${d.name||d.login}\n│● Username: @${d.login}\n│● Bio     : ${d.bio||"-"}\n│● Repo    : ${d.public_repos}\n│● Follower: ${d.followers}\n│● Following: ${d.following}\n│● Lokasi  : ${d.location||"-"}\n│● Link    : ${d.html_url}\n╰───────────♢`;
      if(d.avatar_url) await sock.sendMessage(m.chat,{image:{url:d.avatar_url},caption:text},{quoted:m});
      else await sock.sendMessage(m.chat,{text},{quoted:m});
    }catch(e){await sock.sendMessage(m.chat,{text:"❌ User tidak ditemukan"},{quoted:m});}
  },
};
