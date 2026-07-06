const { getUser, saveUser } = require("../../lib/database");
const { formatCoins, msToTime } = require("../../lib/function");
const config = require("../../config");
module.exports={
  command:["daily","harian","claim"],category:"economy",description:"Klaim koin harian",
  async run({sock,m}){
    const u=getUser(m.sender);
    const now=Date.now(); const cd=24*60*60*1000;
    const last=u.lastDaily||0;
    if(now-last<cd){
      const left=cd-(now-last);
      return sock.sendMessage(m.chat,{text:`⏳ Sudah claim hari ini!\n│● Tunggu: ${msToTime(left)}`},{quoted:m});
    }
    const bonus=u.premium?config.dailyCoins*2:config.dailyCoins;
    u.coins=(u.coins||0)+bonus;
    u.lastDaily=now;
    u.xp=(u.xp||0)+50;
    saveUser(m.sender,u);
    await sock.sendMessage(m.chat,{text:`╭──「 *🎁 DAILY REWARD* 」\n│● Koin   : +${formatCoins(bonus)} 🪙\n│● Bonus  : ${u.premium?"Premium 2x!":"-"}\n│● Saldo  : ${formatCoins(u.coins)} 🪙\n│\n│ Kembali lagi besok!\n╰───────────♢`},{quoted:m});
  },
};
