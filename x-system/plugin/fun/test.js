'use strict';

// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../set/settings');
const { replyImage } = require('../../../lib/utils');

module.exports = {
  commands:    ['test', 'cek', 'tes'],
  category:    'Fun',
  description: 'Test apakah bot aktif dan merespons~',
  usage:       '.test',

  async handler(sock, m, { pushName, isOwner, isGroup, reply, react }) {
    await react('🐾');

    const text = [
      `╔═════════════════════╗`,
      `║  ✅  *BOT AKTIF!*  🐾 ║`,
      `╚═════════════════════╝`,
      ``,
      `Haii *${pushName}*~ Mino disini! UwU`,
      ``,
      `📊 *Info:*`,
      `• Status     : 🟢 Online`,
      `• Chat       : ${isGroup ? '👥 Grup' : '💬 Private'}`,
      `• Role       : ${isOwner ? '👑 Owner' : '👤 User'}`,
      `• Plugin     : ${global.plugins?.size || 0} aktif`,
      ``,
      `🐾 Ketik *.menu* buat lihat semua fitur ya~ OwO`,
      ``,
      settings.footer,
    ].join('\n');

    // Kirim dengan thumbnail dari URL
    await replyImage(sock, m, settings.images.menu, text);
    await react('✅');
  },
};
