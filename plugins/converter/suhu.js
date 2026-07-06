module.exports={
  command:["suhu","temperature","temp"],category:"converter",description:"Konversi suhu C/F/K",
  async run({sock,m,args}){
    if(args.length<2)return sock.sendMessage(m.chat,{text:"❌ .suhu <nilai> <C/F/K>\nContoh: .suhu 100 C"},{quoted:m});
    const val=parseFloat(args[0]); const from=args[1].toUpperCase();
    if(isNaN(val))return sock.sendMessage(m.chat,{text:"❌ Nilai tidak valid"},{quoted:m});
    let C,F,K;
    if(from==="C"){C=val;F=C*9/5+32;K=C+273.15;}
    else if(from==="F"){F=val;C=(F-32)*5/9;K=C+273.15;}
    else if(from==="K"){K=val;C=K-273.15;F=C*9/5+32;}
    else return sock.sendMessage(m.chat,{text:"❌ Gunakan C, F, atau K"},{quoted:m});
    await sock.sendMessage(m.chat,{text:`╭──「 *🌡️ KONVERSI SUHU* 」\n│● Celsius   : ${C.toFixed(2)}°C\n│● Fahrenheit: ${F.toFixed(2)}°F\n│● Kelvin    : ${K.toFixed(2)} K\n╰───────────♢`},{quoted:m});
  },
};
