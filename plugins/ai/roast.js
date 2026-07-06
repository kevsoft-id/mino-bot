const { ask } = require("../../lib/gemini");
const { getTag } = require("../../lib/function");
module.exports = {
  command: ["roast","bully","sindir"], category: "ai",
  description: "AI roast/sindir seseorang (bercanda!)",
  cooldown: 3000,
  async run({ sock, m, args }) {
    const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const target = mentioned?.[0] ? getTag(mentioned[0]) : (args[0] || getTag(m.sender));
    await sock.sendMessage(m.chat, { text: "🎤 _Menyiapkan roast..._" }, { quoted: m }).catch(() => {});
    try {
      const ans = await ask(`Roast orang bernama/nomor ${target} dengan cara yang lucu dan tidak menyinggung terlalu dalam. Gaya santai anak muda Indonesia, maksimal 4 kalimat.`);
      await sock.sendMessage(m.chat, { text: `🎤 *Roast untuk @${target}:*\n\n${ans}\n\n_(ini cuma bercanda ya!)_`, mentions: mentioned || [] }, { quoted: m });
    } catch (e) { await sock.sendMessage(m.chat, { text: `❌ ${e.message}` }, { quoted: m }); }
  },
};
