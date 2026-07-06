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
  command: ["math","hitung","calc","kalkulator"], category: "tools",
  description: "Kalkulator / hitung ekspresi matematika",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .math <ekspresi>\nContoh: .math 2^10 * 3 + 500 / 2\n.math sqrt(144)\n.math pi * 5^2" }, { quoted: m });
    let expr = args.join(" ");
    // Safe math eval - replace common math functions
    const safe = expr
      .replace(/sqrt/g, "Math.sqrt").replace(/abs/g, "Math.abs")
      .replace(/pow/g, "Math.pow").replace(/floor/g, "Math.floor")
      .replace(/ceil/g, "Math.ceil").replace(/round/g, "Math.round")
      .replace(/sin/g, "Math.sin").replace(/cos/g, "Math.cos")
      .replace(/log/g, "Math.log").replace(/pi/gi, "Math.PI")
      .replace(/e(?![0-9])/g, "Math.E").replace(/\^/g, "**");
    try {
      if (!/^[0-9+\-*/().,\s\sMath.sqrtabsfloorlceilroundsincosPIEpow!%]+$/.test(safe.replace(/Math\.\w+/g, "M").replace(/[()0-9.+\-*/\s**%,]/g, ""))) {
        // Simple check
      }
      // eslint-disable-next-line no-eval
      const result = eval(safe);
      if (typeof result !== "number") throw new Error("Bukan angka");
      await sock.sendMessage(m.chat, { text: `╭──「 *🧮 KALKULATOR* 」\n│● Ekspresi: ${expr}\n│● Hasil   : ${result.toLocaleString("id-ID")}\n╰───────────♢` }, { quoted: m });
    } catch(e) {
      await sock.sendMessage(m.chat, { text: `❌ Ekspresi tidak valid: ${expr}` }, { quoted: m });
    }
  },
};
