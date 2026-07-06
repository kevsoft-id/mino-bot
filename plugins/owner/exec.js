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

const { exec } = require("child_process");
module.exports={
  command:["exec","$","shell","cmd"],category:"owner",description:"Jalankan perintah shell (OWNER ONLY)",
  ownerOnly:true,
  async run({sock,m,args,body,prefix}){
    const p=prefix||".";
    const cmd=body.replace(/^\.(exec|\$|shell|cmd)\s*/,"").trim();
    if(!cmd)return sock.sendMessage(m.chat,{text:"❌ .exec <perintah>"},{quoted:m});
    await sock.sendMessage(m.chat,{text:`⚙️ Menjalankan: \`${cmd}\``},{quoted:m}).catch(()=>{});
    exec(cmd,{timeout:30000,maxBuffer:1024*1024},(err,stdout,stderr)=>{
      const output=(stdout||"")+(stderr?"STDERR:\n"+stderr:"");
      const res=(err?`ERROR: ${err.message}\n`:"")+output;
      sock.sendMessage(m.chat,{text:`╭──「 *💻 EXEC* 」\n│$ ${cmd}\n│\n${res.substring(0,3000)||"(kosong)"}\n╰───────────♢`},{quoted:m}).catch(()=>{});
    });
  },
};
