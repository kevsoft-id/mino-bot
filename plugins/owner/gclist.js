module.exports={
  command:["gclist","listgrup","grouplist"],category:"owner",description:"Daftar semua grup bot",ownerOnly:true,
  async run({sock,m}){
    try{
      const groups=await sock.groupFetchAllParticipating();
      const list=Object.values(groups);
      if(!list.length)return sock.sendMessage(m.chat,{text:"❌ Bot belum di grup manapun"},{quoted:m});
      let text=`╭──「 *📋 DAFTAR GRUP (${list.length})* 」\n`;
      list.forEach((g,i)=>{text+=`│● ${i+1}. ${g.subject} (${g.participants.length} anggota)\n│   ${g.id}\n`;});
      text+="╰───────────♢";
      await sock.sendMessage(m.chat,{text},{quoted:m});
    }catch(e){await sock.sendMessage(m.chat,{text:"❌ "+e.message},{quoted:m});}
  },
};
