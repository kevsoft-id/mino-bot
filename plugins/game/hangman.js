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

const words=[{w:"javascript",h:"Bahasa pemrograman web"},{w:"indonesia",h:"Nama negara kita"},{w:"komputer",h:"Alat elektronik pintar"},{w:"algoritma",h:"Langkah-langkah pemecahan masalah"},{w:"database",h:"Tempat menyimpan data"},{w:"internet",h:"Jaringan komputer global"},{w:"android",h:"OS mobile Google"},{w:"animasi",h:"Gerak gambar"},{w:"fotografi",h:"Seni mengambil foto"},{w:"teknologi",h:"Ilmu pengetahuan terapan"}];
const active=new Map();
const stages=["😵","😢","😟","😕","😐","🙂","😄"];
module.exports={
  command:["hangman","gantung"],category:"game",description:"Tebak kata hangman",
  async run({sock,m}){
    if(active.has(m.chat)){const g=active.get(m.chat);return sock.sendMessage(m.chat,{text:`❗ Hangman aktif!\n│● Kata: ${g.display.join(" ")}\n│● Nyawa: ${stages[g.lives]}×${g.lives}\n│● Salah: ${g.wrong.join(",")||"-"}`},{quoted:m});}
    const pick=words[Math.floor(Math.random()*words.length)];
    const game={word:pick.w,hint:pick.h,display:pick.w.split("").map(()=>"_"),wrong:[],lives:6};
    active.set(m.chat,game);
    const t=setTimeout(()=>{const g=active.get(m.chat);if(!g)return;active.delete(m.chat);sock.sendMessage(m.chat,{text:`⏰ Hangman selesai!\n│● Jawaban: *${g.word}*`}).catch(()=>{});},120000);
    active.get(m.chat)._t=t;
    await sock.sendMessage(m.chat,{text:`╭──「 *🎭 HANGMAN* 」\n│● Petunjuk: ${pick.h}\n│● Kata   : ${game.display.join(" ")}\n│● Nyawa  : ${stages[6]} 6x\n│● Waktu  : 2 menit\n╰───────────♢\n\nTebak satu huruf atau kata lengkap!`},{quoted:m});
  },
  onMessage:async({sock,m,body})=>{
    if(!active.has(m.chat))return;const g=active.get(m.chat);
    const guess=body.toLowerCase().trim();
    if(guess.length===0)return;
    if(guess===g.word){clearTimeout(g._t);active.delete(m.chat);return sock.sendMessage(m.chat,{text:`🎉 *BENAR!* @${m.sender.replace(/@.+/,"")} menebak kata *${g.word}*!`,mentions:[m.sender]}).catch(()=>{});}
    if(guess.length!==1||!/[a-z]/.test(guess))return;
    if(g.display.every(c=>c!=="_")||g.wrong.includes(guess)||g.word.includes(guess)&&g.display.includes(guess[0]))return;
    if(g.word.includes(guess)){
      g.word.split("").forEach((c,i)=>{if(c===guess)g.display[i]=c;});
      if(!g.display.includes("_")){clearTimeout(g._t);active.delete(m.chat);return sock.sendMessage(m.chat,{text:`🎉 *SELESAI!* Kata: *${g.word}*`}).catch(()=>{});}
      await sock.sendMessage(m.chat,{text:`✅ Huruf "${guess}" ada!\n│● ${g.display.join(" ")}\n│● Nyawa: ${stages[g.lives]}×${g.lives}`}).catch(()=>{});
    } else {
      g.wrong.push(guess);g.lives--;
      if(g.lives<=0){clearTimeout(g._t);active.delete(m.chat);return sock.sendMessage(m.chat,{text:`💀 *GAME OVER!*\n│● Jawaban: *${g.word}*`}).catch(()=>{});}
      await sock.sendMessage(m.chat,{text:`❌ Huruf "${guess}" tidak ada!\n│● ${g.display.join(" ")}\n│● Nyawa: ${stages[g.lives]}×${g.lives}\n│● Salah: ${g.wrong.join(",")}`}).catch(()=>{});
    }
  },
};
