const { getUser, saveUser } = require("../../lib/database");
const { formatCoins } = require("../../lib/function");
const items = [
  { id: "premium_1d", name: "Premium 1 Hari", price: 2000, emoji: "💎" },
  { id: "premium_7d", name: "Premium 7 Hari", price: 12000, emoji: "💎💎" },
  { id: "xp_boost", name: "XP Boost 2x (1 jam)", price: 500, emoji: "⚡" },
  { id: "cooldown_skip", name: "Skip Cooldown x3", price: 300, emoji: "⏩" },
  { id: "daily_boost", name: "Daily Bonus 2x (1x)", price: 800, emoji: "🎁" },
];
module.exports = {
  command: ["shop","toko","beli","buy"], category: "economy",
  description: "Toko item bot (.shop untuk lihat, .beli <id> untuk beli)",
  async run({ sock, m, args, body, prefix }) {
    const p = prefix || ".";
    const isBuy = body.toLowerCase().startsWith(p + "beli") || body.toLowerCase().startsWith(p + "buy");
    if (!isBuy || !args[0]) {
      let text = "╭──「 *🏪 TOKO* 」\n│\n";
      items.forEach(i => text += `│● ${i.emoji} ${i.name}\n│   ID: ${i.id} | Harga: ${formatCoins(i.price)} 🪙\n│\n`);
      text += "│ Cara beli: .beli <id>\n╰───────────♢";
      return sock.sendMessage(m.chat, { text }, { quoted: m });
    }
    const id = args[0].toLowerCase();
    const item = items.find(i => i.id === id);
    if (!item) return sock.sendMessage(m.chat, { text: `❌ Item tidak ditemukan. Cek .shop` }, { quoted: m });
    const u = getUser(m.sender);
    if ((u.coins || 0) < item.price) return sock.sendMessage(m.chat, { text: `❌ Koin tidak cukup!\n│● Butuh : ${formatCoins(item.price)} 🪙\n│● Punya : ${formatCoins(u.coins || 0)} 🪙` }, { quoted: m });
    u.coins -= item.price;
    if (id.startsWith("premium")) u.premium = true;
    if (!u.inventory) u.inventory = [];
    u.inventory.push({ id: item.id, name: item.name, bought: Date.now() });
    saveUser(m.sender, u);
    await sock.sendMessage(m.chat, { text: `╭──「 *✅ PEMBELIAN BERHASIL* 」\n│● Item  : ${item.emoji} ${item.name}\n│● Harga : ${formatCoins(item.price)} 🪙\n│● Saldo : ${formatCoins(u.coins)} 🪙\n╰───────────♢` }, { quoted: m });
  },
};
