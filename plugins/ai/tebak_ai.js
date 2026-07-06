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
module.exports = {
  command: ["tebakgambar","whodis","apakah"], category: "ai",
  description: "AI tebak siapa/apa dalam gambar",
  cooldown: 4000,
  async run({ sock, m, args }) {
    const target = m.quoted || { key: m.key, message: m.message, type: m.type };
    const msgType = target?.type || Object.keys(target?.message || {})[0];
    if (!["imageMessage"].includes(msgType)) return sock.sendMessage(m.chat, { text: "❌ Reply gambar dulu!" }, { quoted: m });
    const { downloadMedia } = require("../../lib/function");
    await sock.sendMessage(m.chat, { text: "🔍 _AI sedang menebak..._" }, { quoted: m }).catch(() => {});
    try {
      const buf = await downloadMedia(sock, target);
      const b64 = buf.toString("base64");
      const prompt = args.join(" ") || "Siapa atau apa yang ada di gambar ini? Jelaskan secara detail.";
      const ans = await ask(prompt, null, b64);
      await sock.sendMessage(m.chat, { text: `🤖 *AI Tebak:*\n\n${ans}` }, { quoted: m });
    } catch (e) { await sock.sendMessage(m.chat, { text: `❌ ${e.message}` }, { quoted: m }); }
  },
};
