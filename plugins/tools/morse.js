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

const MORSE = { A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--..",0:"-----",1:".----",2:"..---",3:"...--",4:"....-",5:".....",6:"-....",7:"--...",8:"---..",9:"----." };
const RMORSE = Object.fromEntries(Object.entries(MORSE).map(([k,v]) => [v,k]));
module.exports = {
  command: ["morse"], category: "tools", description: "Encode/decode morse code",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .morse <teks>\n.morse decode <-- . -.-- ->" }, { quoted: m });
    const isDecode = args[0].toLowerCase() === "decode";
    const text = isDecode ? args.slice(1).join(" ") : args.join(" ");
    try {
      let result;
      if (isDecode) result = text.split(" / ").map(w => w.split(" ").map(c => RMORSE[c]||"?").join("")).join(" ");
      else result = text.toUpperCase().split(" ").map(w => w.split("").map(c => MORSE[c]||"?").join(" ")).join(" / ");
      await sock.sendMessage(m.chat, { text: `╭──「 *MORSE* 」\n│● Input : ${text}\n│● Output: ${result}\n╰───────────♢` }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
