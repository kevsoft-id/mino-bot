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

const { getGroup, saveGroup } = require("../../lib/database");
module.exports = {
  command: ["welcome","setwelcome","goodbye","setgoodbye"], category: "group",
  description: "Atur pesan welcome/goodbye", adminOnly:true, groupOnly:true,
  async run({ sock, m, args, body, prefix }) {
    const p = prefix || ".";
    const isWelcome = !body.toLowerCase().startsWith(p + "goodbye") && !body.toLowerCase().startsWith(p + "setgoodbye");
    const isSet = body.toLowerCase().startsWith(p + "set");
    const grp = getGroup(m.chat);
    if (isSet) {
      if (!args[0]) return sock.sendMessage(m.chat, { text: `❌ .${isWelcome?"setwelcome":"setgoodbye"} <pesan>\nVariabel: @user @group` }, { quoted: m });
      const msg = args.join(" ");
      if (isWelcome) grp.welcomeMsg = msg; else grp.goodbyeMsg = msg;
      saveGroup(m.chat, grp);
      return sock.sendMessage(m.chat, { text: `✅ Pesan ${isWelcome?"welcome":"goodbye"} disimpan!` }, { quoted: m });
    }
    const mode = (args[0]||"").toLowerCase();
    if (!["on","off"].includes(mode)) return sock.sendMessage(m.chat, { text: `❌ .${isWelcome?"welcome":"goodbye"} on/off` }, { quoted: m });
    if (isWelcome) grp.welcome = mode === "on"; else grp.goodbye = mode === "on";
    saveGroup(m.chat, grp);
    await sock.sendMessage(m.chat, { text: `✅ ${isWelcome?"Welcome":"Goodbye"} message *${mode.toUpperCase()}*` }, { quoted: m });
  },
};
