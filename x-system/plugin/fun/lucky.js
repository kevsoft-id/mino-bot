'use strict';
const settings = require('../../../settings');
const { randPick } = require('../../../lib/utils');

const ACTIVITIES = ['belajar', 'kerja', 'olah raga', 'nonton film', 'main game', 'masak', 'tidur siang', 'jalan-jalan', 'baca buku', 'dengerin musik'];
const FOODS      = ['nasi goreng 🍳', 'mie ayam 🍜', 'soto 🥘', 'pizza 🍕', 'sushi 🍣', 'ramen 🍜', 'bakso 🍲', 'ayam bakar 🍗', 'salad 🥗', 'smoothie 🥤'];
const COLORS     = ['merah 🔴', 'biru 🔵', 'hijau 🟢', 'kuning 🟡', 'ungu 🟣', 'pink 🌸', 'oranye 🟠', 'hitam ⚫'];

module.exports = {
  commands: ['lucky', 'nasib', 'keberuntungan', 'fortune'],
  category: 'Fun',
  description: 'Cek keberuntungan hari ini~',
  usage: '.lucky',

  async handler(sock, m, { pushName, reply, react }) {
    await react('🍀');

    const score      = Math.floor(Math.random() * 5) + 1;
    const stars      = '⭐'.repeat(score) + '☆'.repeat(5 - score);
    const luckyNum   = Math.floor(Math.random() * 100) + 1;
    const luckyColor = randPick(COLORS);
    const luckyFood  = randPick(FOODS);
    const luckyAct   = randPick(ACTIVITIES);
    const advice     = [
      '😊 Hari yang menyenangkan menanti nya~!',
      '💪 Tetap semangat, kamu bisa!',
      '🌈 Ada hal indah yang akan terjadi hari ini UwU',
      '☀️ Energimu sangat positif hari ini!',
      '🍀 Keberuntungan selalu bersamamu nya~',
    ][score - 1];

    await reply([
      `🍀 *CEK KEBERUNTUNGAN* nya~`,
      ``,
      `👤 *${pushName}*`,
      ``,
      `━━━━━━━━━━━━━━━━━━━━━`,
      `🌟 *Lucky Score:* ${stars} (${score}/5)`,
      `━━━━━━━━━━━━━━━━━━━━━`,
      ``,
      `🔢 *Angka Hoki :* ${luckyNum}`,
      `🎨 *Warna Hoki :* ${luckyColor}`,
      `🍽️ *Makanan Hoki:* ${luckyFood}`,
      `🎯 *Aktivitas  :* Hari ini cocok untuk ${luckyAct}`,
      ``,
      `💌 *Pesan Mino:*`,
      advice,
      ``,
      settings.footer,
    ].join('\n'));
  },
};
