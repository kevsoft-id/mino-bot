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

const jokes=[["Kenapa programmer suka minum kopi?","Karena tanpa java mereka tidak bisa jalan! ☕😂"],["Apa persamaan programmer dan tukang masak?","Dua-duanya sering *loop* kerjaan mereka! 🔄"],["Kenapa komputer sering sakit?","Karena kebanyakan *virus*! 🦠"],["Apa bahasa pemrograman yang disukai bayi?","*Java*script... soalnya bayi sering *cry()* 😭"],["Kenapa programmer tidak suka keluar rumah?","Karena di luar tidak ada *localhost*! 🏠"],["Bagaimana cara programmer bilang 'selamat tidur'?","*404 – Sleep Not Found*! 😴"],["Kenapa ayam menyeberang jalan?","Karena *default gateway*-nya ada di seberang! 🐔"],["Knock knock. Who's there? Recursion.","Recursion who? Knock knock... 🔁"],["Berapa banyak programmer untuk mengganti lampu?","Tidak ada, itu masalah *hardware*! 💡"],["Kenapa hacker sukses?","Karena semua orang masih pakai password '123456'! 🔐"]];
module.exports={
  command:["joke","lucu","humor","ngocol"],category:"fun",description:"Joke/lelucon random",
  async run({sock,m}){
    const[q,a]=jokes[Math.floor(Math.random()*jokes.length)];
    await sock.sendMessage(m.chat,{text:`╭──「 *😂 JOKE* 」\n│● ${q}\n│\n│💡 ${a}\n╰───────────♢`},{quoted:m});
  },
};
