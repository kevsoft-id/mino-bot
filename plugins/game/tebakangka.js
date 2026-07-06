const active=new Map();
module.exports={
  command:["tebakangka","angka","numberguess"],category:"game",description:"Tebak angka 1-100",
  async run({sock,m}){
    if(active.has(m.chat)){const g=active.get(m.chat);return sock.sendMessage(m.chat,{text:`❗ Game aktif! Tebak angka antara 1-100\n│● Percobaan: ${g.tries}/7`},{quoted:m});}
    const num=Math.floor(Math.random()*100)+1;
    active.set(m.chat,{num,tries:0});
    const t=setTimeout(()=>{const g=active.get(m.chat);if(!g)return;active.delete(m.chat);sock.sendMessage(m.chat,{text:`⏰ Waktu habis!\n│● Jawaban: *${g.num}*`}).catch(()=>{});},120000);
    active.get(m.chat)._t=t;
    await sock.sendMessage(m.chat,{text:`╭──「 *🔢 TEBAK ANGKA* 」\n│● Tebak angka 1-100!\n│● Maks 7 percobaan\n│● Waktu: 2 menit\n╰───────────♢`},{quoted:m});
  },
  onMessage:async({sock,m,body})=>{
    if(!active.has(m.chat))return;const g=active.get(m.chat);
    const n=parseInt(body);if(isNaN(n)||n<1||n>100)return;
    g.tries++;
    if(n===g.num){clearTimeout(g._t);active.delete(m.chat);return sock.sendMessage(m.chat,{text:`🎉 *BENAR!* @${m.sender.replace(/@.+/,"")} dalam ${g.tries} percobaan!`,mentions:[m.sender]}).catch(()=>{});}
    if(g.tries>=7){clearTimeout(g._t);active.delete(m.chat);return sock.sendMessage(m.chat,{text:`💔 Game over!\n│● Jawaban: *${g.num}*`}).catch(()=>{});}
    await sock.sendMessage(m.chat,{text:`${n<g.num?"📈 Terlalu kecil!":"📉 Terlalu besar!"} (${g.tries}/7)`}).catch(()=>{});
  },
};
