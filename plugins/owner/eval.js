module.exports={
  command:["eval","=>","run"],category:"owner",description:"Jalankan kode JavaScript (OWNER ONLY)",
  ownerOnly:true,
  async run({sock,m,args,body,prefix}){
    const p=prefix||".";
    let code=body.replace(/^(\.eval|\.=>|\.run)\s*/,"");
    if(!code&&m.quoted?.message?.conversation)code=m.quoted.message.conversation;
    if(!code)return sock.sendMessage(m.chat,{text:"❌ .eval <kode JS>"},{quoted:m});
    const start=Date.now();
    try{
      // eslint-disable-next-line no-eval
      let result=await eval(`(async()=>{${code}})()`);
      const elapsed=Date.now()-start;
      if(typeof result!=="string")result=JSON.stringify(result,null,2);
      await sock.sendMessage(m.chat,{text:`╭──「 *⚙️ EVAL* 」\n│● Input:\n${code}\n│\n│● Output (${elapsed}ms):\n${(result||"undefined").substring(0,2000)}\n╰───────────♢`},{quoted:m});
    }catch(e){
      await sock.sendMessage(m.chat,{text:`╭──「 *❌ EVAL ERROR* 」\n│● ${e.name}: ${e.message}\n╰───────────♢`},{quoted:m});
    }
  },
};
