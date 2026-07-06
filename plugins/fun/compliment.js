const c=["Kamu adalah orang yang luar biasa! ✨","Senyummu bisa menerangi hari seseorang ☀️","Kamu lebih kuat dari yang kamu kira 💪","Dunia lebih baik dengan kehadiranmu 🌍","Kamu punya kemampuan yang tidak dimiliki semua orang 🎯","Kreativitasmu sungguh menginspirasi 🎨","Kamu adalah teman yang seseorang harapkan 💙","Caramu memandang masalah sangat unik dan cerdas 🧠","Kamu memiliki sifat yang membuat orang nyaman 🤗","Setiap usahamu pasti membuahkan hasil 🌱"];
const { getTag } = require("../../lib/function");
module.exports={
  command:["compliment","pujian","puji"],category:"fun",description:"Berikan pujian untuk seseorang",
  async run({sock,m}){
    const mentioned=m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const target=mentioned?.[0]||m.sender;
    const num=getTag(target);
    const msg=c[Math.floor(Math.random()*c.length)];
    await sock.sendMessage(m.chat,{text:`╭──「 *💝 PUJIAN* 」\n│● Untuk @${num}:\n│\n│ ${msg}\n│\n╰───────────♢`,mentions:[target]},{quoted:m});
  },
};
