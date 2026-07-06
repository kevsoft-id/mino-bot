const { getAllGroups } = require("../../lib/database");
module.exports={
  command:["broadcast","bc","siarkan"],category:"owner",description:"Broadcast pesan ke semua grup",
  ownerOnly:true,
  async run({sock,m,args}){
    if(!args[0])return sock.sendMessage(m.chat,{text:"❌ .broadcast <pesan>"},{quoted:m});
    const msg=args.join(" ");
    const groups=Object.keys(getAllGroups());
    if(!groups.length)return sock.sendMessage(m.chat,{text:"❌ Tidak ada grup tersimpan"},{quoted:m});
    let sent=0,failed=0;
    await sock.sendMessage(m.chat,{text:`📢 Mengirim ke ${groups.length} grup...`},{quoted:m});
    for(const id of groups){
      try{await sock.sendMessage(id,{text:`📢 *BROADCAST*\n\n${msg}`});sent++;}
      catch{failed++;}
      await new Promise(r=>setTimeout(r,1000));
    }
    await sock.sendMessage(m.chat,{text:`✅ Broadcast selesai!\n│● Berhasil: ${sent}\n│● Gagal   : ${failed}`},{quoted:m});
  },
};
