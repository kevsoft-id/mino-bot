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
