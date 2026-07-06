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
const { getSettings } = require("../../lib/database");
const config = require("../../config");
const moment = require("moment-timezone");
const os = require("os");
module.exports = {
  command: ["info","botinfo","sysinfo"], category: "tools", description: "Info lengkap bot & sistem",
  async run({ sock, m, startTime }) {
    const cfg = getSettings();
    const runtime = getRuntime(startTime);
    const now = moment().tz(config.timezone).format("dddd, D MMMM YYYY HH:mm:ss");
    const usedMem = ((os.totalmem()-os.freemem())/1024/1024).toFixed(0);
    const totalMem = (os.totalmem()/1024/1024).toFixed(0);
    const cpu = os.cpus()[0]?.model || "Unknown";
    await sock.sendMessage(m.chat, { text:
      `╭──「 *🤖 ${cfg.botName||config.botName}* 」\n│● Versi   : 2.0.0 Ultra\n│● Owner   : ${config.ownerName}\n│● Mode    : ${cfg.mode||config.mode}\n│● Prefix  : ${cfg.prefix||config.prefix}\n│● AI      : Gemini (${cfg.geminiModel||config.geminiModel})\n│\n├──「 *💻 SISTEM* 」\n│● Runtime : ${runtime}\n│● Waktu   : ${now}\n│● RAM     : ${usedMem}MB / ${totalMem}MB\n│● Platform: ${process.platform}\n│● Node.js : ${process.version}\n│● CPU     : ${cpu}\n╰───────────♢`
    }, { quoted: m });
  },
};
