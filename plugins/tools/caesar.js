function caesar(text, shift) {
  return text.split("").map(c => {
    if (/[a-zA-Z]/.test(c)) {
      const base = c >= "a" ? 97 : 65;
      return String.fromCharCode(((c.charCodeAt(0) - base + shift + 26) % 26) + base);
    }
    return c;
  }).join("");
}
module.exports = {
  command: ["caesar","rot","enkripsi"], category: "tools",
  description: "Enkripsi/dekripsi Caesar cipher",
  async run({ sock, m, args }) {
    if (args.length < 2) return sock.sendMessage(m.chat, { text: "❌ .caesar <shift> <teks>\nContoh: .caesar 13 halo dunia" }, { quoted: m });
    const shift = parseInt(args[0]);
    const text = args.slice(1).join(" ");
    if (isNaN(shift)) return sock.sendMessage(m.chat, { text: "❌ Shift harus angka" }, { quoted: m });
    const enc = caesar(text, shift);
    const dec = caesar(text, -shift);
    await sock.sendMessage(m.chat, { text: `╭──「 *🔐 CAESAR CIPHER* 」\n│● Shift   : ${shift}\n│● Asli    : ${text}\n│● Enkripsi: ${enc}\n│● Dekripsi: ${dec}\n╰───────────♢` }, { quoted: m });
  },
};
