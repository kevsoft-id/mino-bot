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
const moment = require("moment-timezone");
module.exports={
  command:["sholat","jadwalsholat","prayer"],category:"islamic",description:"Jadwal sholat berdasarkan kota",
  async run({sock,m,args}){
    if(!args[0])return sock.sendMessage(m.chat,{text:"❌ .sholat <kota>\nContoh: .sholat Jakarta"},{quoted:m});
    const city=args.join(" ");
    try{
      const locRes=await axios.get(`http://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Indonesia&method=11`,{timeout:15000});
      const t=locRes.data?.data?.timings;
      if(!t)throw new Error("Kota tidak ditemukan");
      const date=locRes.data?.data?.date?.readable||moment().format("D MMMM YYYY");
      await sock.sendMessage(m.chat,{text:`╭──「 *🕌 JADWAL SHOLAT* 」\n│● Kota     : ${city}\n│● Tanggal  : ${date}\n│\n│● Subuh  : ${t.Fajr}\n│● Terbit : ${t.Sunrise}\n│● Dzuhur : ${t.Dhuhr}\n│● Ashar  : ${t.Asr}\n│● Maghrib: ${t.Maghrib}\n│● Isya   : ${t.Isha}\n│\n│ 🤲 Jangan lupa sholat!\n╰───────────♢`},{quoted:m});
    }catch(e){await sock.sendMessage(m.chat,{text:"❌ "+e.message},{quoted:m});}
  },
};
