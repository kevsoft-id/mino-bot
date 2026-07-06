const shio = { 0: { n: "Naga 🐉", s: "Penuh semangat dan percaya diri. Keberuntungan menyertaimu!" },
  1: { n: "Ular 🐍", s: "Intuisi tajam. Hari ini cocok untuk berpikir dalam-dalam." },
  2: { n: "Kuda 🐴", s: "Energi tinggi. Waktu terbaik untuk bergerak dan bertindak!" },
  3: { n: "Kambing 🐑", s: "Kreatif dan penuh empati. Bersyukurlah hari ini." },
  4: { n: "Monyet 🐒", s: "Cerdas dan adaptif. Kamu bisa menghadapi apapun." },
  5: { n: "Ayam 🐓", s: "Pekerja keras. Hasil jerih payahmu akan terlihat." },
  6: { n: "Anjing 🐕", s: "Setia dan dapat dipercaya. Hubunganmu membaik hari ini." },
  7: { n: "Babi 🐷", s: "Baik hati dan murah hati. Rezekimu mengalir lancar." },
  8: { n: "Tikus 🐭", s: "Cepat dan cerdas. Manfaatkan kesempatan yang ada." },
  9: { n: "Kerbau 🐃", s: "Tekun dan tangguh. Kerja kerasmu pasti membuahkan hasil." },
  10: { n: "Macan 🐯", s: "Berani dan bersemangat. Jadilah pemimpin hari ini!" },
  11: { n: "Kelinci 🐇", s: "Lembut dan damai. Jaga hubungan dengan orang tersayang." } };
module.exports = {
  command: ["shio","cina","chinese"], category: "fun", description: "Cek shio berdasarkan tahun lahir",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .shio <tahun lahir>\nContoh: .shio 2000" }, { quoted: m });
    const year = parseInt(args[0]);
    if (isNaN(year) || year < 1900 || year > 2100) return sock.sendMessage(m.chat, { text: "❌ Tahun tidak valid" }, { quoted: m });
    const s = shio[(year - 4) % 12];
    await sock.sendMessage(m.chat, { text: `╭──「 *🀄 SHIO ${year}* 」\n│● Shio  : ${s.n}\n│● Ramalan: ${s.s}\n╰───────────♢` }, { quoted: m });
  },
};
