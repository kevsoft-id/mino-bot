const { ask } = require("../../lib/gemini");
module.exports = {
  command: ["grammar","koreksi","perbaiki"], category: "ai",
  description: "Koreksi tata bahasa dengan AI",
  async run({ sock, m, args }) {
    let text = args.join(" ");
    if (!text && m.quoted?.message?.conversation) text = m.quoted.message.conversation;
    if (!text) return sock.sendMessage(m.chat, { text: "❌ .grammar <teks> atau reply pesan" }, { quoted: m });
    try {
      const ans = await ask(`Koreksi tata bahasa, ejaan, dan gaya penulisan teks berikut dalam Bahasa Indonesia. Tampilkan: (1) Teks asli (2) Teks setelah koreksi (3) Penjelasan perubahan.\n\nTeks: ${text}`);
      await sock.sendMessage(m.chat, { text: `✏️ *Koreksi Grammar:*\n\n${ans}` }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ " + e.message }, { quoted: m }); }
  },
};
