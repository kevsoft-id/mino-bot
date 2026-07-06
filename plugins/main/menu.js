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

const { loadAllPlugins, formatMenuCaption } = require("../../lib/menu");
const { sendMenu } = require("../../lib/sender");
const { getTag, getRuntime } = require("../../lib/function");
const { getSettings } = require("../../lib/database");
const config = require("../../config");
const path = require("path");
const fs = require("fs");
module.exports = {
  command: "menu", category: "main", description: "Tampilkan semua menu bot",
  async run({ sock, m, startTime }) {
    const tag = getTag(m.sender);
    const runtime = getRuntime(startTime);
    const pluginsDir = path.join(__dirname, "../../plugins");
    const pluginsObj = loadAllPlugins(pluginsDir);
    const cfg = getSettings();
    const mode = (cfg.mode || config.mode) === "public" ? "public" : "self";
    const caption = formatMenuCaption(pluginsObj, cfg.botName || config.botName, config.ownerName, runtime, tag, mode);
    let img = fs.existsSync(config.thumbLocal) ? config.thumbLocal : config.thumbUrl;
    await sendMenu(sock, m.chat, { image: img, caption, title: cfg.botName || config.botName, footer: `Runtime: ${runtime}`, quoted: m });
  },
};
