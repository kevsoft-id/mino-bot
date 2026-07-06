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
module.exports = {
  command: ["twitter","twdl","xdl"], category: "downloader", description: "Download video Twitter/X",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .twitter <link Twitter/X>" }, { quoted: m });
    await sock.sendMessage(m.chat, { text: "⏳ Mendownload Twitter/X..." }, { quoted: m }).catch(() => {});
    const apis = [
      `https://api.siputzx.my.id/api/d/twitter?url=${encodeURIComponent(args[0])}`,
      `https://api.ryzendesu.vip/api/downloader/twitter?url=${encodeURIComponent(args[0])}`,
    ];
    for (const url of apis) {
      try {
        const r = await axios.get(url, { timeout:30000 });
        const vidUrl = r.data?.data?.HD || r.data?.data?.SD || r.data?.url || r.data?.video;
        if (vidUrl) {
          await sock.sendMessage(m.chat, { video:{ url:vidUrl }, caption:`🐦 Twitter/X`, mimetype:"video/mp4" }, { quoted: m });
          return;
        }
      } catch {}
    }
    await sock.sendMessage(m.chat, { text: "❌ Gagal download Twitter/X" }, { quoted: m });
  },
};
