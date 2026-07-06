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
module.exports={
  command:["gamble","judi","taruhan"],category:"economy",description:"Taruhan koin (50% menang)",
  cooldown:3000,
  async run({sock,m,args}){
    const u=getUser(m.sender);
    let amount=args[0]==="all"?u.coins:parseInt(args[0]);
    if(!amount||isNaN(amount)||amount<10) return sock.sendMessage(m.chat,{text:`❌ .gamble <jumlah|all>\nMin: 10 koin\n│● Saldomu: ${formatCoins(u.coins||0)}`},{quoted:m});
    if(amount>u.coins) return sock.sendMessage(m.chat,{text:`❌ Koin tidak cukup!\n│● Punya: ${formatCoins(u.coins||0)}`},{quoted:m});
    if(amount>50000) return sock.sendMessage(m.chat,{text:"❌ Maks taruhan: 50.000 koin"},{quoted:m});
    const win=Math.random()<0.5;
    u.coins=win?(u.coins+amount):(u.coins-amount);
    saveUser(m.sender,u);
    await sock.sendMessage(m.chat,{text:`╭──「 *🎲 GAMBLE* 」\n│● ${win?"🎉 MENANG!":"💔 KALAH!"}\n│● Taruhan : ${formatCoins(amount)} 🪙\n│● ${win?"+":"-"}${formatCoins(amount)} 🪙\n│● Saldo   : ${formatCoins(u.coins)} 🪙\n╰───────────♢`},{quoted:m});
  },
};
