const mutiara=["Jangan hitung hari-harimu, buat setiap hari berarti. — Muhammad Ali","Kesuksesan bukanlah kunci kebahagiaan. Kebahagiaan adalah kunci kesuksesan. — Albert Schweitzer","Hidup adalah mimpi bagi yang bijaksana, permainan bagi yang bodoh, komedi bagi yang kaya, dan tragedi bagi yang miskin. — Sholom Aleichem","Lebih baik gagal dalam orisinalitas daripada sukses dalam peniruan. — Herman Melville","Kamu tidak perlu menjadi hebat untuk memulai, tapi kamu harus memulai untuk menjadi hebat. — Zig Ziglar","Percaya diri adalah fondasi dari kesuksesan. — Marcus Garvey","Orang-orang yang berpikir mereka bisa dan mereka tidak bisa, keduanya benar. — Henry Ford","Hidup tanpa cinta ibarat pohon tanpa bunga atau buah. — Kahlil Gibran"];
module.exports={
  command:["mutiara","quote","kutipan"],category:"fun",description:"Kata-kata mutiara inspiratif",
  async run({sock,m}){
    const q=mutiara[Math.floor(Math.random()*mutiara.length)];
    await sock.sendMessage(m.chat,{text:`╭──「 *💬 KATA MUTIARA* 」\n│\n│ "${q}"\n│\n╰───────────♢`},{quoted:m});
  },
};
