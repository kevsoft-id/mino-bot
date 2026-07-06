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

const rec=[["Inception (2010)","Sci-Fi/Thriller - ⭐9.0 - Mimpi dalam mimpi yang mind-blowing"],["Parasite (2019)","Drama/Thriller - ⭐8.6 - Film Korea pemenang Oscar"],["The Dark Knight (2008)","Action/Drama - ⭐9.0 - Batman vs Joker epik"],["Interstellar (2014)","Sci-Fi - ⭐8.7 - Perjalanan antar galaksi"],["Avengers: Endgame (2019)","Action - ⭐8.4 - Penutup saga MCU"],["Spirited Away (2001)","Animasi - ⭐8.6 - Masterpiece Studio Ghibli"],["Dune (2021)","Sci-Fi/Epic - ⭐8.0 - Epik fiksi ilmiah"],["Everything Everywhere All at Once","Sci-Fi - ⭐8.0 - Multiversum yang gila"],["Oppenheimer (2023)","Sejarah - ⭐8.5 - Bapak bom atom"],["Poor Things (2023)","Drama - ⭐8.0 - Visual unik dan cerita berani"]];
module.exports={
  command:["nonton","rekomendasifilm","film","movie2"],category:"fun",description:"Rekomendasi film random",
  async run({sock,m}){
    const[n,d]=rec[Math.floor(Math.random()*rec.length)];
    await sock.sendMessage(m.chat,{text:`╭──「 *🎬 REKOMENDASI FILM* 」\n│● Judul : *${n}*\n│● Genre : ${d}\n│\n│ Selamat menonton! 🍿\n╰───────────♢`},{quoted:m});
  },
};
