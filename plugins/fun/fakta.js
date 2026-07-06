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

const facts=["Gurita memiliki 3 jantung dan darah berwarna biru 🐙","Lebah madu mengepakkan sayap sekitar 200 kali per detik 🐝","Manusia adalah satu-satunya hewan yang menangis karena emosi 😢","Pisang secara teknis adalah buah beri, tapi stroberi bukan 🍌","Semut bisa mengangkat beban 50x berat tubuhnya 🐜","Kucing tidak bisa merasakan rasa manis 🐱","Pohon pisang bukanlah pohon, melainkan rumput raksasa 🌿","Suara 'meow' kucing hanya digunakan untuk berkomunikasi dengan manusia, bukan sesama kucing! 🐈","Selembar kertas yang dilipat 42 kali akan setinggi jarak Bumi ke Bulan 📄","Air laut menyusun sekitar 97% air di Bumi 🌊","Jantung udang berada di kepalanya 🦐","Dalam 1 menit, kamu berkedip sekitar 15-20 kali 👁️","Madu tidak pernah basi - ditemukan madu 3000 tahun di piramid dan masih bisa dimakan 🍯","Manusia memiliki lebih banyak bakteri di tubuhnya daripada sel tubuh sendiri 🦠","Kilat bisa menyambar tempat yang sama lebih dari sekali ⚡"];
module.exports={
  command:["fakta","fact","tahukah"],category:"fun",description:"Fakta unik dan menarik",
  async run({sock,m}){
    const f=facts[Math.floor(Math.random()*facts.length)];
    await sock.sendMessage(m.chat,{text:`╭──「 *🧠 FAKTA UNIK* 」\n│\n│ 💡 ${f}\n│\n╰───────────♢`},{quoted:m});
  },
};
