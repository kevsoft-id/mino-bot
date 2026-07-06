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
  command:["suhu","temperature","temp"],category:"converter",description:"Konversi suhu C/F/K",
  async run({sock,m,args}){
    if(args.length<2)return sock.sendMessage(m.chat,{text:"❌ .suhu <nilai> <C/F/K>\nContoh: .suhu 100 C"},{quoted:m});
    const val=parseFloat(args[0]); const from=args[1].toUpperCase();
    if(isNaN(val))return sock.sendMessage(m.chat,{text:"❌ Nilai tidak valid"},{quoted:m});
    let C,F,K;
    if(from==="C"){C=val;F=C*9/5+32;K=C+273.15;}
    else if(from==="F"){F=val;C=(F-32)*5/9;K=C+273.15;}
    else if(from==="K"){K=val;C=K-273.15;F=C*9/5+32;}
    else return sock.sendMessage(m.chat,{text:"❌ Gunakan C, F, atau K"},{quoted:m});
    await sock.sendMessage(m.chat,{text:`╭──「 *🌡️ KONVERSI SUHU* 」\n│● Celsius   : ${C.toFixed(2)}°C\n│● Fahrenheit: ${F.toFixed(2)}°F\n│● Kelvin    : ${K.toFixed(2)} K\n╰───────────♢`},{quoted:m});
  },
};
