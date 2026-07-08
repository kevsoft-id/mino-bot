'use strict';
const settings = require('../../../settings');
const { randPick } = require('../../../lib/utils');

const JOKES = [
  { q: 'Kenapa programmer selalu bingung?', a: 'Karena mereka tidak tahu `null` itu ada atau tidak ada! 😂' },
  { q: 'Apa bedanya programmer dan pizza?', a: 'Pizza bisa kasih makan keluarga! 🍕😅' },
  { q: 'Kenapa kucing suka komputer?', a: 'Karena ada banyak *mouse*! 🐱💻' },
  { q: 'Apa yang dikatakan satu dinding ke dinding lain?', a: 'Sampai di pojok ya! 😂' },
  { q: 'Kenapa ilmuwan tidak percaya atom?', a: 'Karena mereka selalu bikin segalanya! (make up everything) 😎' },
  { q: 'Apa yang kamu sebut seorang ikan tanpa mata?', a: 'Fsh! 🐟😂' },
  { q: 'Kenapa gajah tidak bisa pakai komputer?', a: 'Karena mereka takut sama mouse! 🐘😂' },
  { q: 'Apa bedanya WiFi dan cinta?', a: 'WiFi kadang nyambung, cinta kadang PHP! 😅💕' },
  { q: 'Kenapa programmer suka dark mode?', a: 'Karena light menarik bugs! 🐛😂' },
  { q: 'Apa yang dikatakan kopi ke gula?', a: 'Kamu manis banget, tanpamu aku pahit! ☕😄' },
];

module.exports = {
  commands: ['joke', 'lucu', 'lawak', 'humor'],
  category: 'Fun',
  description: 'Dapatkan joke/lelucon random~',
  usage: '.joke',

  async handler(sock, m, { reply, react }) {
    await react('😂');
    const { q, a } = randPick(JOKES);
    await reply([
      `😂 *JOKE TIME* nya~`,
      ``,
      `❓ ${q}`,
      ``,
      `💬 ${a}`,
      ``,
      `🐾 Hehe, lucu kan? UwU~`,
      ``,
      settings.footer,
    ].join('\n'));
  },
};
