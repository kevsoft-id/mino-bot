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
