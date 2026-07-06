const { sendButton } = require("../../lib/button");
const config = require("../../config");

module.exports = {
  command: ["ui", "menuinteraktif", "menubtn"],
  category: "main",
  description: "Menu interaktif unik dengan gambar & tombol (button+image)",
  cooldown: 4000,
  async run({ sock, m, pluginsObj, prefix }) {
    const total = Object.values(pluginsObj).reduce((a, b) => a + b.length, 0);
    await sendButton(sock, m.chat, {
      text:
        `╭─❪ ✨ *${config.botName}* ✨ ❫\n` +
        `│\n` +
        `│ Halo! Ini adalah menu interaktif\n` +
        `│ dengan tombol asli WhatsApp 🎛️\n` +
        `│\n` +
        `│ Tersedia *${total}+* fitur siap pakai.\n` +
        `╰─────────────`,
      footer: "Mino Bot Ultra • by kevsoft-id",
      image: config.thumbLocal || config.thumbUrl,
      buttons: [
        { id: `${prefix}menu`, text: "📜 Lihat Semua Menu" },
        { id: `${prefix}profile`, text: "🖼️ Profile Canvas" },
        { id: `${prefix}kevsoft`, text: "ℹ️ Tentang Kami" },
      ],
      quoted: m,
    });
  },
};
