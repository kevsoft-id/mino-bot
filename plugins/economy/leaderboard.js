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

const { getAllUsers } = require("../../lib/database");
const { formatCoins } = require("../../lib/function");
module.exports={
  command:["leaderboard","lb","topkoin","ranking"],category:"economy",description:"Top 10 terkaya",
  async run({sock,m}){
    const users=Object.values(getAllUsers());
    const sorted=users.sort((a,b)=>(b.coins||0)-(a.coins||0)).slice(0,10);
    if(!sorted.length) return sock.sendMessage(m.chat,{text:"❌ Belum ada data"},{quoted:m});
    let text=`╭──「 *🏆 LEADERBOARD* 」\n│\n`;
    const medals=["🥇","🥈","🥉","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];
    sorted.forEach((u,i)=>{text+=`│${medals[i]} @${u.id} — ${formatCoins(u.coins||0)} 🪙\n`;});
    text+="│\n╰───────────♢";
    const mentions=sorted.map(u=>u.id+"@s.whatsapp.net");
    await sock.sendMessage(m.chat,{text,mentions},{quoted:m});
  },
};
