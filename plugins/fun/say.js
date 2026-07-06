module.exports={
  command:["say","tiru","echo"],category:"fun",description:"Bot mengulang pesanmu",
  async run({sock,m,args}){
    if(!args[0])return sock.sendMessage(m.chat,{text:"❌ .say <teks>"},{quoted:m});
    await sock.sendMessage(m.chat,{text:args.join(" ")},{quoted:m});
  },
};
