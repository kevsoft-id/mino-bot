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

const choices=["batu","kertas","gunting"];
const beats={batu:"gunting",kertas:"batu",gunting:"kertas"};
const emojis={batu:"🪨",kertas:"📄",gunting:"✂️"};
module.exports={
  command:["rps","suit","batukertasgunting"],category:"game",description:"Main suit/RPS",
  async run({sock,m,args}){
    const p=(args[0]||"").toLowerCase();
    if(!choices.includes(p))return sock.sendMessage(m.chat,{text:"❌ .rps <batu/kertas/gunting>"},{quoted:m});
    const bot=choices[Math.floor(Math.random()*3)];
    let result;
    if(p===bot)result="🤝 *SERI!*";
    else if(beats[p]===bot)result="🎉 *KAMU MENANG!*";
    else result="💀 *BOT MENANG!*";
    await sock.sendMessage(m.chat,{text:`╭──「 *✂️ SUIT* 」\n│● Kamu : ${emojis[p]} ${p}\n│● Bot  : ${emojis[bot]} ${bot}\n│● Hasil: ${result}\n╰───────────♢`},{quoted:m});
  },
};
