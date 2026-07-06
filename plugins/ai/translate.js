const axios = require("axios");
module.exports = {
  command: ["tr","translate","terjemah"], category: "ai",
  description: "Terjemahkan teks ke bahasa lain",
  usage: ".tr <kode> <teks> | contoh: .tr en halo",
  async run({ sock, m, args }) {
    if (args.length < 2) return sock.sendMessage(m.chat, { text: "❌ .tr <kode_bahasa> <teks>\nContoh: .tr en halo semua\nKode: id en ja ko ar zh fr de es ru pt" }, { quoted: m });
    const lang = args[0]; const text = args.slice(1).join(" ");
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`;
      const res = await axios.get(url, { timeout: 15000 });
      const result = res.data[0].map(v => v?.[0]||"").join("");
      const detected = res.data[2] || "auto";
      await sock.sendMessage(m.chat, {
        text: `╭──「 *🌐 TRANSLATE* 」\n│● Dari  : ${detected} → ${lang}\n│● Asli  : ${text}\n│● Hasil : ${result}\n╰───────────♢`
      }, { quoted: m });
    } catch (e) { await sock.sendMessage(m.chat, { text: `❌ ${e.message}` }, { quoted: m }); }
  },
};
