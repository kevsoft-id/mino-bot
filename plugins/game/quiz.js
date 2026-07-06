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

const questions = [
  {q:"Ibu kota Indonesia?",a:"jakarta",h:"J***rta"},{q:"7 x 8?",a:"56",h:"5*"},{q:"Penemu telepon?",a:"graham bell",h:"G***** B***"},
  {q:"Planet terbesar?",a:"jupiter",h:"J*****r"},{q:"Provinsi Indonesia?",a:"38",h:"3*"},{q:"Presiden pertama RI?",a:"soekarno",h:"S*****no"},
  {q:"Mata uang Jepang?",a:"yen",h:"Y**"},{q:"Benua terluas?",a:"asia",h:"A**a"},{q:"Sisi segitiga?",a:"3",h:"*"},
  {q:"Penemu bola lampu?",a:"thomas edison",h:"T***** E*****"},{q:"Bahasa pemrograman ular?",a:"python",h:"P****n"},
  {q:"Ibukota Jepang?",a:"tokyo",h:"T***o"},{q:"2^10?",a:"1024",h:"1**4"},{q:"Rumus luas lingkaran?",a:"phi r kuadrat",h:"π r²"},
  {q:"Negara terbesar di dunia?",a:"rusia",h:"R***a"},{q:"Ibukota Australia?",a:"canberra",h:"C*****a"},
  {q:"Pencipta teori relativitas?",a:"einstein",h:"E*****in"},{q:"Tulang terpanjang tubuh manusia?",a:"femur",h:"F***r"},
];
const active = new Map();
module.exports = {
  command:["quiz","kuis"], category:"game", description:"Main kuis pengetahuan umum",
  async run({sock,m}) {
    if (active.has(m.chat)) {
      const q = active.get(m.chat);
      return sock.sendMessage(m.chat,{text:`❗ Kuis aktif!\n│● ${q.q}\n│● Hint: ${q.h}`},{quoted:m});
    }
    const pick = questions[Math.floor(Math.random()*questions.length)];
    active.set(m.chat,{...pick});
    const timer = setTimeout(()=>{
      const g=active.get(m.chat); if(!g) return; active.delete(m.chat);
      sock.sendMessage(m.chat,{text:`⏰ Waktu habis!\n│● Jawaban: *${g.a}*`}).catch(()=>{});
    },45000);
    active.get(m.chat)._t = timer;
    await sock.sendMessage(m.chat,{text:`╭──「 *🎯 KUIS* 」\n│● ${pick.q}\n│● Hint: ${pick.h}\n│● Waktu: 45 detik\n╰───────────♢`},{quoted:m});
  },
  onMessage: async({sock,m,body})=>{
    if (!active.has(m.chat)) return;
    const q=active.get(m.chat);
    if (body.toLowerCase().trim().includes(q.a.toLowerCase())) {
      clearTimeout(q._t); active.delete(m.chat);
      await sock.sendMessage(m.chat,{text:`🎉 *BENAR!* @${m.sender.replace(/@.+/,"")} menjawab!\n│● Jawaban: *${q.a}*`,mentions:[m.sender]}).catch(()=>{});
    }
  },
};
