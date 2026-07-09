'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const axios    = require('axios');
const settings = require('../../../settings');

module.exports = {
  commands:    ['ss', 'screenshot', 'webshot', 'capture', 'snap'],
  category:    'Tools',
  description: 'Screenshot/tangkap tampilan sebuah website',
  usage:       '.ss {url}',

  async handler(sock, m, { text, reply, react }) {
    const { theme } = settings;

    if (!text) {
      return reply([
        theme.header, '',
        ` ⬡  📸  ${theme.bold('WEBSITE SCREENSHOT')}`, '',
        `    ${theme.bullet} Masukkan URL website yang mau di-screenshot`,
        `    ${theme.bullet} Contoh: .ss https://github.com`,
        '',
        theme.footer,
      ].join('\n'));
    }

    let url = text.trim();
    if (!url.startsWith('http')) url = 'https://' + url;

    await react('📸');
    await reply('📸 Mengambil screenshot...');

    try {
      // Use thum.io free screenshot service
      const ssUrl = `https://image.thum.io/get/width/1280/crop/720/allowJPG/wait/3/noanimate/${url}`;

      const { data, headers } = await axios.get(ssUrl, {
        responseType: 'arraybuffer',
        timeout: 30000,
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });

      const buf = Buffer.from(data);
      if (buf.length < 5000) throw new Error('Screenshot gagal — website mungkin tidak tersedia');

      await react('✅');
      await sock.sendMessage(m.key.remoteJid, {
        image:   buf,
        caption: [
          `📸 *SCREENSHOT*`,
          ``,
          `🌐 URL: ${url}`,
          `📅 ${new Date().toLocaleString('id-ID', { timeZone: settings.timezone })}`,
          ``,
          settings.footer,
        ].join('\n'),
        jpegThumbnail: buf,
      }, { quoted: m });
    } catch (err) {
      await react('❌');
      // Fallback: try another service
      try {
        const ssUrl2 = `https://api.screenshotmachine.com?key=free&url=${encodeURIComponent(url)}&dimension=1280x720&format=jpg&timeout=5`;
        const { data } = await axios.get(ssUrl2, { responseType: 'arraybuffer', timeout: 20000 });
        const buf = Buffer.from(data);
        await sock.sendMessage(m.key.remoteJid, {
          image:   buf,
          caption: `📸 Screenshot: ${url}\n\n${settings.footer}`,
          jpegThumbnail: buf,
        }, { quoted: m });
      } catch {
        await reply(`❌ Gagal screenshot "${url}"\n${err.message}\n\nPastikan URL valid dan website tidak down.`);
      }
    }
  },
};
