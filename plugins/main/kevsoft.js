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

const config = require("../../config");

const TEXT = `♜ 𝗞𝗘𝗩𝗦𝗢𝗙𝗧 information ❪ ♢ ❫
╰┈ⓘ ​Turning Complex Logic into 
           Digital Reality.

​⟢━━❪ 📊 ɪɴғᴏ sᴛᴀᴛᴜs ❫━━⟣

▷ 🛠 𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗺𝗲𝗻𝘁 
         Custom Web & Apps
▷ ​🥞 𝗛𝗼𝘀𝘁𝗶𝗻𝗴 *&* 𝗗𝗲𝗽𝗹𝗼𝘆 
          High Performance

​⟢━━❪ 🎭 ᴍᴏʀᴇ ɪɴғᴏ ❫━━⟣

▷ 🏷 𝗤𝘂𝗮𝗹𝗶𝘁𝘆 : Premium Service,
        Affordable Price
▷ ​💸 𝗣𝗮𝘆𝗺𝗲𝗻𝘁 : dana/gopay/qris
      (Secure & Fast)
▷ ​🛠 𝗠𝗮𝗶𝗻 𝗡𝗼 :
      +62 858-7800-3200      (@kevsoft_id)
▷ 🐙 𝗚𝗶𝘁𝗛𝘂𝗯 : @kevsoft-id
▷ ⚙️ 𝗗𝗲𝘃.𝘁𝗼 : @kevsoft-id
▷ ✈️ 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺 : @kevsoft_id
▷ 📩 𝗚𝗺𝗮𝗶𝗹 : kevsoft.id@gmail.com
▷ 📡 𝗪𝗲𝗯𝘀𝗶𝘁𝗲 : kevsoft.developer.li


#𝗖𝗢𝗠𝗨𝗡𝗜𝗧𝗬 : 
https://dub.sh/kevsoft-comunity

#𝗖𝗛𝗔𝗡𝗡𝗘𝗟 :
https://dub.sh/kevsoft-id`;

module.exports = {
  command: ["kevsoft", "about", "creator", "kredit"],
  category: "main",
  description: "Info & kontak resmi KEVSOFT — pembuat Mino Bot Ultra",
  async run({ sock, m }) {
    const opts = { quoted: m };
    try {
      const { getImageBuffer } = require("../../lib/function");
      const buf = await getImageBuffer(config.thumbLocal || config.thumbUrl).catch(() => null);
      if (buf) return await sock.sendMessage(m.chat, { image: buf, caption: TEXT }, opts);
    } catch {}
    await sock.sendMessage(m.chat, { text: TEXT }, opts).catch(() => {});
  },
};
