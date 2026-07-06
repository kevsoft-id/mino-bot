const duas=[{n:"Doa Sebelum Makan",ar:"اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",id:"Ya Allah, berkahilah kami dalam apa yang Engkau rezekikan kepada kami dan jagalah kami dari azab neraka"},{n:"Doa Sesudah Makan",ar:"الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",id:"Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami orang-orang Muslim"},{n:"Doa Sebelum Tidur",ar:"بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",id:"Dengan nama-Mu ya Allah, aku mati dan aku hidup"},{n:"Doa Bangun Tidur",ar:"الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَمَا أَمَاتَنَا",id:"Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami"},{n:"Doa Masuk Kamar Mandi",ar:"اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",id:"Ya Allah, aku berlindung kepada-Mu dari setan laki-laki dan setan perempuan"},{n:"Doa Keluar Kamar Mandi",ar:"غُفْرَانَكَ",id:"Aku memohon ampunanmu (ya Allah)"},{n:"Doa Keluar Rumah",ar:"بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لا حَوْلَ وَلا قُوَّةَ إِلا بِاللَّهِ",id:"Dengan nama Allah, aku bertawakal kepada Allah. Tiada daya dan kekuatan kecuali dengan Allah"},{n:"Doa Masuk Masjid",ar:"اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",id:"Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu"}];
module.exports={
  command:["doa","doa2","dailydoa"],category:"islamic",description:"Doa harian Islam",
  async run({sock,m,args}){
    const q=(args[0]||"").toLowerCase();
    const found=q?duas.find(d=>d.n.toLowerCase().includes(q)||d.id.toLowerCase().includes(q)):duas[Math.floor(Math.random()*duas.length)];
    const d=found||duas[Math.floor(Math.random()*duas.length)];
    await sock.sendMessage(m.chat,{text:`╭──「 *🤲 ${d.n.toUpperCase()}* 」\n│\n│ ${d.ar}\n│\n│ _${d.id}_\n│\n│ 🌙 Semoga bermanfaat!\n╰───────────♢`},{quoted:m});
  },
};
