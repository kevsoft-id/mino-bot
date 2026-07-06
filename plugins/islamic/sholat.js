const axios = require("axios");
const moment = require("moment-timezone");
module.exports={
  command:["sholat","jadwalsholat","prayer"],category:"islamic",description:"Jadwal sholat berdasarkan kota",
  async run({sock,m,args}){
    if(!args[0])return sock.sendMessage(m.chat,{text:"❌ .sholat <kota>\nContoh: .sholat Jakarta"},{quoted:m});
    const city=args.join(" ");
    try{
      const locRes=await axios.get(`http://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Indonesia&method=11`,{timeout:15000});
      const t=locRes.data?.data?.timings;
      if(!t)throw new Error("Kota tidak ditemukan");
      const date=locRes.data?.data?.date?.readable||moment().format("D MMMM YYYY");
      await sock.sendMessage(m.chat,{text:`╭──「 *🕌 JADWAL SHOLAT* 」\n│● Kota     : ${city}\n│● Tanggal  : ${date}\n│\n│● Subuh  : ${t.Fajr}\n│● Terbit : ${t.Sunrise}\n│● Dzuhur : ${t.Dhuhr}\n│● Ashar  : ${t.Asr}\n│● Maghrib: ${t.Maghrib}\n│● Isya   : ${t.Isha}\n│\n│ 🤲 Jangan lupa sholat!\n╰───────────♢`},{quoted:m});
    }catch(e){await sock.sendMessage(m.chat,{text:"❌ "+e.message},{quoted:m});}
  },
};
