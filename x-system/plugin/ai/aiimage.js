'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const axios    = require('axios');
const settings = require('../../../set/settings');
const { replyImage } = require('../../../lib/utils');

module.exports = {
  commands:    ['aiimg', 'imagine', 'imgai', 'aiimage', 'genbg'],
  category:    'AI',
  description: 'Generate gambar AI dari teks deskripsi (Pollinations.ai - gratis)',
  usage:       '.aiimg <deskripsi>',

  async handler(sock, m, { text, args, reply, react }) {
    const { theme } = settings;

    if (!text) {
      return reply([
        theme.header, '',
        ` ⬡  🎨  ${theme.bold('AI IMAGE GENERATOR')}`, '',
        `    ${theme.bullet} Deskripsikan gambar yang ingin dibuat`,
        `    ${theme.bullet} Gunakan bahasa Inggris untuk hasil terbaik`,
        '',
        `    📝 ${theme.bold('Contoh:')}`,
        `    .aiimg cyberpunk city at night, neon lights, rain`,
        `    .aiimg cute anime girl reading book in library`,
        `    .aiimg futuristic robot in a forest`,
        '',
        `    ⚡ Powered by Pollinations.ai (gratis, tanpa API key)`,
        '',
        theme.footer,
      ].join('\n'));
    }

    await react('🎨');
    await reply('🎨 Sedang membuat gambar AI... Tunggu ~10 detik ya~');

    try {
      const prompt = encodeURIComponent(text);
      const seed   = Math.floor(Math.random() * 100000);
      const imgUrl = `https://image.pollinations.ai/prompt/${prompt}?width=1024&height=1024&seed=${seed}&nologo=true`;

      // Fetch the image
      const res = await axios.get(imgUrl, {
        responseType: 'arraybuffer',
        timeout: 45000,
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });

      const buf = Buffer.from(res.data);

      await react('✅');
      await sock.sendMessage(m.key.remoteJid, {
        image:   buf,
        caption: [
          `🎨 *AI Generated Image*`,
          ``,
          `📝 *Prompt:* ${text.slice(0, 150)}`,
          `🔢 *Seed:* ${seed}`,
          ``,
          `⚡ _Powered by Pollinations.ai_`,
          ``,
          settings.footer,
        ].join('\n'),
        jpegThumbnail: buf,
      }, { quoted: m });
    } catch (err) {
      await react('❌');
      await reply(`❌ Gagal generate gambar:\n${err.message}\n\nCoba prompt yang berbeda atau coba lagi nanti.`);
    }
  },
};
