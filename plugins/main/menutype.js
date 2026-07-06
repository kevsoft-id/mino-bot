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

const { formatCategoryMenu } = require("../../lib/menu");
const { sendMenu } = require("../../lib/sender");
const { getSettings } = require("../../lib/database");
const config = require("../../config");
const fs = require("fs");
module.exports = {
  command: "menutype", category: "system", description: "Auto menu kategori (internal)",
  async run({ sock, m, matchedCategory, pluginsObj }) {
    const cfg = getSettings();
    const cmds = pluginsObj[matchedCategory] || [];
    if (!cmds.length) return sock.sendMessage(m.chat, { text: `❌ Kategori *${matchedCategory}* kosong.` }, { quoted: m });
    const text = formatCategoryMenu(matchedCategory, cmds, cfg.botName || config.botName);
    let img = fs.existsSync(config.thumbLocal) ? config.thumbLocal : config.thumbUrl;
    await sendMenu(sock, m.chat, { image: img, caption: text, title: `${cfg.botName || config.botName} - ${matchedCategory.toUpperCase()}`, footer: `${cmds.length} perintah`, quoted: m });
  },
};
