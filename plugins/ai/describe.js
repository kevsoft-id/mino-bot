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
const { downloadMedia } = require("../../lib/function");
module.exports = {
  command: ["describe","deskripsikan","ailihat","ocr"], category: "ai",
  description: "AI mendeskripsikan/membaca isi gambar",
  cooldown: 4000,
  async run({ sock, m, args }) {
    const target = m.quoted || { key: m.key, message: m.message, type: m.type };
    const msgType = target?.type || Object.keys(target?.message || {})[0];
    if (!["imageMessage","stickerMessage"].includes(msgType))
      return sock.sendMessage(m.chat, { text: "❌ Reply gambar dulu!" }, { quoted: m });
    const prompt = args.join(" ") || "Deskripsikan gambar ini secara detail dalam Bahasa Indonesia.";
    await sock.sendMessage(m.chat, { text: "🔍 _AI menganalisis gambar..._" }, { quoted: m }).catch(() => {});
    try {
      const buf = await downloadMedia(sock, target);
      const b64 = buf.toString("base64");
      const ans = await ask(prompt, null, b64, "image/jpeg");
      await sock.sendMessage(m.chat, { text: `🤖 *Analisis Gambar:*\n\n${ans}` }, { quoted: m });
    } catch (e) {
      await sock.sendMessage(m.chat, { text: `❌ ${e.message}` }, { quoted: m });
    }
  },
};
