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
  command:["anime","cariAnime"],category:"search",description:"Cari info anime",
  async run({sock,m,args}){
    if(!args[0])return sock.sendMessage(m.chat,{text:"❌ .anime <judul>"},{quoted:m});
    const q=args.join(" ");
    try{
      const r=await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=1`,{timeout:15000});
      const d=r.data?.data?.[0];
      if(!d)throw new Error("Tidak ditemukan");
      const text=`╭──「 *🎌 ANIME* 」\n│● Judul  : ${d.title}\n│● Jepang : ${d.title_japanese||"-"}\n│● Episode: ${d.episodes||"?"}\n│● Status : ${d.status||"-"}\n│● Genre  : ${(d.genres||[]).map(g=>g.name).join(", ")||"-"}\n│● Rating : ${d.score||"-"}/10\n│● Rank   : #${d.rank||"-"}\n│● Tipe   : ${d.type||"-"}\n│\n│ ${(d.synopsis||"").substring(0,250)}...\n╰───────────♢`;
      if(d.images?.jpg?.image_url) await sock.sendMessage(m.chat,{image:{url:d.images.jpg.image_url},caption:text},{quoted:m});
      else await sock.sendMessage(m.chat,{text},{quoted:m});
    }catch(e){await sock.sendMessage(m.chat,{text:"❌ "+e.message},{quoted:m});}
  },
};
