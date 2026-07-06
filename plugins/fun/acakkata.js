module.exports = {
  command: ["acakkata","scramble","adukkata"], category: "fun",
  description: "Acak huruf dalam kata",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .acakkata <teks>" }, { quoted: m });
    const text = args.join(" ");
    const scrambled = text.split(" ").map(word => {
      const a = word.split("");
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a.join("");
    }).join(" ");
    await sock.sendMessage(m.chat, { text: `🔀 *Acak Kata:*\n│● Asli  : ${text}\n│● Acak  : ${scrambled}` }, { quoted: m });
  },
};
