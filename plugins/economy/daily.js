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
const { formatCoins, msToTime } = require("../../lib/function");
const config = require("../../config");
module.exports={
  command:["daily","harian","claim"],category:"economy",description:"Klaim koin harian",
  async run({sock,m}){
    const u=getUser(m.sender);
    const now=Date.now(); const cd=24*60*60*1000;
    const last=u.lastDaily||0;
    if(now-last<cd){
      const left=cd-(now-last);
      return sock.sendMessage(m.chat,{text:`⏳ Sudah claim hari ini!\n│● Tunggu: ${msToTime(left)}`},{quoted:m});
    }
    const bonus=u.premium?config.dailyCoins*2:config.dailyCoins;
    u.coins=(u.coins||0)+bonus;
    u.lastDaily=now;
    u.xp=(u.xp||0)+50;
    saveUser(m.sender,u);
    await sock.sendMessage(m.chat,{text:`╭──「 *🎁 DAILY REWARD* 」\n│● Koin   : +${formatCoins(bonus)} 🪙\n│● Bonus  : ${u.premium?"Premium 2x!":"-"}\n│● Saldo  : ${formatCoins(u.coins)} 🪙\n│\n│ Kembali lagi besok!\n╰───────────♢`},{quoted:m});
  },
};
