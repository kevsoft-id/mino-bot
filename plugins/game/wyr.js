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

const list=[["Punya uang banyak tapi tidak punya cinta","Punya cinta tapi tidak punya uang"],["Bisa terbang","Bisa jadi tidak terlihat"],["Tidak bisa bicara seumur hidup","Tidak bisa diam seumur hidup"],["Tinggal di masa depan 100 tahun lagi","Kembali ke 100 tahun lalu"],["Makan makanan favorit setiap hari","Makan makanan baru berbeda setiap hari"],["Tidak bisa tertawa","Tidak bisa menangis"],["Terkenal tapi miskin","Kaya tapi tidak dikenal"],["Punya kemampuan membaca pikiran","Bisa bicara semua bahasa di dunia"],];
module.exports={
  command:["wyr","milih","would"],category:"game",description:"Would You Rather - pilih salah satu!",
  async run({sock,m}){
    const [a,b]=list[Math.floor(Math.random()*list.length)];
    await sock.sendMessage(m.chat,{text:`╭──「 *🤔 WOULD YOU RATHER* 」\n│\n│ 🅰️ ${a}\n│\n│ — atau —\n│\n│ 🅱️ ${b}\n│\n╰───────────♢`},{quoted:m});
  },
};
