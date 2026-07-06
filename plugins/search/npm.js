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
  command: ["npm","npminfo","package"], category: "search",
  description: "Cari info package NPM",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .npm <nama package>" }, { quoted: m });
    try {
      const r = await axios.get(`https://registry.npmjs.org/${encodeURIComponent(args[0])}`, { timeout: 10000 });
      const d = r.data;
      const latest = d["dist-tags"]?.latest || "?";
      const v = d.versions?.[latest];
      await sock.sendMessage(m.chat, { text:
        `╭──「 *📦 NPM PACKAGE* 」\n│● Nama    : ${d.name}\n│● Versi   : ${latest}\n│● Deskripsi: ${(d.description||"").substring(0,150)}\n│● Penulis : ${d.maintainers?.[0]?.name||"-"}\n│● Lisensi : ${v?.license||"-"}\n│● Install : npm install ${d.name}\n│● Link    : https://npmjs.com/package/${d.name}\n╰───────────♢`
      }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ Package tidak ditemukan" }, { quoted: m }); }
  },
};
