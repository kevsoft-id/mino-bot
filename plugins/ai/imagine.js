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
const { ask } = require("../../lib/gemini");
module.exports = {
  command: ["imagine","gambar","aiimg"], category: "ai",
  description: "Buat gambar AI dari deskripsi",
  cooldown: 5000,
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .imagine <deskripsi>\nContoh: .imagine kucing lucu bermain bola" }, { quoted: m });
    const prompt = args.join(" ");
    await sock.sendMessage(m.chat, { text: "🎨 _Membuat gambar..._" }, { quoted: m }).catch(() => {});
    const apis = [
      `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true`,
      `https://api.ideogram.ai/generate?prompt=${encodeURIComponent(prompt)}`,
    ];
    for (const url of apis) {
      try {
        const res = await axios.get(url, { responseType: "arraybuffer", timeout: 40000 });
        const buf = Buffer.from(res.data);
        if (buf.length > 5000) {
          await sock.sendMessage(m.chat, { image: buf, caption: `🎨 *AI Image:* ${prompt}` }, { quoted: m });
          return;
        }
      } catch {}
    }
    await sock.sendMessage(m.chat, { text: "❌ Gagal generate gambar. Coba lagi." }, { quoted: m });
  },
};
