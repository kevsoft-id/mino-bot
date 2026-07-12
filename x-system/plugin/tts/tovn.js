'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const axios    = require('axios');
const settings = require('../../../set/settings');

// Google TTS — gratis, tanpa API key
async function googleTTS(text, lang = 'id') {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(text)}`;
  const { data } = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 15000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      Referer:      'https://translate.google.com/',
    },
  });
  return Buffer.from(data);
}

module.exports = {
  commands:    ['tovn', 'teks2suara', 'text2voice', 'tovoice', 'gtts'],
  category:    'TTS',
  description: 'Ubah teks menjadi voice note (Google TTS, gratis)',
  usage:       '.tovn <teks>  |  .tovn en <teks>  |  reply teks → .tovn',

  async handler(sock, m, { args, text, reply, react }) {
    const { theme } = settings;

    const LANGS = {
      id: 'Indonesia', en: 'English', ja: 'Japonés',
      ko: '한국어', ar: 'العربية', fr: 'Français',
      de: 'Deutsch', es: 'Español', zh: '中文',
    };

    if (!text) {
      // Check quoted message
      const quotedText =
        m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation ||
        m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text;

      if (!quotedText) {
        return reply([
          theme.header, '',
          ` ⬡  🔊  ${theme.bold('TEXT TO VOICE NOTE')}`, '',
          `    ${theme.bullet} .tovn <teks>         → bahasa Indonesia`,
          `    ${theme.bullet} .tovn en <teks>      → bahasa Inggris`,
          `    ${theme.bullet} Reply teks + .tovn   → suarakan pesan`,
          '',
          `    🌐 ${theme.bold('Kode Bahasa:')} ${Object.entries(LANGS).map(([k]) => k).join(', ')}`,
          '',
          `    ⚡ Powered by Google TTS (gratis)`,
          '',
          theme.footer,
        ].join('\n'));
      }
      // Use quoted text
      text = quotedText;
    }

    // Parse language code
    let lang      = 'id';
    let speakText = text;

    const firstWord = args[0]?.toLowerCase();
    if (LANGS[firstWord]) {
      lang      = firstWord;
      speakText = args.slice(1).join(' ');
    }

    if (!speakText.trim()) return reply('❌ Teks tidak boleh kosong');
    if (speakText.length > 200) return reply('❌ Teks terlalu panjang (maks 200 karakter untuk Google TTS)');

    await react('⏳');

    try {
      const audioBuf = await googleTTS(speakText, lang);

      await react('✅');
      await sock.sendMessage(m.key.remoteJid, {
        audio:    audioBuf,
        mimetype: 'audio/mpeg',
        ptt:      true,  // kirim sebagai voice note
      }, { quoted: m });
    } catch (err) {
      await react('❌');
      await reply(`❌ Gagal convert ke voice:\n${err.message}`);
    }
  },
};
