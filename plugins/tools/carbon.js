const axios = require("axios");
module.exports = {
  command: ["carbon","code2img","kodeimg"], category: "tools", description: "Buat screenshot kode yang cantik",
  async run({ sock, m, args }) {
    let code = args.join(" ");
    if (!code && m.quoted?.message?.conversation) code = m.quoted.message.conversation;
    if (!code) return sock.sendMessage(m.chat, { text: "❌ .carbon <kode> atau reply pesan kode" }, { quoted: m });
    await sock.sendMessage(m.chat, { text: "🎨 _Membuat carbon..._" }, { quoted: m }).catch(() => {});
    try {
      const res = await axios.post("https://carbonara.solopov.dev/api/cook", { code, theme:"dracula", fontFamily:"Fira Code", language:"auto" }, { responseType:"arraybuffer", timeout:30000 });
      await sock.sendMessage(m.chat, { image: Buffer.from(res.data), caption: "💻 Carbon Code" }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
