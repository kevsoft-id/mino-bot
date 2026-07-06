const axios = require("axios");
module.exports={
  command:["kurs","valas","currency","tukar"],category:"search",description:"Cek kurs mata uang",
  async run({sock,m,args}){
    const amount=parseFloat(args[0])||1;
    const from=(args[1]||"USD").toUpperCase();
    const to=(args[2]||"IDR").toUpperCase();
    try{
      const r=await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`,{timeout:10000});
      const rate=r.data?.rates?.[to];
      if(!rate)throw new Error("Kode mata uang tidak ditemukan");
      const result=(amount*rate).toLocaleString("id-ID",{maximumFractionDigits:2});
      await sock.sendMessage(m.chat,{text:`╭──「 *💱 KURS* 」\n│● ${amount.toLocaleString()} ${from}\n│● = ${result} ${to}\n│● Rate: 1 ${from} = ${rate.toLocaleString()} ${to}\n╰───────────♢`},{quoted:m});
    }catch(e){await sock.sendMessage(m.chat,{text:"❌ "+e.message},{quoted:m});}
  },
};
