module.exports = {
  command: ["base64","b64"], category: "tools", description: "Encode/decode Base64",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .base64 <teks>\n.base64 decode <teks>" }, { quoted: m });
    const isDecode = args[0].toLowerCase() === "decode";
    const text = isDecode ? args.slice(1).join(" ") : args.join(" ");
    try {
      const result = isDecode ? Buffer.from(text,"base64").toString("utf-8") : Buffer.from(text).toString("base64");
      await sock.sendMessage(m.chat, { text: `╭──「 *BASE64* 」\n│● Mode  : ${isDecode?"Decode":"Encode"}\n│● Input : ${text.substring(0,100)}\n│● Output: ${result.substring(0,500)}\n╰───────────♢` }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
