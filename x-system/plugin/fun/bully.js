'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../settings');

const BULLY_MSGS = [
  'Eh {name}, kamu tuh hidupnya kayak WiFi tetangga — kelihatan tapi nggak bisa dipake 😂',
  '{name} tuh emang unik banget, sayang uniknya ke arah yang salah 😭',
  'Bro {name}, otak kamu itu kayak browser 100 tab — panas dan lemot 💀',
  'Jujur ya {name}, kamu tuh kayak kabel charger murah — mudah putus 😂',
  '{name} tuh kalau ngomong ngga tau mau nyambung apa nggak 🥱',
  'Kasian {name}, mukanya kayak captcha — susah dibaca 😆',
  '{name} tuh kayak baterai HP tua — penuh di tampilan, kosong di kenyataan 💀',
  'Si {name} ini kayak AC rusak — ada tapi nggak ngefek 😂',
  '{name} tuh kayak wifi gratisan — keliatan bagus di awal, lelet pas dipake 🐌',
  'Bro {name}, kamu tuh kayak password — susah diinget, gampang dilupain 😭',
  '{name} tuh kalau ketawa kayak mesin diesel — butuh waktu lama buat start 💀',
  'Eh {name}, IQ kamu berapa sih? Kayak kecepatan internetmu — di bawah standar 😂',
  '{name} tuh kayak cuaca — nggak bisa diprediksi, sering bikin kecewa 😆',
  'Si {name} ini tuh kayak fitur premium app gratisan — ada tapi nggak bisa diakses 😭',
  '{name} mending jadi background wallpaper aja, minimal kelihatan setiap hari 💀',
];

module.exports = {
  commands:    ['bully', 'buli', 'roastin'],
  category:    'Fun',
  description: 'Kirim pesan bully random ke seseorang 😂 (bercanda ya~)',
  usage:       '.bully @user  atau  .bully',

  async handler(sock, m, { mentions, pushName, sender, reply }) {
    const { theme } = settings;
    const targetJid  = mentions[0] || sender;
    const targetName = mentions[0]
      ? '@' + mentions[0].split('@')[0]
      : pushName;

    const msg = BULLY_MSGS[Math.floor(Math.random() * BULLY_MSGS.length)]
      .replace(/{name}/g, targetName);

    await sock.sendMessage(m.key.remoteJid, {
      text: `😂 *Bully Mode ON!*\n\n${msg}\n\n${settings.footer}`,
      mentions: mentions.length ? mentions : [],
    }, { quoted: m });
  },
};
