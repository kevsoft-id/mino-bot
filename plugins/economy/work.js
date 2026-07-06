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
const { formatCoins, msToTime, pickRandom } = require("../../lib/function");
const config = require("../../config");
const jobs=["🧑‍💻 Programming","🚗 Uber driver","📦 Kurir","🍕 Chef","🎨 Desainer","📝 Penulis","🎵 Musisi","🧹 Cleaning service","📊 Akuntan","🏗️ Tukang bangunan"];
module.exports={
  command:["work","kerja","bekerja"],category:"economy",description:"Kerja untuk dapatkan koin",
  cooldown:5000,
  async run({sock,m}){
    const u=getUser(m.sender);
    const now=Date.now(); const cd=30*60*1000;
    const last=u.lastWork||0;
    if(now-last<cd) return sock.sendMessage(m.chat,{text:`⏳ Kamu masih lelah!\n│● Tunggu: ${msToTime(cd-(now-last))}`},{quoted:m});
    const job=pickRandom(jobs);
    const min=config.workMinCoins||50; const max=config.workMaxCoins||300;
    const earned=Math.floor(Math.random()*(max-min+1))+min;
    u.coins=(u.coins||0)+earned;
    u.lastWork=now;
    u.xp=(u.xp||0)+10;
    saveUser(m.sender,u);
    await sock.sendMessage(m.chat,{text:`╭──「 *💼 KERJA* 」\n│● Profesi: ${job}\n│● Gaji   : +${formatCoins(earned)} 🪙\n│● Saldo  : ${formatCoins(u.coins)} 🪙\n│\n│ Kerja lagi dalam 30 menit!\n╰───────────♢`},{quoted:m});
  },
};
