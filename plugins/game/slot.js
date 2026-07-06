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

const { getUser, saveUser } = require("../../lib/database");
const { formatCoins } = require("../../lib/function");
const symbols=["🍒","🍊","🍋","🍇","⭐","💎","🎰","7️⃣"];
module.exports={
  command:["slot","mesin"],category:"game",description:"Main slot machine (taruhan koin)",
  cooldown:3000,
  async run({sock,m,args}){
    const bet=parseInt(args[0]||"100");
    if(isNaN(bet)||bet<10)return sock.sendMessage(m.chat,{text:"❌ .slot <jumlah taruhan> (min 10 koin)"},{quoted:m});
    const u=getUser(m.sender);
    if((u.coins||0)<bet)return sock.sendMessage(m.chat,{text:`❌ Koin tidak cukup!\n│● Koinmu: ${formatCoins(u.coins||0)} 🪙`},{quoted:m});
    const r=[symbols[Math.floor(Math.random()*symbols.length)],symbols[Math.floor(Math.random()*symbols.length)],symbols[Math.floor(Math.random()*symbols.length)]];
    let win=0,msg="";
    if(r[0]===r[1]&&r[1]===r[2]){
      if(r[0]==="💎"){win=bet*50;msg="💎 JACKPOT BERLIAN!";}
      else if(r[0]==="7️⃣"){win=bet*20;msg="7️⃣ LUCKY SEVEN!";}
      else if(r[0]==="⭐"){win=bet*10;msg="⭐ TRIPLE STAR!";}
      else{win=bet*5;msg="🎰 TRIPLE WIN!";}
    } else if(r[0]===r[1]||r[1]===r[2]||r[0]===r[2]){win=bet*2;msg="✅ Dua sama - kamu untung!";}
    else{win=0;msg="❌ Tidak ada yang sama!";}
    u.coins=(u.coins||0)-bet+(win);
    saveUser(m.sender,u);
    await sock.sendMessage(m.chat,{text:`╭──「 *🎰 SLOT MACHINE* 」\n│\n│  ${r.join(" | ")}\n│\n│● ${msg}\n│● Taruhan: ${formatCoins(bet)} 🪙\n│● ${win>0?"Menang":"Kalah"}: ${formatCoins(win>0?win-bet:bet)} 🪙\n│● Saldo : ${formatCoins(u.coins)} 🪙\n╰───────────♢`},{quoted:m});
  },
};
