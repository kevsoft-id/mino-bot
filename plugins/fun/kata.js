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

const mutiara=["Jangan hitung hari-harimu, buat setiap hari berarti. — Muhammad Ali","Kesuksesan bukanlah kunci kebahagiaan. Kebahagiaan adalah kunci kesuksesan. — Albert Schweitzer","Hidup adalah mimpi bagi yang bijaksana, permainan bagi yang bodoh, komedi bagi yang kaya, dan tragedi bagi yang miskin. — Sholom Aleichem","Lebih baik gagal dalam orisinalitas daripada sukses dalam peniruan. — Herman Melville","Kamu tidak perlu menjadi hebat untuk memulai, tapi kamu harus memulai untuk menjadi hebat. — Zig Ziglar","Percaya diri adalah fondasi dari kesuksesan. — Marcus Garvey","Orang-orang yang berpikir mereka bisa dan mereka tidak bisa, keduanya benar. — Henry Ford","Hidup tanpa cinta ibarat pohon tanpa bunga atau buah. — Kahlil Gibran"];
module.exports={
  command:["mutiara","quote","kutipan"],category:"fun",description:"Kata-kata mutiara inspiratif",
  async run({sock,m}){
    const q=mutiara[Math.floor(Math.random()*mutiara.length)];
    await sock.sendMessage(m.chat,{text:`╭──「 *💬 KATA MUTIARA* 」\n│\n│ "${q}"\n│\n╰───────────♢`},{quoted:m});
  },
};
