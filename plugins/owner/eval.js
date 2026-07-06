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

module.exports={
  command:["eval","=>","run"],category:"owner",description:"Jalankan kode JavaScript (OWNER ONLY)",
  ownerOnly:true,
  async run({sock,m,args,body,prefix}){
    const p=prefix||".";
    let code=body.replace(/^(\.eval|\.=>|\.run)\s*/,"");
    if(!code&&m.quoted?.message?.conversation)code=m.quoted.message.conversation;
    if(!code)return sock.sendMessage(m.chat,{text:"❌ .eval <kode JS>"},{quoted:m});
    const start=Date.now();
    try{
      // eslint-disable-next-line no-eval
      let result=await eval(`(async()=>{${code}})()`);
      const elapsed=Date.now()-start;
      if(typeof result!=="string")result=JSON.stringify(result,null,2);
      await sock.sendMessage(m.chat,{text:`╭──「 *⚙️ EVAL* 」\n│● Input:\n${code}\n│\n│● Output (${elapsed}ms):\n${(result||"undefined").substring(0,2000)}\n╰───────────♢`},{quoted:m});
    }catch(e){
      await sock.sendMessage(m.chat,{text:`╭──「 *❌ EVAL ERROR* 」\n│● ${e.name}: ${e.message}\n╰───────────♢`},{quoted:m});
    }
  },
};
