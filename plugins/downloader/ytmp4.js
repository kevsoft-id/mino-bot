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
async function dlYt(url, type) {
  const apis = [
    async () => {
      const r = await axios.get(`https://api.siputzx.my.id/api/d/${type}?url=${encodeURIComponent(url)}`, { timeout:60000 });
      if (r.data?.status && r.data?.data?.url) return { url:r.data.data.url, title:r.data.data.title||type };
      throw 0;
    },
    async () => {
      const r = await axios.get(`https://api.ryzendesu.vip/api/downloader/${type}?url=${encodeURIComponent(url)}`, { timeout:60000 });
      if (r.data?.url) return { url:r.data.url, title:r.data.title||type };
      throw 0;
    },
  ];
  for (const fn of apis) { try { return await fn(); } catch {} }
  throw new Error("Semua API gagal. Coba lagi.");
}
module.exports = {
  command: ["ytmp4","ytvideo","mp4"], category: "downloader", description: "Download video YouTube",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .ytmp4 <link YouTube>" }, { quoted: m });
    await sock.sendMessage(m.chat, { text: "⏳ Memproses video..." }, { quoted: m }).catch(() => {});
    try {
      const d = await dlYt(args[0], "ytmp4");
      await sock.sendMessage(m.chat, { video:{ url:d.url }, caption:`🎬 *${d.title}*`, mimetype:"video/mp4" }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
