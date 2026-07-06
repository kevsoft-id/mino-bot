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
  command: ["password","passgen","buatpassword"], category: "tools",
  description: "Generate password acak yang kuat",
  async run({ sock, m, args }) {
    const length = Math.min(Math.max(parseInt(args[0]) || 16, 8), 64);
    const type = (args[1] || "all").toLowerCase();
    const chars = {
      lower: "abcdefghijklmnopqrstuvwxyz",
      upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      num: "0123456789",
      sym: "!@#$%^&*()_+-=[]{}|;:,.<>?"
    };
    let pool = chars.lower;
    if (type !== "lower") { pool += chars.upper; pool += chars.num; }
    if (type === "all" || type === "complex") pool += chars.sym;
    let pass = "";
    for (let i = 0; i < length; i++) pass += pool[Math.floor(Math.random() * pool.length)];
    // Strength
    const strength = length >= 16 && pool.includes("!") ? "🔴 Sangat Kuat" : length >= 12 ? "🟠 Kuat" : "🟡 Sedang";
    await sock.sendMessage(m.chat, { text: `╭──「 *🔐 PASSWORD GENERATOR* 」\n│● Password : \`${pass}\`\n│● Panjang  : ${length} karakter\n│● Kekuatan : ${strength}\n│\n│ ⚠️ Simpan dengan aman!\n╰───────────♢` }, { quoted: m });
  },
};
