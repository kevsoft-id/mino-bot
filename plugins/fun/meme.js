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
  command: ["meme","memes"], category: "fun",
  description: "Kirim meme random",
  async run({ sock, m, args }) {
    const q = args.join(" ") || "funny";
    const apis = [
      `https://api.siputzx.my.id/api/s/meme`,
      `https://meme-api.com/gimme`,
    ];
    for (const url of apis) {
      try {
        const r = await axios.get(url, { timeout: 10000 });
        const imgUrl = r.data?.data?.image || r.data?.url;
        if (imgUrl) {
          await sock.sendMessage(m.chat, { image: { url: imgUrl }, caption: `😂 Meme Random` }, { quoted: m });
          return;
        }
      } catch {}
    }
    await sock.sendMessage(m.chat, { text: "❌ Meme tidak tersedia saat ini" }, { quoted: m });
  },
};
