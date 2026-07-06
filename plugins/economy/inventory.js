const { getUser } = require("../../lib/database");
const moment = require("moment-timezone");
module.exports = {
  command: ["inventory","inv","barang"], category: "economy",
  description: "Lihat inventaris item kamu",
  async run({ sock, m }) {
    const u = getUser(m.sender);
    const inv = u.inventory || [];
    if (!inv.length) return sock.sendMessage(m.chat, { text: "📦 Inventarismu kosong!\nBeli item di .shop" }, { quoted: m });
    let text = "╭──「 *📦 INVENTARIS* 」\n";
    inv.slice(-10).forEach((i, idx) => {
      text += `│● ${idx+1}. ${i.name}\n│   Dibeli: ${moment(i.bought).fromNow()}\n`;
    });
    text += "╰───────────♢";
    await sock.sendMessage(m.chat, { text }, { quoted: m });
  },
};
