'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../settings');
const axios    = require('axios');
const { replyImage, fetchImageBuffer } = require('../../../lib/utils');
const queue    = require('../../../lib/queue');

module.exports = {
  commands:    ['spotify', 'spdl', 'spoti'],
  category:    'Downloader',
  description: 'Search & download lagu dari Spotify 🎵',
  usage:       '.spotify <judul lagu>  |  .spotify <url spotify>',

  async handler(sock, m, { args, text, reply, react }) {
    const { theme } = settings;
    if (!text) return reply(`❓ Contoh:\n  .spotify Halo Adele\n  .spotify https://open.spotify.com/track/xxx`);

    await react('⏳');
    try {
      const res  = await axios.get(
        `https://api.siputzx.my.id/api/d/spotify?query=${encodeURIComponent(text)}`,
        { timeout: 25000 }
      );
      const data = res.data?.data || res.data;
      if (!data) { await react('❌'); return reply('❌ Lagu tidak ditemukan.'); }

      const title    = data.title || data.name || text;
      const artist   = data.artist || data.artists?.map(a => a.name).join(', ') || '-';
      const album    = data.album || '-';
      const duration = data.duration || '-';
      const cover    = data.image || data.cover || data.thumbnail;
      const dlUrl    = data.download || data.url;

      if (!dlUrl) { await react('❌'); return reply('❌ Link download tidak tersedia untuk lagu ini.'); }

      await react('✅');
      const caption = [
        theme.header, '',
        ` ⬡  🎵  ${theme.bold('SPOTIFY DOWNLOADER')}`, '',
        `  🎵 ${theme.bold('Judul')}  : ${title}`,
        `  👤 ${theme.bold('Artist')} : ${artist}`,
        `  💿 ${theme.bold('Album')}  : ${album}`,
        `  ⏱️  ${theme.bold('Durasi')} : ${duration}`,
        '', theme.footer,
      ].join('\n');

      // Send cover first
      if (cover) await replyImage(sock, m, cover, caption);

      // Send audio file
      const audioBuf = await fetchImageBuffer(dlUrl);
      if (audioBuf) {
        await queue.add(() =>
          sock.sendMessage(m.key.remoteJid, {
            audio: audioBuf,
            mimetype: 'audio/mpeg',
            ptt: false,
            fileName: `${title} - ${artist}.mp3`,
          }, { quoted: m })
        );
      } else {
        await reply(`🎵 Download link:\n${dlUrl}\n\n${settings.footer}`);
      }
    } catch {
      await react('❌');
      return reply('❌ Gagal download. Coba lagi atau cek judul lagu kamu.');
    }
  },
};
