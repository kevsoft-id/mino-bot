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

const axios = require("axios");
const moment = require("moment-timezone");
const config = require("../../config");
module.exports = {
  command: ["hijriah","kalenderislam","tanggalislam"], category: "islamic",
  description: "Lihat tanggal Hijriah hari ini",
  async run({ sock, m }) {
    const today = moment().tz(config.timezone).format("DD-MM-YYYY");
    try {
      const r = await axios.get(`https://api.aladhan.com/v1/gToH/${today}`, { timeout: 10000 });
      const d = r.data?.data?.hijri;
      if (!d) throw new Error("Data tidak tersedia");
      await sock.sendMessage(m.chat, { text: `╭──「 *☪️ KALENDER HIJRIAH* 」\n│● Masehi  : ${today}\n│● Hijriah : ${d.day} ${d.month.en} ${d.year} H\n│● Arab    : ${d.month.ar}\n│● Hari    : ${d.weekday.en}\n╰───────────♢` }, { quoted: m });
    } catch(e) {
      const now = moment().tz(config.timezone);
      await sock.sendMessage(m.chat, { text: `╭──「 *☪️ KALENDER* 」\n│● Masehi: ${now.format("dddd, D MMMM YYYY")}\n│● Hijriah: Tidak tersedia (coba lagi)\n╰───────────♢` }, { quoted: m });
    }
  },
};
