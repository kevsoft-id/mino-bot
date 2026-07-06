const names=[{n:"Ar-Rahman",a:"الرَّحْمَنُ",m:"Yang Maha Pengasih"},{n:"Ar-Rahim",a:"الرَّحِيمُ",m:"Yang Maha Penyayang"},{n:"Al-Malik",a:"الْمَلِكُ",m:"Yang Maha Merajai"},{n:"Al-Quddus",a:"الْقُدُّوسُ",m:"Yang Maha Suci"},{n:"As-Salam",a:"السَّلامُ",m:"Yang Maha Memberi Keselamatan"},{n:"Al-Mu'min",a:"الْمُؤْمِنُ",m:"Yang Maha Memberi Keamanan"},{n:"Al-Muhaimin",a:"الْمُهَيْمِنُ",m:"Yang Maha Memelihara"},{n:"Al-Aziz",a:"الْعَزِيزُ",m:"Yang Maha Perkasa"},{n:"Al-Jabbar",a:"الْجَبَّارُ",m:"Yang Maha Gagah"},{n:"Al-Mutakabbir",a:"الْمُتَكَبِّرُ",m:"Yang Memiliki Kebesaran"},{n:"Al-Khaliq",a:"الْخَالِقُ",m:"Yang Maha Pencipta"},{n:"Al-Bari",a:"الْبَارِئُ",m:"Yang Maha Melepaskan"},{n:"Al-Musawwir",a:"الْمُصَوِّرُ",m:"Yang Maha Membentuk"}];
module.exports={
  command:["asmaul","asma","99nama"],category:"islamic",description:"Asmaul Husna dan artinya",
  async run({sock,m}){
    const n=names[Math.floor(Math.random()*names.length)];
    await sock.sendMessage(m.chat,{text:`╭──「 *☪️ ASMAUL HUSNA* 」\n│\n│ ${n.a}\n│● Nama   : ${n.n}\n│● Makna  : ${n.m}\n│\n│ 🤲 Perbanyaklah berzikir\n╰───────────♢`},{quoted:m});
  },
};
