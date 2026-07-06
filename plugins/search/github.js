const axios = require("axios");
module.exports={
  command:["github","gh","gitprofil"],category:"search",description:"Cari profil GitHub",
  async run({sock,m,args}){
    if(!args[0])return sock.sendMessage(m.chat,{text:"❌ .github <username>"},{quoted:m});
    try{
      const r=await axios.get(`https://api.github.com/users/${args[0]}`,{timeout:10000,headers:{"User-Agent":"Mozilla/5.0"}});
      const d=r.data;
      const text=`╭──「 *🐙 GITHUB* 」\n│● Nama    : ${d.name||d.login}\n│● Username: @${d.login}\n│● Bio     : ${d.bio||"-"}\n│● Repo    : ${d.public_repos}\n│● Follower: ${d.followers}\n│● Following: ${d.following}\n│● Lokasi  : ${d.location||"-"}\n│● Link    : ${d.html_url}\n╰───────────♢`;
      if(d.avatar_url) await sock.sendMessage(m.chat,{image:{url:d.avatar_url},caption:text},{quoted:m});
      else await sock.sendMessage(m.chat,{text},{quoted:m});
    }catch(e){await sock.sendMessage(m.chat,{text:"❌ User tidak ditemukan"},{quoted:m});}
  },
};
