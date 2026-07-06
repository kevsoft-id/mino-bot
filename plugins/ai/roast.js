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
const { getTag } = require("../../lib/function");
module.exports = {
  command: ["roast","bully","sindir"], category: "ai",
  description: "AI roast/sindir seseorang (bercanda!)",
  cooldown: 3000,
  async run({ sock, m, args }) {
    const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const target = mentioned?.[0] ? getTag(mentioned[0]) : (args[0] || getTag(m.sender));
    await sock.sendMessage(m.chat, { text: "🎤 _Menyiapkan roast..._" }, { quoted: m }).catch(() => {});
    try {
      const ans = await ask(`Roast orang bernama/nomor ${target} dengan cara yang lucu dan tidak menyinggung terlalu dalam. Gaya santai anak muda Indonesia, maksimal 4 kalimat.`);
      await sock.sendMessage(m.chat, { text: `🎤 *Roast untuk @${target}:*\n\n${ans}\n\n_(ini cuma bercanda ya!)_`, mentions: mentioned || [] }, { quoted: m });
    } catch (e) { await sock.sendMessage(m.chat, { text: `❌ ${e.message}` }, { quoted: m }); }
  },
};
