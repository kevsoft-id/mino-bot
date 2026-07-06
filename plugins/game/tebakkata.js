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

const list=[{kata:"apel",p:"Buah merah/hijau"},{kata:"matahari",p:"Bersinar siang hari"},{kata:"kucing",p:"Hewan meong"},{kata:"komputer",p:"Alat elektronik kerja"},{kata:"hujan",p:"Air dari langit"},{kata:"buku",p:"Tempat ilmu"},{kata:"sepatu",p:"Alas kaki"},{kata:"bulan",p:"Satelit bumi"},{kata:"nasi",p:"Makanan pokok Indonesia"},{kata:"mobil",p:"Kendaraan roda 4"},{kata:"pohon",p:"Tumbuhan berkayu"},{kata:"lautan",p:"Hamparan air luas"},{kata:"gunung",p:"Elevasi tinggi"},{kata:"burung",p:"Hewan bisa terbang"},{kata:"rumah",p:"Tempat tinggal"},];
const active=new Map();
module.exports={
  command:["tebakkata","tebak"],category:"game",description:"Main tebak kata",
  async run({sock,m}){
    if(active.has(m.chat)){const g=active.get(m.chat);return sock.sendMessage(m.chat,{text:`❗ Game aktif!\n│● Petunjuk: ${g.p}\n│● Huruf: ${g.kata.length}`},{quoted:m});}
    const pick=list[Math.floor(Math.random()*list.length)];
    active.set(m.chat,{...pick});
    const t=setTimeout(()=>{const g=active.get(m.chat);if(!g)return;active.delete(m.chat);sock.sendMessage(m.chat,{text:`⏰ Waktu habis!\n│● Jawaban: *${g.kata}*`}).catch(()=>{});},60000);
    active.get(m.chat)._t=t;
    await sock.sendMessage(m.chat,{text:`╭──「 *🔤 TEBAK KATA* 」\n│● Petunjuk: ${pick.p}\n│● Huruf: ${pick.kata.length}\n│● Waktu: 60 detik\n╰───────────♢\n\nKetik jawabanmu!`},{quoted:m});
  },
  onMessage:async({sock,m,body})=>{
    if(!active.has(m.chat))return;const g=active.get(m.chat);
    if(body.toLowerCase().trim()===g.kata.toLowerCase()){clearTimeout(g._t);active.delete(m.chat);await sock.sendMessage(m.chat,{text:`🎉 *BENAR!* @${m.sender.replace(/@.+/,"")}!\n│● Jawaban: *${g.kata}*`,mentions:[m.sender]}).catch(()=>{});}
  },
};
