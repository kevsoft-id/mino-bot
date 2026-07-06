const { loadAllPlugins, formatMenuCaption } = require("../../lib/menu");
const { sendMenu } = require("../../lib/sender");
const { getTag, getRuntime } = require("../../lib/function");
const { getSettings } = require("../../lib/database");
const config = require("../../config");
const path = require("path");
const fs = require("fs");
module.exports = {
  command: "menu", category: "main", description: "Tampilkan semua menu bot",
  async run({ sock, m, startTime }) {
    const tag = getTag(m.sender);
    const runtime = getRuntime(startTime);
    const pluginsDir = path.join(__dirname, "../../plugins");
    const pluginsObj = loadAllPlugins(pluginsDir);
    const cfg = getSettings();
    const mode = (cfg.mode || config.mode) === "public" ? "public" : "self";
    const caption = formatMenuCaption(pluginsObj, cfg.botName || config.botName, config.ownerName, runtime, tag, mode);
    let img = fs.existsSync(config.thumbLocal) ? config.thumbLocal : config.thumbUrl;
    await sendMenu(sock, m.chat, { image: img, caption, title: cfg.botName || config.botName, footer: `Runtime: ${runtime}`, quoted: m });
  },
};
