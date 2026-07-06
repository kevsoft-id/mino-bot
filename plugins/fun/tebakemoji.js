const list = [
  {e:"🍎🍊🍋🍇",a:"buah",h:"Benda yang dimakan"},
  {e:"🐶🐱🐭🐹",a:"hewan",h:"Makhluk hidup"},
  {e:"📱💻🖥️⌨️",a:"teknologi",h:"Alat elektronik"},
  {e:"🎸🎵🎤🥁",a:"musik",h:"Seni suara"},
  {e:"⚽🏀🎾🏐",a:"olahraga",h:"Aktivitas fisik"},
  {e:"🌍🌎🌏🗺️",a:"dunia",h:"Planet bumi"},
  {e:"🍕🍔🌮🍜",a:"makanan",h:"Yang dimakan"},
  {e:"✈️🚂🚢🚁",a:"transportasi",h:"Alat bepergian"},
];
const active = new Map();
module.exports = {
  command: ["tebakemoji","emojiQuiz"], category: "fun",
  description: "Tebak arti emoji",
  async run({ sock, m }) {
    if (active.has(m.chat)) return sock.sendMessage(m.chat, { text: `❗ Sudah ada game! Tebak: ${active.get(m.chat).h}` }, { quoted: m });
    const pick = list[Math.floor(Math.random() * list.length)];
    active.set(m.chat, pick);
    setTimeout(() => { const g = active.get(m.chat); if (g) { active.delete(m.chat); sock.sendMessage(m.chat, { text: `⏰ Waktu habis! Jawaban: *${g.a}*` }).catch(() => {}); } }, 30000);
    await sock.sendMessage(m.chat, { text: `╭──「 *😀 TEBAK EMOJI* 」\n│● ${pick.e}\n│● Hint: ${pick.h}\n│● Waktu: 30 detik\n╰───────────♢\n\nKetik jawaban kamu!` }, { quoted: m });
  },
  onMessage: async ({ sock, m, body }) => {
    if (!active.has(m.chat)) return;
    const g = active.get(m.chat);
    if (body.toLowerCase().includes(g.a)) {
      active.delete(m.chat);
      await sock.sendMessage(m.chat, { text: `🎉 *BENAR!* @${m.sender.replace(/@.+/, "")} jawab *${g.a}*!`, mentions: [m.sender] }).catch(() => {});
    }
  },
};
