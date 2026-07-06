/*
  ===========================================================
  [ WATERMARK & LICENSE NOTICE ]
  ===========================================================
  🤖 BOT NAME : MINOBOT
  👤 DEVELOPER: KEVIN (KevSoft-ID)
  🌐 GITHUB   : https://github.com/kevsoft-id
  ===========================================================

  ⚠️ KETENTUAN PENGGUNAAN (TERMS OF SERVICE):

  1. [DILARANG] Menghapus atau mengubah kredit & lisensi asli.
  2. [DILARANG] Menghapus watermark developer ini.
  3. [DILARANG] Memperjualbelikan (komersialkan) script bot ini.

  🔄 [DIPERBOLEHKAN] Mengubah nama bot (Rename) sesuai keinginan,
     dengan catatan poin 1, 2, dan 3 di atas tetap ditaati.

  ===========================================================
  🚨 PERINGATAN KERAS & KONSEKUENSI
  ===========================================================
  Script ini dilindungi oleh hak cipta digital dan lisensi open-source.
  Jika Anda kedapatan menghapus kredit, watermark, atau memperjualbelikannya:

  * Takedown Massal (DMCA): Repository GitHub Anda akan dilaporkan
    dan di-takedown paksa oleh GitHub atas pelanggaran hak cipta.
  * Blacklist & Banned: Akun dan nomor WhatsApp Anda akan dimasukkan
    ke dalam daftar hitam (blacklist) global sistem bot kami.
  * Sanksi Sosial & Hukum: Identitas pelanggar akan dipublikasikan
    di komunitas sebagai pencuri karya (plagiator).

  Created by Kevin © 2026. All rights reserved.
  🌐 https://github.com/kevsoft-id/minobot
  ===========================================================
*/

const axios = require("axios");
module.exports = {
  command: ["cuaca","weather","bmkg"], category: "tools", description: "Cek cuaca kota",
  async run({ sock, m, args }) {
    if (!args[0]) return sock.sendMessage(m.chat, { text: "❌ .cuaca <kota>\nContoh: .cuaca Jakarta" }, { quoted: m });
    const city = args.join(" ");
    try {
      const res = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, { timeout:15000, headers:{ "User-Agent":"curl/7.64.1" } });
      const d = res.data?.current_condition?.[0];
      const area = res.data?.nearest_area?.[0];
      if (!d) throw new Error("Data tidak tersedia");
      const lokasiNama = area?.areaName?.[0]?.value || city;
      const icons = { Sunny:"☀️", Clear:"🌙", Cloudy:"☁️", Overcast:"☁️", Mist:"🌫️", Rain:"🌧️", Drizzle:"🌦️", Thunder:"⛈️", Snow:"❄️", Fog:"🌫️" };
      const desc = d.weatherDesc?.[0]?.value || "-";
      const icon = Object.entries(icons).find(([k]) => desc.includes(k))?.[1] || "🌤️";
      await sock.sendMessage(m.chat, { text:
        `╭──「 *${icon} CUACA - ${lokasiNama}* 」\n│● Kondisi  : ${desc}\n│● Suhu     : ${d.temp_C}°C / ${d.temp_F}°F\n│● Kelembaban: ${d.humidity}%\n│● Angin    : ${d.windspeedKmph} km/h (${d.winddir16Point})\n│● Visibilitas: ${d.visibility} km\n│● UV Index : ${d.uvIndex}\n│● Tekanan  : ${d.pressure} hPa\n╰───────────♢`
      }, { quoted: m });
    } catch(e) { await sock.sendMessage(m.chat, { text: "❌ "+e.message }, { quoted: m }); }
  },
};
