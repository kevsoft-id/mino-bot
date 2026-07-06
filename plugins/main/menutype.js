const { formatCategoryMenu } = require("../../lib/menu");
const { sendMenu } = require("../../lib/sender");
const { getSettings } = require("../../lib/database");
const config = require("../../config");
const fs = require("fs");
module.exports = {
  command: "menutype", category: "system", description: "Auto menu kategori (internal)",
  async run({ sock, m, matchedCategory, pluginsObj }) {
    const cfg = getSettings();
    const cmds = pluginsObj[matchedCategory] || [];
    if (!cmds.length) return sock.sendMessage(m.chat, { text: `❌ Kategori *${matchedCategory}* kosong.` }, { quoted: m });
    const text = formatCategoryMenu(matchedCategory, cmds, cfg.botName || config.botName);
    let img = fs.existsSync(config.thumbLocal) ? config.thumbLocal : config.thumbUrl;
    await sendMenu(sock, m.chat, { image: img, caption: text, title: `${cfg.botName || config.botName} - ${matchedCategory.toUpperCase()}`, footer: `${cmds.length} perintah`, quoted: m });
  },
};
