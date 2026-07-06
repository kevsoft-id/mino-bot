const MORSE = { A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--..",0:"-----",1:".----",2:"..---",3:"...--",4:"....-",5:".....",6:"-....",7:"--...",8:"---..",9:"----." };
const RMORSE = Object.fromEntries(Object.entries(MORSE).map(([k,v]) => [v,k]));
module.exports = {
  command: ["morse"], category: "tools", description: "Encode/decode morse code",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .morse <teks>\n.morse decode <-- . -.-- ->" }, { quoted: m });
    const isDecode = args[0].toLowerCase() === "decode";
    const text = isDecode ? args.slice(1).join(" ") : args.join(" ");
    try {
      let result;
      if (isDecode) result = text.split(" / ").map(w => w.split(" ").map(c => RMORSE[c]||"?").join("")).join(" ");
      else result = text.toUpperCase().split(" ").map(w => w.split("").map(c => MORSE[c]||"?").join(" ")).join(" / ");
      await sock.sendMessage(m.chat, { text: `╭──「 *MORSE* 」\n│● Input : ${text}\n│● Output: ${result}\n╰───────────♢` }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
