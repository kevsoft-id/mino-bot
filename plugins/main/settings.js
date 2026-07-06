const { getSettings, saveSettings } = require("../../lib/database");
const { sendText } = require("../../lib/sender");
const config = require("../../config");
module.exports = {
  command: ["settings", "sett", "config"], category: "main",
  description: "Lihat & ubah semua pengaturan bot",
  usage: ".settings | .settings <key> <value>",
  ownerOnly: true,
  async run({ sock, m, args }) {
    const cfg = getSettings();
    if (!args[0]) {
      const text = `╭──「 *⚙️ PENGATURAN BOT* 」\n` +
        `│● botName     : ${cfg.botName}\n` +
        `│● prefix      : ${cfg.prefix}\n` +
        `│● mode        : ${cfg.mode}\n` +
        `│● autoAI      : ${cfg.autoAI}\n` +
        `│● antiLink    : ${cfg.antiLink}\n` +
        `│● antiSpam    : ${cfg.antiSpam}\n` +
        `│● readMessage : ${cfg.readMessage}\n` +
        `│● autoTyping  : ${cfg.autoTyping}\n` +
        `│● geminiModel : ${cfg.geminiModel}\n` +
        `╰───────────♢\n\n` +
        `*Cara ubah:*\n.settings <key> <value>\n\n*Contoh:*\n.settings botName Mino Ultra\n.settings mode self\n.settings autoAI true\n.settings antiLink true\n.settings prefix !`;
      return sendText(sock, m.chat, text, m);
    }
    const key = args[0].toLowerCase();
    const val = args.slice(1).join(" ");
    const allowed = ["botname","prefix","mode","autoai","antilink","antispam","readmessage","autotyping","geminimodel"];
    const keyMap = { botname:"botName", prefix:"prefix", mode:"mode", autoai:"autoAI",
      antilink:"antiLink", antispam:"antiSpam", readmessage:"readMessage",
      autotyping:"autoTyping", geminimodel:"geminiModel" };
    if (!allowed.includes(key)) return sendText(sock, m.chat, `❌ Key tidak dikenal. Key tersedia:\n${allowed.join(", ")}`, m);
    const realKey = keyMap[key];
    let parsed = val;
    if (["autoAI","antiLink","antiSpam","readMessage","autoTyping"].includes(realKey))
      parsed = val === "true" || val === "1";
    cfg[realKey] = parsed;
    // Also update live config
    config[realKey] = parsed;
    saveSettings(cfg);
    await sendText(sock, m.chat, `✅ *${realKey}* diubah ke: *${parsed}*`, m);
  },
};
