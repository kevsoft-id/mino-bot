const { getTag } = require("../../lib/function");
module.exports={
  command:["love","jodoh","lovemeter","cinta"],category:"fun",description:"Ukur cinta antara dua orang",
  async run({sock,m,args}){
    const mentioned=m.message?.extendedTextMessage?.contextInfo?.mentionedJid||[];
    let a=mentioned[0]?getTag(mentioned[0]):(args[0]||getTag(m.sender));
    let b=mentioned[1]?getTag(mentioned[1]):(args[1]||getTag(sock.user?.id||"bot"));
    const pct=Math.floor(Math.random()*101);
    const bar="█".repeat(Math.floor(pct/10))+"░".repeat(10-Math.floor(pct/10));
    let msg=pct>=80?"💕 WOW! Sangat cocok!":pct>=60?"❤️ Lumayan cocok!":pct>=40?"💛 Cukup cocok":"💔 Kurang cocok, coba lagi!";
    await sock.sendMessage(m.chat,{text:`╭──「 *💕 LOVE METER* 」\n│● ${a} ❤️ ${b}\n│● [${bar}] ${pct}%\n│● ${msg}\n╰───────────♢`},{quoted:m});
  },
};
