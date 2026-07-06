const moment = require("moment-timezone");
module.exports={
  command:["umur","age","ulang"],category:"converter",description:"Hitung umur dari tanggal lahir",
  async run({sock,m,args}){
    if(!args[0])return sock.sendMessage(m.chat,{text:"❌ .umur <DD-MM-YYYY>\nContoh: .umur 17-08-1945"},{quoted:m});
    const parts=args[0].split(/[-\/]/);
    if(parts.length!==3)return sock.sendMessage(m.chat,{text:"❌ Format: DD-MM-YYYY"},{quoted:m});
    const bd=moment(`${parts[2]}-${parts[1].padStart(2,"0")}-${parts[0].padStart(2,"0")}`,"YYYY-MM-DD");
    if(!bd.isValid())return sock.sendMessage(m.chat,{text:"❌ Tanggal tidak valid"},{quoted:m});
    const now=moment();
    const years=now.diff(bd,"years"); bd.add(years,"years");
    const months=now.diff(bd,"months"); bd.add(months,"months");
    const days=now.diff(bd,"days");
    const nextBd=moment(args[0],"DD-MM-YYYY").year(now.year());
    if(nextBd.isBefore(now))nextBd.add(1,"year");
    const daysLeft=nextBd.diff(now,"days");
    await sock.sendMessage(m.chat,{text:`╭──「 *🎂 KALKULATOR UMUR* 」\n│● Tanggal Lahir : ${args[0]}\n│● Umur         : ${years} tahun, ${months} bulan, ${days} hari\n│● Ultah berikut : ${daysLeft} hari lagi!\n│● Zodiak        : ${getZodiak(parseInt(parts[0]),parseInt(parts[1]))}\n╰───────────♢`},{quoted:m});
  },
};
function getZodiak(d,m){
  if((m==3&&d>=21)||(m==4&&d<=19))return"Aries ♈";if((m==4&&d>=20)||(m==5&&d<=20))return"Taurus ♉";
  if((m==5&&d>=21)||(m==6&&d<=20))return"Gemini ♊";if((m==6&&d>=21)||(m==7&&d<=22))return"Cancer ♋";
  if((m==7&&d>=23)||(m==8&&d<=22))return"Leo ♌";if((m==8&&d>=23)||(m==9&&d<=22))return"Virgo ♍";
  if((m==9&&d>=23)||(m==10&&d<=22))return"Libra ♎";if((m==10&&d>=23)||(m==11&&d<=21))return"Scorpio ♏";
  if((m==11&&d>=22)||(m==12&&d<=21))return"Sagitarius ♐";if((m==12&&d>=22)||(m==1&&d<=19))return"Capricorn ♑";
  if((m==1&&d>=20)||(m==2&&d<=18))return"Aquarius ♒";return"Pisces ♓";
}
