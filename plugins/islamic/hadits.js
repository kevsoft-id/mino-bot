const axios = require("axios");
const books=["abu-dawud","tirmidzi","nasai","ibnu-majah","malik","ahmad","darimi"];
module.exports={
  command:["hadits","hadis"],category:"islamic",description:"Baca hadits random dari berbagai kitab",
  async run({sock,m,args}){
    const book=args[0]||books[Math.floor(Math.random()*books.length)];
    const num=Math.floor(Math.random()*100)+1;
    try{
      const r=await axios.get(`https://api.hadith.gading.dev/books/${book}/${num}`,{timeout:10000});
      const d=r.data?.data;
      if(!d)throw new Error("Tidak ditemukan");
      await sock.sendMessage(m.chat,{text:`╭──「 *📚 HADITS* 」\n│● Kitab : ${book.toUpperCase()}\n│● No    : ${d.number}\n│\n│ ${(d.arab||"").substring(0,300)}\n│\n│ _${(d.id||"").substring(0,400)}_\n│\n│ 🤲 Amalkan!\n╰───────────♢`},{quoted:m});
    }catch(e){await sock.sendMessage(m.chat,{text:`❌ Coba kitab lain. Tersedia: ${books.join(", ")}`},{quoted:m});}
  },
};
