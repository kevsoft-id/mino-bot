const axios = require("axios");
module.exports={
  command:["anime","cariAnime"],category:"search",description:"Cari info anime",
  async run({sock,m,args}){
    if(!args[0])return sock.sendMessage(m.chat,{text:"❌ .anime <judul>"},{quoted:m});
    const q=args.join(" ");
    try{
      const r=await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=1`,{timeout:15000});
      const d=r.data?.data?.[0];
      if(!d)throw new Error("Tidak ditemukan");
      const text=`╭──「 *🎌 ANIME* 」\n│● Judul  : ${d.title}\n│● Jepang : ${d.title_japanese||"-"}\n│● Episode: ${d.episodes||"?"}\n│● Status : ${d.status||"-"}\n│● Genre  : ${(d.genres||[]).map(g=>g.name).join(", ")||"-"}\n│● Rating : ${d.score||"-"}/10\n│● Rank   : #${d.rank||"-"}\n│● Tipe   : ${d.type||"-"}\n│\n│ ${(d.synopsis||"").substring(0,250)}...\n╰───────────♢`;
      if(d.images?.jpg?.image_url) await sock.sendMessage(m.chat,{image:{url:d.images.jpg.image_url},caption:text},{quoted:m});
      else await sock.sendMessage(m.chat,{text},{quoted:m});
    }catch(e){await sock.sendMessage(m.chat,{text:"❌ "+e.message},{quoted:m});}
  },
};
