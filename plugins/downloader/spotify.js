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
  command: ["spotify","spotifydl"], category: "downloader", description: "Download/info lagu Spotify",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .spotify <link Spotify>" }, { quoted: m });
    await sock.sendMessage(m.chat, { text: "⏳ Memproses Spotify..." }, { quoted: m }).catch(() => {});
    try {
      const r = await axios.get(`https://api.siputzx.my.id/api/d/spotify?url=${encodeURIComponent(args[0])}`, { timeout:30000 });
      const d = r.data?.data;
      if (!d) throw new Error("Tidak ditemukan");
      if (d.download) {
        await sock.sendMessage(m.chat, { audio:{ url:d.download }, mimetype:"audio/mpeg", ptt:false, fileName:`${d.title||"spotify"}.mp3` }, { quoted: m });
      } else {
        await sock.sendMessage(m.chat, { text: `╭──「 *🎵 SPOTIFY* 」\n│● Judul   : ${d.title||"-"}\n│● Artis   : ${d.artist||"-"}\n│● Album   : ${d.album||"-"}\n│● Durasi  : ${d.duration||"-"}\n╰───────────♢` }, { quoted: m });
      }
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
