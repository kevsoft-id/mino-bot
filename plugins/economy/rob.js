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
const { getTag, formatCoins, msToTime } = require("../../lib/function");
module.exports={
  command:["rob","rampok","curi"],category:"economy",description:"Rampok koin user lain (risiko!)",
  cooldown:5000,
  async run({sock,m}){
    const mentioned=m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const target=mentioned?.[0];
    if(!target) return sock.sendMessage(m.chat,{text:"❌ .rob @user"},{quoted:m});
    if(target===m.sender) return sock.sendMessage(m.chat,{text:"❌ Tidak bisa merampok diri sendiri!"},{quoted:m});
    const robber=getUser(m.sender); const victim=getUser(target);
    const now=Date.now(); const cd=60*60*1000;
    if(now-(robber.lastRob||0)<cd) return sock.sendMessage(m.chat,{text:`⏳ Polisi masih mencarimu!\n│● Tunggu: ${msToTime(cd-(now-(robber.lastRob||0)))}`},{quoted:m});
    if((victim.coins||0)<100) return sock.sendMessage(m.chat,{text:"❌ Korban terlalu miskin untuk dirampok! 😅"},{quoted:m});
    const success=Math.random()<0.5;
    robber.lastRob=now;
    if(success){
      const stolen=Math.floor(Math.min((victim.coins||0)*0.2,5000));
      robber.coins=(robber.coins||0)+stolen; victim.coins=(victim.coins||0)-stolen;
      saveUser(m.sender,robber); saveUser(target,victim);
      await sock.sendMessage(m.chat,{text:`╭──「 *🦹 ROB BERHASIL* 」\n│● Korban : @${getTag(target)}\n│● Dicuri : ${formatCoins(stolen)} 🪙\n│● Saldomu: ${formatCoins(robber.coins)} 🪙\n╰───────────♢`,mentions:[target]},{quoted:m});
    } else {
      const fine=Math.floor((robber.coins||0)*0.1);
      robber.coins=Math.max(0,(robber.coins||0)-fine);
      saveUser(m.sender,robber);
      await sock.sendMessage(m.chat,{text:`╭──「 *🚓 KETANGKAP POLISI* 」\n│● Gagal merampok @${getTag(target)}\n│● Denda : ${formatCoins(fine)} 🪙\n│● Saldo : ${formatCoins(robber.coins)} 🪙\n╰───────────♢`,mentions:[target]},{quoted:m});
    }
  },
};
