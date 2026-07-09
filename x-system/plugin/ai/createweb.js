'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const axios    = require('axios');
const settings = require('../../../settings');
const { replyDoc } = require('../../../lib/utils');

const SYSTEM_PROMPT = `Kamu adalah ahli web developer profesional. Tugasmu adalah membuat kode HTML lengkap dan beautiful berdasarkan deskripsi yang diberikan user.

ATURAN WAJIB:
1. Hanya output kode HTML mentah — TANPA penjelasan, TANPA markdown, TANPA komentar di luar kode
2. Selalu dalam satu file HTML lengkap (<!DOCTYPE html>... sampai </html>)
3. Gunakan CSS inline/embedded yang modern dan beautiful (gradient, animations, glass morphism, dll)
4. Responsive (mobile-first)
5. Tambahkan JavaScript interaktif jika relevan
6. Gunakan Google Fonts jika perlu (via CDN)
7. Pastikan kode bisa langsung dijalankan di browser tanpa dependency eksternal berbayar

Output HANYA kode HTML, tidak ada teks lain sama sekali.`;

module.exports = {
  commands:    ['createweb', 'makeweb', 'buatweb', 'webai'],
  category:    'AI',
  description: 'Buat halaman web HTML dengan AI berdasarkan deskripsi',
  usage:       '.createweb <deskripsi>',

  async handler(sock, m, { text, reply, react }) {
    const { theme } = settings;

    if (!text) {
      return reply([
        theme.header, '',
        ` ⬡  🌐  ${theme.bold('CREATE WEB AI')}`, '',
        `    ${theme.bullet} Deskripsikan website yang kamu inginkan`,
        `    ${theme.bullet} Bot akan generate HTML lengkap`,
        '',
        `    📝 ${theme.bold('Contoh:')}`,
        `    .createweb landing page kalkulator BMI dengan animasi`,
        `    .createweb portofolio photographer dark theme`,
        `    .createweb toko online sederhana dengan cart`,
        '',
        theme.footer,
      ].join('\n'));
    }

    const key = settings.openRouterApiKey;
    if (!key) return reply('❌ openRouterApiKey belum diisi di settings.js\nDaftar gratis di: https://openrouter.ai');

    await react('⏳');
    await reply('🌐 Sedang membuat website kamu dengan AI...\nTunggu sebentar ya~');

    try {
      const { data } = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: settings.aiModels?.createweb || 'openai/gpt-4o',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `Buat website: ${text}` },
          ],
          max_tokens: 4000,
          temperature: 0.8,
        },
        {
          headers: {
            Authorization:  `Bearer ${key}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://github.com/kevsoft-id/mino-bot',
            'X-Title':      settings.botName,
          },
          timeout: 60000,
        }
      );

      let html = data.choices?.[0]?.message?.content?.trim() || '';

      // Strip markdown code blocks if AI wraps it
      html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/, '');

      if (!html.includes('<html') && !html.includes('<!DOCTYPE')) {
        throw new Error('AI tidak menghasilkan HTML yang valid');
      }

      const buf  = Buffer.from(html, 'utf8');
      const name = `kevsoft_web_${Date.now()}.html`;

      await react('✅');
      await reply([
        `✅ *Website berhasil dibuat!*`,
        ``,
        `📁 File: \`${name}\``,
        `📝 Deskripsi: ${text.slice(0, 100)}`,
        `📦 Ukuran: ${(buf.length / 1024).toFixed(1)} KB`,
        ``,
        `💡 Buka file HTML di browser untuk melihat hasilnya`,
        `🚀 Gunakan .vercel untuk deploy ke internet!`,
        ``,
        settings.footer,
      ].join('\n'));

      await replyDoc(sock, m, buf, name, 'text/html');
    } catch (err) {
      await react('❌');
      await reply(`❌ Gagal membuat website:\n${err.response?.data?.error?.message || err.message}`);
    }
  },
};
