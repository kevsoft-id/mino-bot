const axios = require("axios");
module.exports={
  command:["quran","alquran","ayat"],category:"islamic",description:"Baca Al-Quran beserta terjemahan",
  async run({sock,m,args}){
    if(!args[0])return sock.sendMessage(m.chat,{text:"❌ .quran <surah>:<ayat>\nContoh: .quran 1:1\nAtau .quran <surah> untuk info surah"},{quoted:m});
    const parts=(args[0]||"").split(":");
    const surah=parseInt(parts[0]);
    const ayat=parseInt(parts[1]);
    if(isNaN(surah))return sock.sendMessage(m.chat,{text:"❌ Format: .quran <nomor_surah>:<nomor_ayat>"},{quoted:m});
    try{
      if(!isNaN(ayat)){
        const r=await axios.get(`https://api.alquran.cloud/v1/ayah/${surah}:${ayat}/editions/quran-uthmani,id.indonesian`,{timeout:10000});
        const d=r.data?.data;
        if(!d?.length)throw new Error("Ayat tidak ditemukan");
        const ar=d[0],id=d[1];
        await sock.sendMessage(m.chat,{text:`╭──「 *📖 AL-QURAN* 」\n│● Surah : ${ar.surah?.englishName||""} (${ar.surah?.name||""})\n│● Ayat  : ${surah}:${ayat}\n│\n│ ${ar.text}\n│\n│ _${id?.text||""}_\n╰───────────♢`},{quoted:m});
      } else {
        const r=await axios.get(`https://api.alquran.cloud/v1/surah/${surah}`,{timeout:10000});
        const d=r.data?.data;
        if(!d)throw new Error("Surah tidak ditemukan");
        await sock.sendMessage(m.chat,{text:`╭──「 *📖 SURAH ${d.name}* 」\n│● Nomor   : ${d.number}\n│● Nama    : ${d.name} (${d.englishName})\n│● Arti    : ${d.englishNameTranslation}\n│● Tipe    : ${d.revelationType}\n│● Jumlah  : ${d.numberOfAyahs} ayat\n╰───────────♢\n\nContoh baca: .quran ${surah}:1`},{quoted:m});
      }
    }catch(e){await sock.sendMessage(m.chat,{text:"❌ "+e.message},{quoted:m});}
  },
};
