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

function caesar(text, shift) {
  return text.split("").map(c => {
    if (/[a-zA-Z]/.test(c)) {
      const base = c >= "a" ? 97 : 65;
      return String.fromCharCode(((c.charCodeAt(0) - base + shift + 26) % 26) + base);
    }
    return c;
  }).join("");
}
module.exports = {
  command: ["caesar","rot","enkripsi"], category: "tools",
  description: "Enkripsi/dekripsi Caesar cipher",
  async run({ sock, m, args }) {
    if (args.length < 2) return sock.sendMessage(m.chat, { text: "❌ .caesar <shift> <teks>\nContoh: .caesar 13 halo dunia" }, { quoted: m });
    const shift = parseInt(args[0]);
    const text = args.slice(1).join(" ");
    if (isNaN(shift)) return sock.sendMessage(m.chat, { text: "❌ Shift harus angka" }, { quoted: m });
    const enc = caesar(text, shift);
    const dec = caesar(text, -shift);
    await sock.sendMessage(m.chat, { text: `╭──「 *🔐 CAESAR CIPHER* 」\n│● Shift   : ${shift}\n│● Asli    : ${text}\n│● Enkripsi: ${enc}\n│● Dekripsi: ${dec}\n╰───────────♢` }, { quoted: m });
  },
};
