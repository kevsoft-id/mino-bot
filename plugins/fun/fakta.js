const facts=["Gurita memiliki 3 jantung dan darah berwarna biru 🐙","Lebah madu mengepakkan sayap sekitar 200 kali per detik 🐝","Manusia adalah satu-satunya hewan yang menangis karena emosi 😢","Pisang secara teknis adalah buah beri, tapi stroberi bukan 🍌","Semut bisa mengangkat beban 50x berat tubuhnya 🐜","Kucing tidak bisa merasakan rasa manis 🐱","Pohon pisang bukanlah pohon, melainkan rumput raksasa 🌿","Suara 'meow' kucing hanya digunakan untuk berkomunikasi dengan manusia, bukan sesama kucing! 🐈","Selembar kertas yang dilipat 42 kali akan setinggi jarak Bumi ke Bulan 📄","Air laut menyusun sekitar 97% air di Bumi 🌊","Jantung udang berada di kepalanya 🦐","Dalam 1 menit, kamu berkedip sekitar 15-20 kali 👁️","Madu tidak pernah basi - ditemukan madu 3000 tahun di piramid dan masih bisa dimakan 🍯","Manusia memiliki lebih banyak bakteri di tubuhnya daripada sel tubuh sendiri 🦠","Kilat bisa menyambar tempat yang sama lebih dari sekali ⚡"];
module.exports={
  command:["fakta","fact","tahukah"],category:"fun",description:"Fakta unik dan menarik",
  async run({sock,m}){
    const f=facts[Math.floor(Math.random()*facts.length)];
    await sock.sendMessage(m.chat,{text:`╭──「 *🧠 FAKTA UNIK* 」\n│\n│ 💡 ${f}\n│\n╰───────────♢`},{quoted:m});
  },
};
