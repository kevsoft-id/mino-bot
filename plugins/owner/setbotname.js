const { getSettings, saveSettings } = require("../../lib/database");
const config = require("../../config");
module.exports={
  command:["setbotname","namabot","botname"],category:"owner",description:"Ubah nama bot",ownerOnly:true,
  async run({sock,m,args}){
    if(!args[0])return sock.sendMessage(m.chat,{text:"❌ .setbotname <nama baru>"},{quoted:m});
    const name=args.join(" ");
    const cfg=getSettings(); cfg.botName=name; config.botName=name; saveSettings(cfg);
    await sock.sendMessage(m.chat,{text:`✅ Nama bot diubah ke *${name}*`},{quoted:m});
  },
};
