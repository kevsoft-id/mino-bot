const { getUser, saveUser } = require("../../lib/database");
const { formatCoins, msToTime, pickRandom } = require("../../lib/function");
const config = require("../../config");
const jobs=["🧑‍💻 Programming","🚗 Uber driver","📦 Kurir","🍕 Chef","🎨 Desainer","📝 Penulis","🎵 Musisi","🧹 Cleaning service","📊 Akuntan","🏗️ Tukang bangunan"];
module.exports={
  command:["work","kerja","bekerja"],category:"economy",description:"Kerja untuk dapatkan koin",
  cooldown:5000,
  async run({sock,m}){
    const u=getUser(m.sender);
    const now=Date.now(); const cd=30*60*1000;
    const last=u.lastWork||0;
    if(now-last<cd) return sock.sendMessage(m.chat,{text:`⏳ Kamu masih lelah!\n│● Tunggu: ${msToTime(cd-(now-last))}`},{quoted:m});
    const job=pickRandom(jobs);
    const min=config.workMinCoins||50; const max=config.workMaxCoins||300;
    const earned=Math.floor(Math.random()*(max-min+1))+min;
    u.coins=(u.coins||0)+earned;
    u.lastWork=now;
    u.xp=(u.xp||0)+10;
    saveUser(m.sender,u);
    await sock.sendMessage(m.chat,{text:`╭──「 *💼 KERJA* 」\n│● Profesi: ${job}\n│● Gaji   : +${formatCoins(earned)} 🪙\n│● Saldo  : ${formatCoins(u.coins)} 🪙\n│\n│ Kerja lagi dalam 30 menit!\n╰───────────♢`},{quoted:m});
  },
};
