module.exports = {
  command: ["binary","biner"], category: "tools", description: "Encode/decode teks ke binary",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .binary <teks>\n.binary decode <binary>" }, { quoted: m });
    const isDecode = args[0].toLowerCase() === "decode";
    const text = isDecode ? args.slice(1).join(" ") : args.join(" ");
    try {
      let result;
      if (isDecode) result = text.split(" ").map(b => String.fromCharCode(parseInt(b,2))).join("");
      else result = text.split("").map(c => c.charCodeAt(0).toString(2).padStart(8,"0")).join(" ");
      await sock.sendMessage(m.chat, { text: `╭──「 *BINARY* 」\n│● Input : ${text}\n│● Output: ${result}\n╰───────────♢` }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
