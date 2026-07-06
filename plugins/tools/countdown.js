const moment = require("moment-timezone");
const config = require("../../config");
module.exports = {
  command: ["countdown","hitung","waktu"], category: "tools",
  description: "Hitung mundur ke tanggal tertentu",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .countdown <DD-MM-YYYY>\nContoh: .countdown 17-08-2025" }, { quoted: m });
    const parts = args[0].split(/[-\/]/);
    const target = moment(`${parts[2]}-${parts[1]?.padStart(2,"0")}-${parts[0]?.padStart(2,"0")}`, "YYYY-MM-DD");
    if (!target.isValid()) return sock.sendMessage(m.chat, { text: "❌ Format tanggal tidak valid (DD-MM-YYYY)" }, { quoted: m });
    const now = moment().tz(config.timezone);
    const label = args.slice(1).join(" ") || "";
    if (target.isBefore(now)) return sock.sendMessage(m.chat, { text: "❌ Tanggal sudah berlalu!" }, { quoted: m });
    const diff = target.diff(now);
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const min = Math.floor((diff % 3600000) / 60000);
    await sock.sendMessage(m.chat, { text: `╭──「 *⏰ COUNTDOWN* 」\n│● Event  : ${label || target.format("D MMMM YYYY")}\n│● Sisa   : ${d} hari, ${h} jam, ${min} menit\n│● Tanggal: ${target.format("dddd, D MMMM YYYY")}\n╰───────────♢` }, { quoted: m });
  },
};
