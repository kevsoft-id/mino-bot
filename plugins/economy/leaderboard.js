const { getAllUsers } = require("../../lib/database");
const { formatCoins } = require("../../lib/function");
module.exports={
  command:["leaderboard","lb","topkoin","ranking"],category:"economy",description:"Top 10 terkaya",
  async run({sock,m}){
    const users=Object.values(getAllUsers());
    const sorted=users.sort((a,b)=>(b.coins||0)-(a.coins||0)).slice(0,10);
    if(!sorted.length) return sock.sendMessage(m.chat,{text:"❌ Belum ada data"},{quoted:m});
    let text=`╭──「 *🏆 LEADERBOARD* 」\n│\n`;
    const medals=["🥇","🥈","🥉","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];
    sorted.forEach((u,i)=>{text+=`│${medals[i]} @${u.id} — ${formatCoins(u.coins||0)} 🪙\n`;});
    text+="│\n╰───────────♢";
    const mentions=sorted.map(u=>u.id+"@s.whatsapp.net");
    await sock.sendMessage(m.chat,{text,mentions},{quoted:m});
  },
};
