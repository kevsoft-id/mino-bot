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
  command: ["carbon","code2img","kodeimg"], category: "tools", description: "Buat screenshot kode yang cantik",
  async run({ sock, m, args }) {
    let code = args.join(" ");
    if (!code && m.quoted?.message?.conversation) code = m.quoted.message.conversation;
    if (!code) return sock.sendMessage(m.chat, { text: "❌ .carbon <kode> atau reply pesan kode" }, { quoted: m });
    await sock.sendMessage(m.chat, { text: "🎨 _Membuat carbon..._" }, { quoted: m }).catch(() => {});
    try {
      const res = await axios.post("https://carbonara.solopov.dev/api/cook", { code, theme:"dracula", fontFamily:"Fira Code", language:"auto" }, { responseType:"arraybuffer", timeout:30000 });
      await sock.sendMessage(m.chat, { image: Buffer.from(res.data), caption: "💻 Carbon Code" }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
