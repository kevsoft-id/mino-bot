const { exec } = require("child_process");
module.exports={
  command:["exec","$","shell","cmd"],category:"owner",description:"Jalankan perintah shell (OWNER ONLY)",
  ownerOnly:true,
  async run({sock,m,args,body,prefix}){
    const p=prefix||".";
    const cmd=body.replace(/^\.(exec|\$|shell|cmd)\s*/,"").trim();
    if(!cmd)return sock.sendMessage(m.chat,{text:"❌ .exec <perintah>"},{quoted:m});
    await sock.sendMessage(m.chat,{text:`⚙️ Menjalankan: \`${cmd}\``},{quoted:m}).catch(()=>{});
    exec(cmd,{timeout:30000,maxBuffer:1024*1024},(err,stdout,stderr)=>{
      const output=(stdout||"")+(stderr?"STDERR:\n"+stderr:"");
      const res=(err?`ERROR: ${err.message}\n`:"")+output;
      sock.sendMessage(m.chat,{text:`╭──「 *💻 EXEC* 」\n│$ ${cmd}\n│\n${res.substring(0,3000)||"(kosong)"}\n╰───────────♢`},{quoted:m}).catch(()=>{});
    });
  },
};
