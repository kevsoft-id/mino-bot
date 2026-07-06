const { ask } = require("../../lib/gemini");
module.exports = {
  command: ["inspirasi","kata2","insprasi"], category: "fun",
  description: "Kata inspirasi random dari AI",
  async run({ sock, m }) {
    try {
      const themes = ["kerja keras","cinta","persahabatan","sukses","bersyukur","mimpi","perjalanan"];
      const t = themes[Math.floor(Math.random() * themes.length)];
      const ans = await ask(`Berikan 1 kata-kata inspirasi pendek (1-2 kalimat) tentang ${t}. Tidak perlu nama penulis. Bahasa Indonesia yang puitis.`);
      await sock.sendMessage(m.chat, { text: `💫 _${ans}_` }, { quoted: m });
    } catch(e) {
      const list = ["Hidup adalah perjalanan, bukan tujuan.","Mimpi bukan sesuatu yang kamu tiduri, tapi sesuatu yang menghentikanmu tidur.","Jangan berhenti ketika kamu lelah. Berhentilah ketika kamu sudah selesai.","Kamu lebih berani dari yang kamu percaya."];
      await sock.sendMessage(m.chat, { text: `💫 _${list[Math.floor(Math.random()*list.length)]}_` }, { quoted: m });
    }
  },
};
