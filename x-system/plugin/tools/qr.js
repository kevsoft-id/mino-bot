'use strict';
const QRCode  = require('qrcode');
const settings = require('../../../set/settings');

module.exports = {
  commands: ['qr', 'qrcode', 'buatqr'],
  category: 'Tools',
  description: 'Buat QR code dari teks atau URL~',
  usage: '.qr <teks>',

  async handler(sock, m, { text, reply, react }) {
    if (!text) return reply('❓ Masukkan teks yang mau dibuat QR nya~\nContoh: `.qr https://google.com`');

    await react('⏳');

    try {
      // Buat QR sebagai buffer PNG
      const buf = await QRCode.toBuffer(text, {
        errorCorrectionLevel: 'H',
        type: 'png',
        width: 512,
        color: { dark: '#000000', light: '#FFFFFF' },
      });

      await sock.sendMessage(m.key.remoteJid, {
        image:   buf,
        caption: `📱 *QR CODE* nya~\n\n📝 *Isi:* ${text}\n\n📲 Scan pakai kamera HP ya~\n\n${settings.footer}`,
        jpegThumbnail: buf,
      }, { quoted: m });

      await react('✅');
    } catch (err) {
      await react('❌');
      await reply(`❌ Gagal membuat QR code nya~\n${err.message}`);
    }
  },
};
