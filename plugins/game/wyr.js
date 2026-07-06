const list=[["Punya uang banyak tapi tidak punya cinta","Punya cinta tapi tidak punya uang"],["Bisa terbang","Bisa jadi tidak terlihat"],["Tidak bisa bicara seumur hidup","Tidak bisa diam seumur hidup"],["Tinggal di masa depan 100 tahun lagi","Kembali ke 100 tahun lalu"],["Makan makanan favorit setiap hari","Makan makanan baru berbeda setiap hari"],["Tidak bisa tertawa","Tidak bisa menangis"],["Terkenal tapi miskin","Kaya tapi tidak dikenal"],["Punya kemampuan membaca pikiran","Bisa bicara semua bahasa di dunia"],];
module.exports={
  command:["wyr","milih","would"],category:"game",description:"Would You Rather - pilih salah satu!",
  async run({sock,m}){
    const [a,b]=list[Math.floor(Math.random()*list.length)];
    await sock.sendMessage(m.chat,{text:`╭──「 *🤔 WOULD YOU RATHER* 」\n│\n│ 🅰️ ${a}\n│\n│ — atau —\n│\n│ 🅱️ ${b}\n│\n╰───────────♢`},{quoted:m});
  },
};
