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

const z={aries:{d:"21 Mar - 19 Apr",s:"Hari ini cocok untuk mulai hal baru. Energimu sedang tinggi!",l:"Merah 🔴",num:"9"},taurus:{d:"20 Apr - 20 Mei",s:"Fokus pada keuangan hari ini. Jangan terburu-buru mengambil keputusan.",l:"Hijau 🟢",num:"4"},gemini:{d:"21 Mei - 20 Jun",s:"Komunikasi lancar hari ini. Waktu yang tepat untuk berbicara dengan orang penting.",l:"Kuning 🟡",num:"5"},cancer:{d:"21 Jun - 22 Jul",s:"Perasaanmu sensitif hari ini. Jaga keseimbangan emosi.",l:"Putih ⚪",num:"2"},leo:{d:"23 Jul - 22 Agt",s:"Kamu bersinar hari ini! Percayai dirimu dan tunjukkan kemampuanmu.",l:"Emas 🟠",num:"1"},virgo:{d:"23 Agt - 22 Sep",s:"Detail-detail kecil jadi perhatian. Kerjamu akan sangat presisi.",l:"Biru 🔵",num:"6"},libra:{d:"23 Sep - 22 Okt",s:"Keseimbangan adalah kunci hari ini. Buat keputusan bijak.",l:"Pink 🩷",num:"7"},scorpio:{d:"23 Okt - 21 Nov",s:"Intuisimu kuat. Percayai naluri dan tetap misterius.",l:"Hitam 🖤",num:"8"},sagitarius:{d:"22 Nov - 21 Des",s:"Petualangan menantimu! Jangan takut mencoba hal baru.",l:"Ungu 🟣",num:"3"},capricorn:{d:"22 Des - 19 Jan",s:"Karir dan tujuan jangka panjang dalam fokus. Disiplin membawa hasil.",l:"Coklat 🤎",num:"10"},aquarius:{d:"20 Jan - 18 Feb",s:"Ide-ide kreatif mengalir deras. Waktu inovasimu!",l:"Biru Muda 🩵",num:"11"},pisces:{d:"19 Feb - 20 Mar",s:"Imajinasi dan kreativitas sedang memuncak. Luangkan waktu untuk seni.",l:"Tosca 🫧",num:"12"}};
module.exports={
  command:["zodiak","horoscope","bintang"],category:"fun",description:"Baca ramalan zodiak harian",
  async run({sock,m,args}){
    if(!args[0])return sock.sendMessage(m.chat,{text:"❌ .zodiak <nama zodiak>\nZodiak: aries taurus gemini cancer leo virgo libra scorpio sagitarius capricorn aquarius pisces"},{quoted:m});
    const key=args[0].toLowerCase();
    const d=z[key];
    if(!d)return sock.sendMessage(m.chat,{text:"❌ Zodiak tidak ditemukan. Cek ejaan!"},{quoted:m});
    await sock.sendMessage(m.chat,{text:`╭──「 *⭐ ${key.toUpperCase()}* 」\n│● Tanggal : ${d.d}\n│● Warna   : ${d.l}\n│● Angka   : ${d.num}\n│\n│ 📖 ${d.s}\n│\n╰───────────♢`},{quoted:m});
  },
};
