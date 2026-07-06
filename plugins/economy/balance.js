const { getUser } = require("../../lib/database");
const { getTag, formatCoins } = require("../../lib/function");
module.exports={
  command:["balance","saldo","wallet","koin"],category:"economy",description:"Cek saldo koin",
  async run({sock,m}){
    const mentioned=m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const target=mentioned?.[0]||m.sender;
    const u=getUser(target);
    const num=getTag(target);
    await sock.sendMessage(m.chat,{text:`╭──「 *💰 SALDO* 」\n│● User    : @${num}\n│● Koin    : ${formatCoins(u.coins||0)} 🪙\n│● Level   : ${u.level||1}\n│● XP      : ${u.xp||0}\n│● Premium : ${u.premium?"✅":"❌"}\n╰───────────♢`,mentions:[target]},{quoted:m});
  },
};
