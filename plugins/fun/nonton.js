const rec=[["Inception (2010)","Sci-Fi/Thriller - ⭐9.0 - Mimpi dalam mimpi yang mind-blowing"],["Parasite (2019)","Drama/Thriller - ⭐8.6 - Film Korea pemenang Oscar"],["The Dark Knight (2008)","Action/Drama - ⭐9.0 - Batman vs Joker epik"],["Interstellar (2014)","Sci-Fi - ⭐8.7 - Perjalanan antar galaksi"],["Avengers: Endgame (2019)","Action - ⭐8.4 - Penutup saga MCU"],["Spirited Away (2001)","Animasi - ⭐8.6 - Masterpiece Studio Ghibli"],["Dune (2021)","Sci-Fi/Epic - ⭐8.0 - Epik fiksi ilmiah"],["Everything Everywhere All at Once","Sci-Fi - ⭐8.0 - Multiversum yang gila"],["Oppenheimer (2023)","Sejarah - ⭐8.5 - Bapak bom atom"],["Poor Things (2023)","Drama - ⭐8.0 - Visual unik dan cerita berani"]];
module.exports={
  command:["nonton","rekomendasifilm","film","movie2"],category:"fun",description:"Rekomendasi film random",
  async run({sock,m}){
    const[n,d]=rec[Math.floor(Math.random()*rec.length)];
    await sock.sendMessage(m.chat,{text:`╭──「 *🎬 REKOMENDASI FILM* 」\n│● Judul : *${n}*\n│● Genre : ${d}\n│\n│ Selamat menonton! 🍿\n╰───────────♢`},{quoted:m});
  },
};
