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

const dares=["Kirim foto wajah sekarang!","Ketik 'Aku suka kucing' 10x berturut-turut","Ceritakan mimpi terlucu yang pernah kamu alami","Tag 3 orang dan bilang kamu kangen mereka","Ketik lirik lagu yang sedang kamu suka","Kirim voice note sambil nyanyi 1 bait lagu","Tulis status WA yang memalukan selama 1 jam","Kirim chat ke orang yang kamu kagumi","Ubah nama display kamu jadi nama hewan selama 10 menit","Ceritakan momen paling canggung dalam hidupmu","Ketik semua nama mantan (kalau ada)"];
module.exports={
  command:["dare","tantangan"],category:"game",description:"Tantangan dare seru",
  async run({sock,m}){
    const d=dares[Math.floor(Math.random()*dares.length)];
    await sock.sendMessage(m.chat,{text:`╭──「 *🎭 DARE* 」\n│\n│ ${d}\n│\n╰───────────♢`},{quoted:m});
  },
};
