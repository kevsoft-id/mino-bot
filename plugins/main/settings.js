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

const { getSettings, saveSettings } = require("../../lib/database");
const { sendText } = require("../../lib/sender");
const config = require("../../config");
module.exports = {
  command: ["settings", "sett", "config"], category: "main",
  description: "Lihat & ubah semua pengaturan bot",
  usage: ".settings | .settings <key> <value>",
  ownerOnly: true,
  async run({ sock, m, args }) {
    const cfg = getSettings();
    if (!args[0]) {
      const text = `╭──「 *⚙️ PENGATURAN BOT* 」\n` +
        `│● botName     : ${cfg.botName}\n` +
        `│● prefix      : ${cfg.prefix}\n` +
        `│● mode        : ${cfg.mode}\n` +
        `│● autoAI      : ${cfg.autoAI}\n` +
        `│● antiLink    : ${cfg.antiLink}\n` +
        `│● antiSpam    : ${cfg.antiSpam}\n` +
        `│● readMessage : ${cfg.readMessage}\n` +
        `│● autoTyping  : ${cfg.autoTyping}\n` +
        `│● geminiModel : ${cfg.geminiModel}\n` +
        `╰───────────♢\n\n` +
        `*Cara ubah:*\n.settings <key> <value>\n\n*Contoh:*\n.settings botName Mino Ultra\n.settings mode self\n.settings autoAI true\n.settings antiLink true\n.settings prefix !`;
      return sendText(sock, m.chat, text, m);
    }
    const key = args[0].toLowerCase();
    const val = args.slice(1).join(" ");
    const allowed = ["botname","prefix","mode","autoai","antilink","antispam","readmessage","autotyping","geminimodel"];
    const keyMap = { botname:"botName", prefix:"prefix", mode:"mode", autoai:"autoAI",
      antilink:"antiLink", antispam:"antiSpam", readmessage:"readMessage",
      autotyping:"autoTyping", geminimodel:"geminiModel" };
    if (!allowed.includes(key)) return sendText(sock, m.chat, `❌ Key tidak dikenal. Key tersedia:\n${allowed.join(", ")}`, m);
    const realKey = keyMap[key];
    let parsed = val;
    if (["autoAI","antiLink","antiSpam","readMessage","autoTyping"].includes(realKey))
      parsed = val === "true" || val === "1";
    cfg[realKey] = parsed;
    // Also update live config
    config[realKey] = parsed;
    saveSettings(cfg);
    await sendText(sock, m.chat, `✅ *${realKey}* diubah ke: *${parsed}*`, m);
  },
};
