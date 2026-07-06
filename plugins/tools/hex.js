module.exports = {
  command: ["hex","hexadecimal"], category: "tools",
  description: "Encode/decode teks ke hexadecimal",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .hex <teks>\n.hex decode <hex>" }, { quoted: m });
    const isDecode = args[0].toLowerCase() === "decode";
    const text = isDecode ? args.slice(1).join(" ") : args.join(" ");
    try {
      const result = isDecode
        ? Buffer.from(text.replace(/\s/g,""), "hex").toString("utf-8")
        : Buffer.from(text).toString("hex");
      await sock.sendMessage(m.chat, { text: `╭──「 *HEX* 」\n│● Mode  : ${isDecode?"Decode":"Encode"}\n│● Input : ${text.substring(0,100)}\n│● Output: ${result.substring(0,500)}\n╰───────────♢` }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ " + e.message }, { quoted: m }); }
  },
};
