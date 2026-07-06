const truths=["Siapa crush rahasiamu saat ini?","Pernah berbohong ke orang tua? Ceritakan!","Apa hal paling memalukan yang pernah terjadi padamu?","Siapa yang paling sering kamu stalk di sosmed?","Apa hal terburuk yang pernah kamu pikirkan?","Pernah cheating waktu ujian?","Siapa yang kamu kagumi diam-diam?","Apa hal yang belum pernah kamu ceritakan ke siapapun?","Kalau bisa kembali ke masa lalu, apa yang ingin kamu ubah?","Siapa yang tidak kamu suka di sini dan kenapa?","Pernah pura-pura sakit untuk tidak sekolah/kerja?","Apa nickname memalukan yang pernah kamu punya?"];
module.exports={
  command:["truth","jujur"],category:"game",description:"Pertanyaan truth (jujur-jujuran)",
  async run({sock,m}){
    const q=truths[Math.floor(Math.random()*truths.length)];
    await sock.sendMessage(m.chat,{text:`╭──「 *💬 TRUTH* 」\n│\n│ ${q}\n│\n╰───────────♢`},{quoted:m});
  },
};
