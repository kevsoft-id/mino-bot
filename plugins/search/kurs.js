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
  command:["kurs","valas","currency","tukar"],category:"search",description:"Cek kurs mata uang",
  async run({sock,m,args}){
    const amount=parseFloat(args[0])||1;
    const from=(args[1]||"USD").toUpperCase();
    const to=(args[2]||"IDR").toUpperCase();
    try{
      const r=await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`,{timeout:10000});
      const rate=r.data?.rates?.[to];
      if(!rate)throw new Error("Kode mata uang tidak ditemukan");
      const result=(amount*rate).toLocaleString("id-ID",{maximumFractionDigits:2});
      await sock.sendMessage(m.chat,{text:`╭──「 *💱 KURS* 」\n│● ${amount.toLocaleString()} ${from}\n│● = ${result} ${to}\n│● Rate: 1 ${from} = ${rate.toLocaleString()} ${to}\n╰───────────♢`},{quoted:m});
    }catch(e){await sock.sendMessage(m.chat,{text:"❌ "+e.message},{quoted:m});}
  },
};
