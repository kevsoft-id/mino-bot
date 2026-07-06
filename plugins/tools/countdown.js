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

const moment = require("moment-timezone");
const config = require("../../config");
module.exports = {
  command: ["countdown","hitung","waktu"], category: "tools",
  description: "Hitung mundur ke tanggal tertentu",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .countdown <DD-MM-YYYY>\nContoh: .countdown 17-08-2025" }, { quoted: m });
    const parts = args[0].split(/[-\/]/);
    const target = moment(`${parts[2]}-${parts[1]?.padStart(2,"0")}-${parts[0]?.padStart(2,"0")}`, "YYYY-MM-DD");
    if (!target.isValid()) return sock.sendMessage(m.chat, { text: "❌ Format tanggal tidak valid (DD-MM-YYYY)" }, { quoted: m });
    const now = moment().tz(config.timezone);
    const label = args.slice(1).join(" ") || "";
    if (target.isBefore(now)) return sock.sendMessage(m.chat, { text: "❌ Tanggal sudah berlalu!" }, { quoted: m });
    const diff = target.diff(now);
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const min = Math.floor((diff % 3600000) / 60000);
    await sock.sendMessage(m.chat, { text: `╭──「 *⏰ COUNTDOWN* 」\n│● Event  : ${label || target.format("D MMMM YYYY")}\n│● Sisa   : ${d} hari, ${h} jam, ${min} menit\n│● Tanggal: ${target.format("dddd, D MMMM YYYY")}\n╰───────────♢` }, { quoted: m });
  },
};
