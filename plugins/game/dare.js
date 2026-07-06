const dares=["Kirim foto wajah sekarang!","Ketik 'Aku suka kucing' 10x berturut-turut","Ceritakan mimpi terlucu yang pernah kamu alami","Tag 3 orang dan bilang kamu kangen mereka","Ketik lirik lagu yang sedang kamu suka","Kirim voice note sambil nyanyi 1 bait lagu","Tulis status WA yang memalukan selama 1 jam","Kirim chat ke orang yang kamu kagumi","Ubah nama display kamu jadi nama hewan selama 10 menit","Ceritakan momen paling canggung dalam hidupmu","Ketik semua nama mantan (kalau ada)"];
module.exports={
  command:["dare","tantangan"],category:"game",description:"Tantangan dare seru",
  async run({sock,m}){
    const d=dares[Math.floor(Math.random()*dares.length)];
    await sock.sendMessage(m.chat,{text:`╭──「 *🎭 DARE* 」\n│\n│ ${d}\n│\n╰───────────♢`},{quoted:m});
  },
};
