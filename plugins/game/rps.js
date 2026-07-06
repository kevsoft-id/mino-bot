const choices=["batu","kertas","gunting"];
const beats={batu:"gunting",kertas:"batu",gunting:"kertas"};
const emojis={batu:"🪨",kertas:"📄",gunting:"✂️"};
module.exports={
  command:["rps","suit","batukertasgunting"],category:"game",description:"Main suit/RPS",
  async run({sock,m,args}){
    const p=(args[0]||"").toLowerCase();
    if(!choices.includes(p))return sock.sendMessage(m.chat,{text:"❌ .rps <batu/kertas/gunting>"},{quoted:m});
    const bot=choices[Math.floor(Math.random()*3)];
    let result;
    if(p===bot)result="🤝 *SERI!*";
    else if(beats[p]===bot)result="🎉 *KAMU MENANG!*";
    else result="💀 *BOT MENANG!*";
    await sock.sendMessage(m.chat,{text:`╭──「 *✂️ SUIT* 」\n│● Kamu : ${emojis[p]} ${p}\n│● Bot  : ${emojis[bot]} ${bot}\n│● Hasil: ${result}\n╰───────────♢`},{quoted:m});
  },
};
