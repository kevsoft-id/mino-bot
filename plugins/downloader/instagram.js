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
async function dlIg(url) {
  const apis = [
    async () => {
      const r = await axios.get(`https://api.siputzx.my.id/api/d/ig?url=${encodeURIComponent(url)}`, { timeout:30000 });
      if (r.data?.status && r.data?.data) return r.data.data;
      throw 0;
    },
    async () => {
      const r = await axios.get(`https://api.ryzendesu.vip/api/downloader/ig?url=${encodeURIComponent(url)}`, { timeout:30000 });
      if (r.data?.[0]) return [{ url: r.data[0].url }];
      throw 0;
    },
  ];
  for (const fn of apis) { try { return await fn(); } catch {} }
  throw new Error("Gagal download Instagram");
}
module.exports = {
  command: ["ig","instagram","igdl"], category: "downloader", description: "Download foto/video Instagram",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .ig <link Instagram>" }, { quoted: m });
    await sock.sendMessage(m.chat, { text: "⏳ Mendownload Instagram..." }, { quoted: m }).catch(() => {});
    try {
      const items = await dlIg(args[0]);
      const arr = Array.isArray(items) ? items : [items];
      for (const item of arr.slice(0,5)) {
        const url = item.url || item.video || item.image;
        const isVid = url?.includes(".mp4") || item.type === "video";
        if (isVid) await sock.sendMessage(m.chat, { video:{ url }, caption:"📸 Instagram", mimetype:"video/mp4" }, { quoted: m });
        else await sock.sendMessage(m.chat, { image:{ url }, caption:"📸 Instagram" }, { quoted: m });
      }
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
