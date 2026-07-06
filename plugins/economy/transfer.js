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

const { getUser, saveUser } = require("../../lib/database");
const { getTag, formatCoins } = require("../../lib/function");
module.exports={
  command:["transfer","kirim","tf"],category:"economy",description:"Transfer koin ke user lain",
  async run({sock,m,args}){
    const mentioned=m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const target=mentioned?.[0];
    const amount=parseInt(args[mentioned?.[0]?0:1]);
    if(!target||isNaN(amount)||amount<1) return sock.sendMessage(m.chat,{text:"❌ .transfer @user <jumlah>"},{quoted:m});
    if(target===m.sender) return sock.sendMessage(m.chat,{text:"❌ Tidak bisa transfer ke diri sendiri!"},{quoted:m});
    const from=getUser(m.sender); const to=getUser(target);
    if(from.coins<amount) return sock.sendMessage(m.chat,{text:`❌ Koin tidak cukup!\n│● Punya: ${formatCoins(from.coins||0)}`},{quoted:m});
    from.coins-=amount; to.coins=(to.coins||0)+amount;
    saveUser(m.sender,from); saveUser(target,to);
    await sock.sendMessage(m.chat,{text:`╭──「 *💸 TRANSFER* 」\n│● Dari : @${getTag(m.sender)}\n│● Ke   : @${getTag(target)}\n│● Jumlah: ${formatCoins(amount)} 🪙\n│● Sisamu: ${formatCoins(from.coins)} 🪙\n╰───────────♢`,mentions:[m.sender,target]},{quoted:m});
  },
};
