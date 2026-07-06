const { getUser, saveUser } = require("../../lib/database");
const { getTag } = require("../../lib/function");
module.exports={
  command:["addpremium","delpremium","listpremium"],category:"owner",
  description:"Kelola user premium",ownerOnly:true,
  async run({sock,m,args,body,prefix}){
    const p=prefix||".";
    if(body.toLowerCase().startsWith(p+"listpremium")){
      const {getAllUsers}=require("../../lib/database");
      const users=Object.values(getAllUsers()).filter(u=>u.premium);
      if(!users.length)return sock.sendMessage(m.chat,{text:"📋 Belum ada user premium"},{quoted:m});
      let text="╭──「 *💎 USER PREMIUM* 」\n";
      users.forEach((u,i)=>text+=`│● ${i+1}. @${u.id}\n`);
      text+="╰───────────♢";
      const mentions=users.map(u=>u.id+"@s.whatsapp.net");
      return sock.sendMessage(m.chat,{text,mentions},{quoted:m});
    }
    const isAdd=body.toLowerCase().startsWith(p+"addpremium");
    const mentioned=m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const target=mentioned?.[0]||(args[0]?(args[0].replace(/[^0-9]/g,"")+"@s.whatsapp.net"):null);
    if(!target)return sock.sendMessage(m.chat,{text:`❌ .${isAdd?"add":"del"}premium @user`},{quoted:m});
    const u=getUser(target); u.premium=isAdd; saveUser(target,u);
    await sock.sendMessage(m.chat,{text:`✅ @${getTag(target)} ${isAdd?"ditambahkan ke":"dihapus dari"} premium`,mentions:[target]},{quoted:m});
  },
};
