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
  command:["berat","weight","kg2lb"],category:"converter",description:"Konversi satuan berat",
  async run({sock,m,args}){
    if(args.length<2)return sock.sendMessage(m.chat,{text:"❌ .berat <nilai> <satuan>\nSatuan: kg g mg lb oz ton\nContoh: .berat 70 kg"},{quoted:m});
    const val=parseFloat(args[0]); const from=args[1].toLowerCase();
    if(isNaN(val))return sock.sendMessage(m.chat,{text:"❌ Nilai tidak valid"},{quoted:m});
    const toKg={kg:1,g:0.001,mg:0.000001,lb:0.453592,oz:0.0283495,ton:1000};
    if(!toKg[from])return sock.sendMessage(m.chat,{text:"❌ Satuan tidak dikenal. Gunakan: kg g mg lb oz ton"},{quoted:m});
    const kg=val*toKg[from];
    await sock.sendMessage(m.chat,{text:`╭──「 *⚖️ KONVERSI BERAT* 」\n│● Input : ${val} ${from}\n│● kg    : ${kg.toFixed(4)}\n│● gram  : ${(kg*1000).toFixed(2)}\n│● lb    : ${(kg/0.453592).toFixed(4)}\n│● oz    : ${(kg/0.0283495).toFixed(4)}\n╰───────────♢`},{quoted:m});
  },
};
