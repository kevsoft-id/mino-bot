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

const { chat, clearSession } = require("../../lib/gemini");
const { downloadMedia } = require("../../lib/function");
module.exports = {
  command: ["ai","gpt","chat","tanya"], category: "ai",
  description: "Chat dengan AI Gemini (konteks percakapan)",
  cooldown: 3000,
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .ai <pertanyaan>\nContoh: .ai siapa kamu?" }, { quoted: m });
    const q = args.join(" ");
    await sock.sendMessage(m.chat, { text: "🤖 _Berpikir..._" }, { quoted: m }).catch(() => {});
    try {
      const ans = await chat(m.sender + m.chat, q);
      await sock.sendMessage(m.chat, { text: `🤖 *AI:*\n\n${ans}` }, { quoted: m });
    } catch (e) {
      await sock.sendMessage(m.chat, { text: `❌ AI Error: ${e.message}\n\nPastikan GEMINI_API_KEY sudah diset di .env` }, { quoted: m });
    }
  },
};
