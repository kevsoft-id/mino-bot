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

const { getRuntime } = require("../../lib/function");
const os = require("os");
module.exports={
  command:["uptime","serverinfo","sysinfo"],category:"owner",description:"Info server dan uptime",ownerOnly:true,
  async run({sock,m,startTime}){
    const runtime=getRuntime(startTime);
    const mem=process.memoryUsage();
    const freeRam=os.freemem();const totalRam=os.totalmem();
    const cpu=os.cpus()[0];
    await sock.sendMessage(m.chat,{text:
      `╭──「 *🖥️ SERVER INFO* 」\n│● Uptime   : ${runtime}\n│● Platform : ${process.platform} (${os.release()})\n│● Node.js  : ${process.version}\n│● CPU      : ${cpu?.model?.split(" ").slice(-2).join(" ")||"-"}\n│● CPU Use  : ${(process.cpuUsage().user/1000000).toFixed(2)}s\n│● RAM Used : ${(mem.rss/1024/1024).toFixed(1)}MB\n│● RAM Free : ${(freeRam/1024/1024).toFixed(0)}MB/${(totalRam/1024/1024).toFixed(0)}MB\n│● Heap     : ${(mem.heapUsed/1024/1024).toFixed(1)}MB/${(mem.heapTotal/1024/1024).toFixed(1)}MB\n╰───────────♢`
    },{quoted:m});
  },
};
