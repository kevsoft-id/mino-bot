'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const axios    = require('axios');
const settings = require('../../../set/settings');

// Cache voice list
let cachedVoices = null;
let cacheTime    = 0;

async function getVoices() {
  const now = Date.now();
  if (cachedVoices && now - cacheTime < 3600000) return cachedVoices; // 1 hour cache

  const key = settings.elevenLabsApiKey;
  if (!key) throw new Error('elevenLabsApiKey belum diisi di settings.js');

  const { data } = await axios.get('https://api.elevenlabs.io/v1/voices', {
    headers: { 'xi-api-key': key },
    timeout: 10000,
  });

  cachedVoices = data.voices || [];
  cacheTime    = now;
  return cachedVoices;
}

async function synthesize(voiceId, text) {
  const key = settings.elevenLabsApiKey;
  if (!key) throw new Error('elevenLabsApiKey belum diisi di settings.js');

  const { data } = await axios.post(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.8 },
    },
    {
      headers: {
        'xi-api-key':   key,
        'Content-Type': 'application/json',
        Accept:         'audio/mpeg',
      },
      responseType: 'arraybuffer',
      timeout: 30000,
    }
  );
  return Buffer.from(data);
}

module.exports = {
  commands:    ['tts', 'suarakan', 'speak'],
  category:    'TTS',
  description: 'Text to Speech dengan ElevenLabs. Format: .tts {id},{teks} | .tts list | .tts search {nama}',
  usage:       '.tts {voice_id},{teks}  |  .tts list  |  .tts search {nama}',

  async handler(sock, m, { args, text, reply, react }) {
    const { theme } = settings;

    if (!text) {
      return reply([
        theme.header, '',
        ` ⬡  🗣️  ${theme.bold('TEXT TO SPEECH (ElevenLabs)')}`, '',
        `    ${theme.bullet} ${theme.bold('.tts list')}           → Lihat semua suara`,
        `    ${theme.bullet} ${theme.bold('.tts search {nama}')}  → Cari suara`,
        `    ${theme.bullet} ${theme.bold('.tts {id},{teks}')}    → Suarakan teks`,
        '',
        `    📝 Contoh: .tts 21m00Tcm4TlvDq8ikWAM,Halo selamat datang!`,
        `    ⚡ Powered by ElevenLabs`,
        '',
        theme.footer,
      ].join('\n'));
    }

    const sub = args[0]?.toLowerCase();

    // ── .tts list ──────────────────────────────────────────
    if (sub === 'list') {
      await react('📋');
      try {
        const voices = await getVoices();
        const list = voices.slice(0, 20).map(v =>
          `    🎙️ *${v.name}*\n       ID: \`${v.voice_id}\`\n       Category: ${v.category || '-'}`
        ).join('\n\n');

        await reply([
          theme.header, '',
          ` ⬡  🎙️  ${theme.bold('DAFTAR SUARA ELEVENLABS')}`,
          ` (menampilkan ${Math.min(voices.length, 20)} dari ${voices.length})`, '',
          list,
          '',
          `    💡 Gunakan: .tts {id},{teks} untuk berbicara`,
          `    🔍 Atau: .tts search {nama} untuk mencari`,
          '',
          theme.footer,
        ].join('\n'));
      } catch (err) {
        await react('❌');
        await reply(`❌ ${err.message}`);
      }
      return;
    }

    // ── .tts search {query} ────────────────────────────────
    if (sub === 'search') {
      const query = args.slice(1).join(' ').toLowerCase();
      if (!query) return reply('❓ Masukkan nama suara yang dicari\nContoh: .tts search rachel');

      await react('🔍');
      try {
        const voices  = await getVoices();
        const results = voices.filter(v =>
          v.name.toLowerCase().includes(query) ||
          v.labels?.description?.toLowerCase().includes(query) ||
          v.category?.toLowerCase().includes(query)
        );

        if (!results.length) return reply(`❌ Suara "${query}" tidak ditemukan`);

        const list = results.slice(0, 10).map(v =>
          `    🎙️ *${v.name}* (${v.category || '-'})\n       ID: \`${v.voice_id}\``
        ).join('\n\n');

        await react('✅');
        await reply([
          `🔍 *Hasil pencarian: "${query}"* (${results.length} ditemukan)`,
          '',
          list,
          '',
          `💡 Gunakan: .tts {id},{teks}`,
          '',
          settings.footer,
        ].join('\n'));
      } catch (err) {
        await react('❌');
        await reply(`❌ ${err.message}`);
      }
      return;
    }

    // ── .tts {id},{text} ───────────────────────────────────
    const commaIdx = text.indexOf(',');
    if (commaIdx === -1) {
      return reply([
        '❓ Format salah!',
        '',
        'Gunakan: `.tts {voice_id},{teks}`',
        'Contoh: `.tts 21m00Tcm4TlvDq8ikWAM,Halo dunia!`',
        '',
        'Lihat ID suara: `.tts list` atau `.tts search {nama}`',
      ].join('\n'));
    }

    const voiceId  = text.slice(0, commaIdx).trim();
    const ttsText  = text.slice(commaIdx + 1).trim();

    if (!ttsText) return reply('❌ Teks tidak boleh kosong setelah koma');
    if (ttsText.length > 500) return reply('❌ Teks terlalu panjang (maks 500 karakter)');

    await react('⏳');
    await reply('🗣️ Sedang menyuarakan teks...');

    try {
      const audioBuf = await synthesize(voiceId, ttsText);

      await react('✅');
      await sock.sendMessage(m.key.remoteJid, {
        audio:    audioBuf,
        mimetype: 'audio/mpeg',
        ptt:      false,
      }, { quoted: m });

      await reply([
        `✅ *TTS berhasil!*`,
        `🎙️ Voice ID: \`${voiceId}\``,
        `📝 Teks: ${ttsText.slice(0, 80)}`,
        ``,
        settings.footer,
      ].join('\n'));
    } catch (err) {
      await react('❌');
      await reply(`❌ Gagal TTS: ${err.response?.data?.detail?.message || err.message}`);
    }
  },
};
