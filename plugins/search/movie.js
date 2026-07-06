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
  command:["movie","film","imdb"],category:"search",description:"Cari info film di database",
  async run({sock,m,args}){
    if(!args[0])return sock.sendMessage(m.chat,{text:"❌ .movie <judul film>"},{quoted:m});
    const q=args.join(" ");
    try{
      const r=await axios.get(`https://www.omdbapi.com/?t=${encodeURIComponent(q)}&apikey=trilogy`,{timeout:10000});
      const d=r.data;
      if(d.Response==="False")throw new Error("Film tidak ditemukan");
      const text=`╭──「 *🎬 MOVIE INFO* 」\n│● Judul  : ${d.Title}\n│● Tahun  : ${d.Year}\n│● Genre  : ${d.Genre}\n│● Sutradara: ${d.Director}\n│● Rating : ${d.imdbRating}/10\n│● Durasi : ${d.Runtime}\n│● Bahasa : ${d.Language}\n│\n│ ${(d.Plot||"").substring(0,300)}\n╰───────────♢`;
      if(d.Poster&&d.Poster!=="N/A") await sock.sendMessage(m.chat,{image:{url:d.Poster},caption:text},{quoted:m});
      else await sock.sendMessage(m.chat,{text},{quoted:m});
    }catch(e){await sock.sendMessage(m.chat,{text:"❌ "+e.message},{quoted:m});}
  },
};
