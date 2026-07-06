const axios = require("axios");
module.exports={
  command:["news","berita","topik"],category:"search",description:"Baca berita terkini Indonesia",
  async run({sock,m,args}){
    const q=(args[0]||"teknologi");
    try{
      const r=await axios.get(`https://api.siputzx.my.id/api/s/berita?q=${encodeURIComponent(q)}`,{timeout:15000});
      const items=(r.data?.data||[]).slice(0,5);
      if(!items.length)throw new Error("Tidak ada berita");
      let text=`╭──「 *📰 BERITA: ${q.toUpperCase()}* 」\n`;
      for(const i of items) text+=`│\n│● *${(i.title||"").substring(0,80)}*\n│  ${(i.source||"")} | ${(i.date||"")}\n│  ${(i.url||"").substring(0,60)}\n`;
      text+="\n╰───────────♢";
      await sock.sendMessage(m.chat,{text},{quoted:m});
    }catch(e){await sock.sendMessage(m.chat,{text:"❌ "+e.message},{quoted:m});}
  },
};
