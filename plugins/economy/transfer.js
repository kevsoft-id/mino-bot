const { getUser, saveUser } = require("../../lib/database");
const { getTag, formatCoins } = require("../../lib/function");
module.exports={
  command:["transfer","kirim","tf"],category:"economy",description:"Transfer koin ke user lain",
  async run({sock,m,args}){
    const mentioned=m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const target=mentioned?.[0];
    const amount=parseInt(args[mentioned?.[0]?0:1]);
    if(!target||isNaN(amount)||amount<1) return sock.sendMessage(m.chat,{text:"❌ .transfer @user <jumlah>"},{quoted:m});
    if(target===m.sender) return sock.sendMessage(m.chat,{text:"❌ Tidak bisa transfer ke diri sendiri!"},{quoted:m});
    const from=getUser(m.sender); const to=getUser(target);
    if(from.coins<amount) return sock.sendMessage(m.chat,{text:`❌ Koin tidak cukup!\n│● Punya: ${formatCoins(from.coins||0)}`},{quoted:m});
    from.coins-=amount; to.coins=(to.coins||0)+amount;
    saveUser(m.sender,from); saveUser(target,to);
    await sock.sendMessage(m.chat,{text:`╭──「 *💸 TRANSFER* 」\n│● Dari : @${getTag(m.sender)}\n│● Ke   : @${getTag(target)}\n│● Jumlah: ${formatCoins(amount)} 🪙\n│● Sisamu: ${formatCoins(from.coins)} 🪙\n╰───────────♢`,mentions:[m.sender,target]},{quoted:m});
  },
};
