const { ask } = require("../../lib/gemini");
module.exports = {
  command: ["tebakgambar","whodis","apakah"], category: "ai",
  description: "AI tebak siapa/apa dalam gambar",
  cooldown: 4000,
  async run({ sock, m, args }) {
    const target = m.quoted || { key: m.key, message: m.message, type: m.type };
    const msgType = target?.type || Object.keys(target?.message || {})[0];
    if (!["imageMessage"].includes(msgType)) return sock.sendMessage(m.chat, { text: "❌ Reply gambar dulu!" }, { quoted: m });
    const { downloadMedia } = require("../../lib/function");
    await sock.sendMessage(m.chat, { text: "🔍 _AI sedang menebak..._" }, { quoted: m }).catch(() => {});
    try {
      const buf = await downloadMedia(sock, target);
      const b64 = buf.toString("base64");
      const prompt = args.join(" ") || "Siapa atau apa yang ada di gambar ini? Jelaskan secara detail.";
      const ans = await ask(prompt, null, b64);
      await sock.sendMessage(m.chat, { text: `🤖 *AI Tebak:*\n\n${ans}` }, { quoted: m });
    } catch (e) { await sock.sendMessage(m.chat, { text: `❌ ${e.message}` }, { quoted: m }); }
  },
};
