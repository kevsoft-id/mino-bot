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

const truths=["Siapa crush rahasiamu saat ini?","Pernah berbohong ke orang tua? Ceritakan!","Apa hal paling memalukan yang pernah terjadi padamu?","Siapa yang paling sering kamu stalk di sosmed?","Apa hal terburuk yang pernah kamu pikirkan?","Pernah cheating waktu ujian?","Siapa yang kamu kagumi diam-diam?","Apa hal yang belum pernah kamu ceritakan ke siapapun?","Kalau bisa kembali ke masa lalu, apa yang ingin kamu ubah?","Siapa yang tidak kamu suka di sini dan kenapa?","Pernah pura-pura sakit untuk tidak sekolah/kerja?","Apa nickname memalukan yang pernah kamu punya?"];
module.exports={
  command:["truth","jujur"],category:"game",description:"Pertanyaan truth (jujur-jujuran)",
  async run({sock,m}){
    const q=truths[Math.floor(Math.random()*truths.length)];
    await sock.sendMessage(m.chat,{text:`╭──「 *💬 TRUTH* 」\n│\n│ ${q}\n│\n╰───────────♢`},{quoted:m});
  },
};
