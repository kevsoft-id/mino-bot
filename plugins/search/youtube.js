const axios = require("axios");
module.exports={
  command:["ytsearch","cariyt","youtube"],category:"search",description:"Cari video YouTube",
  async run({sock,m,args}){
    if(!args[0])return sock.sendMessage(m.chat,{text:"❌ .ytsearch <judul lagu/video>"},{quoted:m});
    const q=args.join(" ");
    try{
      const r=await axios.get(`https://api.siputzx.my.id/api/s/youtube?q=${encodeURIComponent(q)}`,{timeout:15000});
      const items=(r.data?.data||[]).slice(0,5);
      if(!items.length)throw new Error("Tidak ditemukan");
      let text=`╭──「 *🔍 YouTube: ${q}* 」\n`;
      for(const i of items) text+=`│● *${i.title}*\n│  👤 ${i.channel||"-"} | ⏱ ${i.duration||"-"}\n│  🔗 ${i.url||"-"}\n│\n`;
      text+="╰───────────♢";
      await sock.sendMessage(m.chat,{text},{quoted:m});
    }catch(e){await sock.sendMessage(m.chat,{text:"❌ "+e.message},{quoted:m});}
  },
};
