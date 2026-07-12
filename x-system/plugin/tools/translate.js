'use strict';
const axios    = require('axios');
const settings = require('../../../set/settings');

const LANGS = {
  'en': 'Inggris', 'id': 'Indonesia', 'ja': 'Jepang', 'ko': 'Korea',
  'zh': 'Mandarin', 'ar': 'Arab', 'fr': 'Prancis', 'de': 'Jerman',
  'es': 'Spanyol', 'pt': 'Portugis', 'ru': 'Rusia', 'it': 'Italia',
  'nl': 'Belanda', 'th': 'Thailand', 'vi': 'Vietnam', 'ms': 'Melayu',
};

module.exports = {
  commands: ['tr', 'translate', 'terjemah'],
  category: 'Tools',
  description: 'Terjemahkan teks ke bahasa lain~',
  usage: '.tr <kode_bahasa> <teks>',

  async handler(sock, m, { args, reply, react }) {
    if (args.length < 2) {
      const langList = Object.entries(LANGS).map(([k, v]) => `\`${k}\` = ${v}`).join(', ');
      return reply([
        `❓ Format: \`.tr <kode_bahasa> <teks>\``,
        `Contoh: \`.tr en halo dunia\``,
        ``,
        `📋 *Kode bahasa:*`,
        langList,
      ].join('\n'));
    }

    const targetLang = args[0].toLowerCase();
    const text       = args.slice(1).join(' ');

    if (!text) return reply('❌ Masukkan teks yang mau diterjemahkan nya~');

    await react('🌐');

    try {
      // MyMemory free translation API
      const { data } = await axios.get('https://api.mymemory.translated.net/get', {
        params: { q: text, langpair: `auto|${targetLang}` },
        timeout: 12000,
      });

      const result   = data.responseData?.translatedText;
      if (!result)   throw new Error('Tidak ada hasil terjemahan');

      const langName = LANGS[targetLang] || targetLang.toUpperCase();

      await react('✅');
      await reply([
        `🌐 *TRANSLATE* nya~`,
        ``,
        `📝 *Original :* ${text}`,
        `🔀 *Ke Bahasa:* ${langName} (\`${targetLang}\`)`,
        `💬 *Hasil    :* ${result}`,
        ``,
        settings.footer,
      ].join('\n'));
    } catch (err) {
      await react('❌');
      await reply(`❌ Gagal menerjemahkan nya~\n${err.message}`);
    }
  },
};
