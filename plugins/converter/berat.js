module.exports={
  command:["berat","weight","kg2lb"],category:"converter",description:"Konversi satuan berat",
  async run({sock,m,args}){
    if(args.length<2)return sock.sendMessage(m.chat,{text:"❌ .berat <nilai> <satuan>\nSatuan: kg g mg lb oz ton\nContoh: .berat 70 kg"},{quoted:m});
    const val=parseFloat(args[0]); const from=args[1].toLowerCase();
    if(isNaN(val))return sock.sendMessage(m.chat,{text:"❌ Nilai tidak valid"},{quoted:m});
    const toKg={kg:1,g:0.001,mg:0.000001,lb:0.453592,oz:0.0283495,ton:1000};
    if(!toKg[from])return sock.sendMessage(m.chat,{text:"❌ Satuan tidak dikenal. Gunakan: kg g mg lb oz ton"},{quoted:m});
    const kg=val*toKg[from];
    await sock.sendMessage(m.chat,{text:`╭──「 *⚖️ KONVERSI BERAT* 」\n│● Input : ${val} ${from}\n│● kg    : ${kg.toFixed(4)}\n│● gram  : ${(kg*1000).toFixed(2)}\n│● lb    : ${(kg/0.453592).toFixed(4)}\n│● oz    : ${(kg/0.0283495).toFixed(4)}\n╰───────────♢`},{quoted:m});
  },
};
