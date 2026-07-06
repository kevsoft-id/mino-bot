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

module.exports = {
  command: ["hex","hexadecimal"], category: "tools",
  description: "Encode/decode teks ke hexadecimal",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .hex <teks>\n.hex decode <hex>" }, { quoted: m });
    const isDecode = args[0].toLowerCase() === "decode";
    const text = isDecode ? args.slice(1).join(" ") : args.join(" ");
    try {
      const result = isDecode
        ? Buffer.from(text.replace(/\s/g,""), "hex").toString("utf-8")
        : Buffer.from(text).toString("hex");
      await sock.sendMessage(m.chat, { text: `╭──「 *HEX* 」\n│● Mode  : ${isDecode?"Decode":"Encode"}\n│● Input : ${text.substring(0,100)}\n│● Output: ${result.substring(0,500)}\n╰───────────♢` }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ " + e.message }, { quoted: m }); }
  },
};
