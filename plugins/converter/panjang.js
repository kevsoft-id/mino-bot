module.exports = {
  command: ["panjang","length","meter"], category: "converter",
  description: "Konversi satuan panjang",
  async run({ sock, m, args }) {
    if (args.length < 2) return sock.sendMessage(m.chat, { text: "❌ .panjang <nilai> <satuan>\nSatuan: m km cm mm mi ft in yd\nContoh: .panjang 5 km" }, { quoted: m });
    const val = parseFloat(args[0]); const from = args[1].toLowerCase();
    if (isNaN(val)) return sock.sendMessage(m.chat, { text: "❌ Nilai tidak valid" }, { quoted: m });
    const toM = { m:1, km:1000, cm:0.01, mm:0.001, mi:1609.344, ft:0.3048, in:0.0254, yd:0.9144 };
    if (!toM[from]) return sock.sendMessage(m.chat, { text: "❌ Satuan tidak dikenal. Gunakan: m km cm mm mi ft in yd" }, { quoted: m });
    const meter = val * toM[from];
    await sock.sendMessage(m.chat, { text:
      `╭──「 *📏 KONVERSI PANJANG* 」\n│● Input: ${val} ${from}\n│● m   : ${meter.toFixed(4)}\n│● km  : ${(meter/1000).toFixed(6)}\n│● cm  : ${(meter*100).toFixed(2)}\n│● ft  : ${(meter/0.3048).toFixed(4)}\n│● in  : ${(meter/0.0254).toFixed(4)}\n╰───────────♢`
    }, { quoted: m });
  },
};
