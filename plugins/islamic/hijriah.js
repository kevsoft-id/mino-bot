const axios = require("axios");
const moment = require("moment-timezone");
const config = require("../../config");
module.exports = {
  command: ["hijriah","kalenderislam","tanggalislam"], category: "islamic",
  description: "Lihat tanggal Hijriah hari ini",
  async run({ sock, m }) {
    const today = moment().tz(config.timezone).format("DD-MM-YYYY");
    try {
      const r = await axios.get(`https://api.aladhan.com/v1/gToH/${today}`, { timeout: 10000 });
      const d = r.data?.data?.hijri;
      if (!d) throw new Error("Data tidak tersedia");
      await sock.sendMessage(m.chat, { text: `╭──「 *☪️ KALENDER HIJRIAH* 」\n│● Masehi  : ${today}\n│● Hijriah : ${d.day} ${d.month.en} ${d.year} H\n│● Arab    : ${d.month.ar}\n│● Hari    : ${d.weekday.en}\n╰───────────♢` }, { quoted: m });
    } catch(e) {
      const now = moment().tz(config.timezone);
      await sock.sendMessage(m.chat, { text: `╭──「 *☪️ KALENDER* 」\n│● Masehi: ${now.format("dddd, D MMMM YYYY")}\n│● Hijriah: Tidak tersedia (coba lagi)\n╰───────────♢` }, { quoted: m });
    }
  },
};
