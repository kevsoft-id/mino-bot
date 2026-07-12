'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const axios    = require('axios');
const settings = require('../../../set/settings');

module.exports = {
  commands:    ['unsplash', 'foto', 'gambar', 'image', 'pixabay'],
  category:    'Tools',
  description: 'Cari foto/gambar HD bebas royalti (Pixabay)',
  usage:       '.foto {keyword}  |  .unsplash {keyword}',

  async handler(sock, m, { text, reply, react }) {
    const { theme } = settings;

    if (!text) {
      return reply([
        theme.header, '',
        ` ⬡  🖼️  ${theme.bold('CARI GAMBAR HD')}`, '',
        `    ${theme.bullet} .foto {keyword}     → cari gambar`,
        `    ${theme.bullet} Contoh: .foto sunset beach`,
        `    ${theme.bullet} .foto kucing lucu`,
        `    ${theme.bullet} .foto programming aesthetic`,
        '',
        `    ⚡ Powered by Pixabay (gratis, bebas royalti)`,
        '',
        theme.footer,
      ].join('\n'));
    }

    await react('🔍');

    const pixabayKey = settings.pixabayApiKey;

    try {
      let imgUrl = '';
      let credit = '';
      let pageUrl = '';

      if (pixabayKey) {
        // Use Pixabay API
        const { data } = await axios.get('https://pixabay.com/api/', {
          params: {
            key:          pixabayKey,
            q:            text,
            image_type:   'photo',
            per_page:     5,
            safesearch:   true,
            lang:         'id',
          },
          timeout: 10000,
        });

        if (!data.hits?.length) throw new Error(`Gambar "${text}" tidak ditemukan`);

        const pick = data.hits[Math.floor(Math.random() * Math.min(data.hits.length, 5))];
        imgUrl   = pick.largeImageURL || pick.webformatURL;
        credit   = pick.user || '-';
        pageUrl  = pick.pageURL || '';
      } else {
        // Fallback: Unsplash Source (no key needed, random image)
        imgUrl = `https://source.unsplash.com/1280x720/?${encodeURIComponent(text)}`;
        credit = 'Unsplash';
      }

      // Download the image
      const { data: imgData } = await axios.get(imgUrl, {
        responseType: 'arraybuffer',
        timeout: 20000,
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });

      const buf = Buffer.from(imgData);

      await react('✅');
      await sock.sendMessage(m.key.remoteJid, {
        image:   buf,
        caption: [
          `🖼️ *GAMBAR: ${text}*`,
          ``,
          `📸 Kredit: ${credit}`,
          pageUrl ? `🔗 ${pageUrl}` : '',
          ``,
          settings.footer,
        ].filter(Boolean).join('\n'),
        jpegThumbnail: buf,
      }, { quoted: m });
    } catch (err) {
      await react('❌');
      await reply(`❌ Gambar tidak ditemukan:\n${err.message}`);
    }
  },
};
