'use strict';
const settings = require('../../../set/settings');

module.exports = {
  commands: ['sticker', 's', 'stiker'],
  category: 'Fun',
  description: 'Buat stiker dari gambar/video yang di-reply~',
  usage: '.sticker (reply gambar/video)',

  async handler(sock, m, { reply, react }) {
    const msg = m.message;

    // Ambil media dari quoted message
    const quoted = msg?.extendedTextMessage?.contextInfo?.quotedMessage;
    const mediaMsg = quoted?.imageMessage || quoted?.videoMessage ||
                     msg?.imageMessage || msg?.videoMessage || msg?.stickerMessage;

    if (!mediaMsg) {
      return reply([
        `❓ *Cara buat stiker:*`,
        ``,
        `1. Kirim/reply gambar atau video`,
        `2. Tulis \`.sticker\` di caption atau reply ke gambar`,
        ``,
        `Contoh: Reply gambar → ketik \`.s\``,
        ``,
        settings.footer,
      ].join('\n'));
    }

    await react('⏳');

    try {
      const { downloadMediaMessage } = require('@whiskeysockets/baileys');
      const buf = await downloadMediaMessage(
        { message: quoted ? { ...quoted } : m.message, key: m.key },
        'buffer',
        {},
        { logger: require('pino')({ level: 'silent' }) }
      );

      // Kirim sebagai stiker
      await sock.sendMessage(m.key.remoteJid, {
        sticker: buf,
      }, { quoted: m });

      await react('✅');
    } catch (err) {
      await react('❌');
      await reply(`❌ Gagal buat stiker nya~\nPastikan yang di-reply adalah gambar ya UwU\nError: ${err.message}`);
    }
  },
};
