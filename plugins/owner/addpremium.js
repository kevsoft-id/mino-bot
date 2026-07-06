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
const { getTag } = require("../../lib/function");
module.exports={
  command:["addpremium","delpremium","listpremium"],category:"owner",
  description:"Kelola user premium",ownerOnly:true,
  async run({sock,m,args,body,prefix}){
    const p=prefix||".";
    if(body.toLowerCase().startsWith(p+"listpremium")){
      const {getAllUsers}=require("../../lib/database");
      const users=Object.values(getAllUsers()).filter(u=>u.premium);
      if(!users.length)return sock.sendMessage(m.chat,{text:"📋 Belum ada user premium"},{quoted:m});
      let text="╭──「 *💎 USER PREMIUM* 」\n";
      users.forEach((u,i)=>text+=`│● ${i+1}. @${u.id}\n`);
      text+="╰───────────♢";
      const mentions=users.map(u=>u.id+"@s.whatsapp.net");
      return sock.sendMessage(m.chat,{text,mentions},{quoted:m});
    }
    const isAdd=body.toLowerCase().startsWith(p+"addpremium");
    const mentioned=m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const target=mentioned?.[0]||(args[0]?(args[0].replace(/[^0-9]/g,"")+"@s.whatsapp.net"):null);
    if(!target)return sock.sendMessage(m.chat,{text:`❌ .${isAdd?"add":"del"}premium @user`},{quoted:m});
    const u=getUser(target); u.premium=isAdd; saveUser(target,u);
    await sock.sendMessage(m.chat,{text:`✅ @${getTag(target)} ${isAdd?"ditambahkan ke":"dihapus dari"} premium`,mentions:[target]},{quoted:m});
  },
};
