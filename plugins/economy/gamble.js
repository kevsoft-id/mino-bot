const { getUser, saveUser } = require("../../lib/database");
const { formatCoins } = require("../../lib/function");
module.exports={
  command:["gamble","judi","taruhan"],category:"economy",description:"Taruhan koin (50% menang)",
  cooldown:3000,
  async run({sock,m,args}){
    const u=getUser(m.sender);
    let amount=args[0]==="all"?u.coins:parseInt(args[0]);
    if(!amount||isNaN(amount)||amount<10) return sock.sendMessage(m.chat,{text:`❌ .gamble <jumlah|all>\nMin: 10 koin\n│● Saldomu: ${formatCoins(u.coins||0)}`},{quoted:m});
    if(amount>u.coins) return sock.sendMessage(m.chat,{text:`❌ Koin tidak cukup!\n│● Punya: ${formatCoins(u.coins||0)}`},{quoted:m});
    if(amount>50000) return sock.sendMessage(m.chat,{text:"❌ Maks taruhan: 50.000 koin"},{quoted:m});
    const win=Math.random()<0.5;
    u.coins=win?(u.coins+amount):(u.coins-amount);
    saveUser(m.sender,u);
    await sock.sendMessage(m.chat,{text:`╭──「 *🎲 GAMBLE* 」\n│● ${win?"🎉 MENANG!":"💔 KALAH!"}\n│● Taruhan : ${formatCoins(amount)} 🪙\n│● ${win?"+":"-"}${formatCoins(amount)} 🪙\n│● Saldo   : ${formatCoins(u.coins)} 🪙\n╰───────────♢`},{quoted:m});
  },
};
