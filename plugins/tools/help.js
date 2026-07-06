const { getSettings } = require("../../lib/database");
const config = require("../../config");
module.exports = {
  command: ["help","h","bantuan"], category: "tools", description: "Cara penggunaan bot",
  async run({ sock, m }) {
    const cfg = getSettings();
    const p = cfg.prefix || config.prefix;
    await sock.sendMessage(m.chat, { text:
      `╭──「 *❓ BANTUAN* 」\n│\n│ Prefix  : ${p}\n│ Contoh  : ${p}menu\n│\n│ *Kategori Menu:*\n│● ${p}menumain       → menu utama\n│● ${p}menuai         → AI Gemini\n│● ${p}menutools      → tools\n│● ${p}menudownloader → download\n│● ${p}menugroup      → grup\n│● ${p}menugame       → game\n│● ${p}menufun        → seru-seruan\n│● ${p}menusearch     → pencarian\n│● ${p}menuislamic    → islami\n│● ${p}menueconomy    → ekonomi\n│● ${p}menuconverter  → konversi\n│● ${p}menuowner      → owner only\n│\n│ *Fitur Spesial:*\n│● ${p}ai <tanya>     → chat AI\n│● ${p}addfitur       → tambah fitur via AI!\n│● ${p}settings       → konfigurasi bot\n│\n╰───────────♢`
    }, { quoted: m });
  },
};
