'use strict';
const settings = require('../../../set/settings');

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) throw new Error('Format hex harus 6 karakter');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return { r, g, b };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function colorName(r, g, b) {
  const colors = [
    [255,0,0,'Merah (Red)'], [0,255,0,'Hijau (Green)'], [0,0,255,'Biru (Blue)'],
    [255,255,0,'Kuning (Yellow)'], [255,0,255,'Magenta'], [0,255,255,'Cyan'],
    [255,165,0,'Oranye (Orange)'], [128,0,128,'Ungu (Purple)'], [165,42,42,'Coklat (Brown)'],
    [255,192,203,'Pink'], [0,0,0,'Hitam (Black)'], [255,255,255,'Putih (White)'],
    [128,128,128,'Abu-abu (Gray)'],
  ];
  let closest = 'Unknown'; let minDist = Infinity;
  for (const [cr, cg, cb, name] of colors) {
    const d = Math.sqrt((r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2);
    if (d < minDist) { minDist = d; closest = name; }
  }
  return closest;
}

module.exports = {
  commands: ['color', 'warna', 'hex'],
  category: 'Tools',
  description: 'Lihat info warna dari kode HEX~',
  usage: '.color #RRGGBB',

  async handler(sock, m, { args, reply, react }) {
    const hex = args[0];
    if (!hex) return reply('❓ Masukkan kode warna HEX nya~\nContoh: `.color #FF5733`');

    try {
      await react('🎨');
      const { r, g, b } = hexToRgb(hex.startsWith('#') ? hex : '#' + hex);
      const hsl = rgbToHsl(r, g, b);
      const name = colorName(r, g, b);

      await reply([
        `🎨 *INFO WARNA* nya~`,
        ``,
        `🔵 *HEX    :* \`${hex.toUpperCase()}\``,
        `🔴 *RGB    :* rgb(${r}, ${g}, ${b})`,
        `🟣 *HSL    :* hsl(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)`,
        ``,
        `🏷️ *Nama   :* ${name}`,
        `💡 *Terang :* ${hsl.l > 50 ? 'Cerah' : 'Gelap'}`,
        `🌈 *Saturasi:* ${hsl.s > 50 ? 'Vivid' : 'Pastel/Abu'}`,
        ``,
        settings.footer,
      ].join('\n'));
    } catch (err) {
      await react('❌');
      await reply(`❌ Kode warna tidak valid nya~\nFormat: \`#RRGGBB\` (contoh: \`#FF5733\`)`);
    }
  },
};
