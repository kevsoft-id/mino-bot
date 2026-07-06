const j=["✅ Ya, pasti!","✅ Tentu saja!","✅ Kemungkinan besar iya","✅ Sangat mungkin!","✅ Iya!","🤔 Tidak yakin, coba lagi","🤔 Mungkin saja...","🤔 Tanyakan nanti","❌ Tidak","❌ Sangat tidak mungkin","❌ Jangan berharap","❌ Nope!"];
module.exports={
  command:["8ball","ramal","prediksi"],category:"game",description:"Ramalan ajaib 8-ball",
  async run({sock,m,args}){
    if(!args[0])return sock.sendMessage(m.chat,{text:"❌ .8ball <pertanyaan>"},{quoted:m});
    const ans=j[Math.floor(Math.random()*j.length)];
    await sock.sendMessage(m.chat,{text:`╭──「 *🎱 8BALL* 」\n│● Pertanyaan: ${args.join(" ")}\n│● Jawaban   : ${ans}\n╰───────────♢`},{quoted:m});
  },
};
