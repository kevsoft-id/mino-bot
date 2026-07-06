module.exports = {
  command: ["flip","lempar","coin","koin2"], category: "tools",
  description: "Lempar koin (heads/tails)",
  async run({ sock, m }) {
    const r = Math.random() < 0.5;
    await sock.sendMessage(m.chat, { text: `🪙 *${r ? "HEADS (Gambar)" : "TAILS (Angka)"}*\n\n${r ? "👑 Kepala!" : "💰 Ekor!"}` }, { quoted: m });
  },
};
