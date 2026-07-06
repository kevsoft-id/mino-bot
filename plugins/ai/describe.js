const { ask } = require("../../lib/gemini");
const { downloadMedia } = require("../../lib/function");
module.exports = {
  command: ["describe","deskripsikan","ailihat","ocr"], category: "ai",
  description: "AI mendeskripsikan/membaca isi gambar",
  cooldown: 4000,
  async run({ sock, m, args }) {
    const target = m.quoted || { key: m.key, message: m.message, type: m.type };
    const msgType = target?.type || Object.keys(target?.message || {})[0];
    if (!["imageMessage","stickerMessage"].includes(msgType))
      return sock.sendMessage(m.chat, { text: "❌ Reply gambar dulu!" }, { quoted: m });
    const prompt = args.join(" ") || "Deskripsikan gambar ini secara detail dalam Bahasa Indonesia.";
    await sock.sendMessage(m.chat, { text: "🔍 _AI menganalisis gambar..._" }, { quoted: m }).catch(() => {});
    try {
      const buf = await downloadMedia(sock, target);
      const b64 = buf.toString("base64");
      const ans = await ask(prompt, null, b64, "image/jpeg");
      await sock.sendMessage(m.chat, { text: `🤖 *Analisis Gambar:*\n\n${ans}` }, { quoted: m });
    } catch (e) {
      await sock.sendMessage(m.chat, { text: `❌ ${e.message}` }, { quoted: m });
    }
  },
};
