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

const { ask } = require("../../lib/gemini");
module.exports = {
  command: ["inspirasi","kata2","insprasi"], category: "fun",
  description: "Kata inspirasi random dari AI",
  async run({ sock, m }) {
    try {
      const themes = ["kerja keras","cinta","persahabatan","sukses","bersyukur","mimpi","perjalanan"];
      const t = themes[Math.floor(Math.random() * themes.length)];
      const ans = await ask(`Berikan 1 kata-kata inspirasi pendek (1-2 kalimat) tentang ${t}. Tidak perlu nama penulis. Bahasa Indonesia yang puitis.`);
      await sock.sendMessage(m.chat, { text: `💫 _${ans}_` }, { quoted: m });
    } catch(e) {
      const list = ["Hidup adalah perjalanan, bukan tujuan.","Mimpi bukan sesuatu yang kamu tiduri, tapi sesuatu yang menghentikanmu tidur.","Jangan berhenti ketika kamu lelah. Berhentilah ketika kamu sudah selesai.","Kamu lebih berani dari yang kamu percaya."];
      await sock.sendMessage(m.chat, { text: `💫 _${list[Math.floor(Math.random()*list.length)]}_` }, { quoted: m });
    }
  },
};
