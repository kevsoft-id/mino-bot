const axios = require("axios");
module.exports={
  command:["warna","color","hex"],category:"converter",description:"Info warna dari kode HEX/RGB",
  async run({sock,m,args}){
    if(!args[0])return sock.sendMessage(m.chat,{text:"❌ .warna <hex>\nContoh: .warna FF5733"},{quoted:m});
    const hex=args[0].replace("#","").toUpperCase();
    if(!/^[0-9A-F]{6}$/i.test(hex))return sock.sendMessage(m.chat,{text:"❌ Hex tidak valid (6 digit)"},{quoted:m});
    const r=parseInt(hex.substring(0,2),16);
    const g=parseInt(hex.substring(2,4),16);
    const b=parseInt(hex.substring(4,6),16);
    const imgUrl=`https://singlecolorimage.com/get/${hex}/200x200`;
    const text=`╭──「 *🎨 WARNA* 」\n│● HEX : #${hex}\n│● RGB : rgb(${r}, ${g}, ${b})\n│● R: ${r} G: ${g} B: ${b}\n╰───────────♢`;
    try{
      await sock.sendMessage(m.chat,{image:{url:imgUrl},caption:text},{quoted:m});
    }catch{await sock.sendMessage(m.chat,{text},{quoted:m});}
  },
};
