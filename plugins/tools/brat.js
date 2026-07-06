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
  command: ["brat","brattext"], category: "tools", description: "Buat teks gaya BRAT",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .brat <teks>" }, { quoted: m });
    const text = args.join(" ");
    try {
      const res = await axios.get(`https://api.siputzx.my.id/api/maker/brat?text=${encodeURIComponent(text)}`, { responseType:"arraybuffer", timeout:15000 });
      const buf = Buffer.from(res.data);
      if (buf.length > 3000) { await sock.sendMessage(m.chat, { image: buf, caption: `🎨 ${text}` }, { quoted: m }); return; }
    } catch {}
    // Fallback: plain brat-style text
    await sock.sendMessage(m.chat, { text: `_${text.toLowerCase()}_` }, { quoted: m });
  },
};
