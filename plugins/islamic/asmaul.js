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

const names=[{n:"Ar-Rahman",a:"الرَّحْمَنُ",m:"Yang Maha Pengasih"},{n:"Ar-Rahim",a:"الرَّحِيمُ",m:"Yang Maha Penyayang"},{n:"Al-Malik",a:"الْمَلِكُ",m:"Yang Maha Merajai"},{n:"Al-Quddus",a:"الْقُدُّوسُ",m:"Yang Maha Suci"},{n:"As-Salam",a:"السَّلامُ",m:"Yang Maha Memberi Keselamatan"},{n:"Al-Mu'min",a:"الْمُؤْمِنُ",m:"Yang Maha Memberi Keamanan"},{n:"Al-Muhaimin",a:"الْمُهَيْمِنُ",m:"Yang Maha Memelihara"},{n:"Al-Aziz",a:"الْعَزِيزُ",m:"Yang Maha Perkasa"},{n:"Al-Jabbar",a:"الْجَبَّارُ",m:"Yang Maha Gagah"},{n:"Al-Mutakabbir",a:"الْمُتَكَبِّرُ",m:"Yang Memiliki Kebesaran"},{n:"Al-Khaliq",a:"الْخَالِقُ",m:"Yang Maha Pencipta"},{n:"Al-Bari",a:"الْبَارِئُ",m:"Yang Maha Melepaskan"},{n:"Al-Musawwir",a:"الْمُصَوِّرُ",m:"Yang Maha Membentuk"}];
module.exports={
  command:["asmaul","asma","99nama"],category:"islamic",description:"Asmaul Husna dan artinya",
  async run({sock,m}){
    const n=names[Math.floor(Math.random()*names.length)];
    await sock.sendMessage(m.chat,{text:`╭──「 *☪️ ASMAUL HUSNA* 」\n│\n│ ${n.a}\n│● Nama   : ${n.n}\n│● Makna  : ${n.m}\n│\n│ 🤲 Perbanyaklah berzikir\n╰───────────♢`},{quoted:m});
  },
};
