const axios = require("axios");
module.exports={
  command:["movie","film","imdb"],category:"search",description:"Cari info film di database",
  async run({sock,m,args}){
    if(!args[0])return sock.sendMessage(m.chat,{text:"❌ .movie <judul film>"},{quoted:m});
    const q=args.join(" ");
    try{
      const r=await axios.get(`https://www.omdbapi.com/?t=${encodeURIComponent(q)}&apikey=trilogy`,{timeout:10000});
      const d=r.data;
      if(d.Response==="False")throw new Error("Film tidak ditemukan");
      const text=`╭──「 *🎬 MOVIE INFO* 」\n│● Judul  : ${d.Title}\n│● Tahun  : ${d.Year}\n│● Genre  : ${d.Genre}\n│● Sutradara: ${d.Director}\n│● Rating : ${d.imdbRating}/10\n│● Durasi : ${d.Runtime}\n│● Bahasa : ${d.Language}\n│\n│ ${(d.Plot||"").substring(0,300)}\n╰───────────♢`;
      if(d.Poster&&d.Poster!=="N/A") await sock.sendMessage(m.chat,{image:{url:d.Poster},caption:text},{quoted:m});
      else await sock.sendMessage(m.chat,{text},{quoted:m});
    }catch(e){await sock.sendMessage(m.chat,{text:"❌ "+e.message},{quoted:m});}
  },
};
