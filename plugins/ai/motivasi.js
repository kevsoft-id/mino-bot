const { ask } = require("../../lib/gemini");
const { pickRandom } = require("../../lib/function");
module.exports = {
  command: ["motivasi","semangat","inspirasi"], category: "ai",
  description: "Dapatkan kata motivasi dari AI",
  async run({ sock, m, args }) {
    const tema = args.join(" ") || pickRandom(["kehidupan","mimpi","kerja keras","persahabatan","cinta","sukses"]);
    try {
      const ans = await ask(`Berikan 1 kata motivasi/inspirasi yang dalam dan bermakna tentang ${tema}. Sertakan siapa yang mengatakannya jika terkenal. Bahasa Indonesia atau Indonesia-Inggris mix.`);
      await sock.sendMessage(m.chat, { text: `✨ *Motivasi:*\n\n${ans}` }, { quoted: m });
    } catch (e) { await sock.sendMessage(m.chat, { text: `❌ ${e.message}` }, { quoted: m }); }
  },
};
