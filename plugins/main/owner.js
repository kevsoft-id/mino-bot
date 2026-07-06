const config = require("../../config");
module.exports = {
  command: "owner", category: "main", description: "Info dan kontak owner bot",
  async run({ sock, m }) {
    const n = config.owner[0];
    await sock.sendMessage(m.chat, {
      text: `╭──「 *👑 OWNER* 」\n│● Nama  : ${config.ownerName}\n│● Nomor : +${n}\n│● WA    : wa.me/${n}\n│● Bot   : ${config.botName}\n╰───────────♢`
    }, { quoted: m });
  },
};
