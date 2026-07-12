'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const axios    = require('axios');
const settings = require('../../../set/settings');
const { truncate } = require('../../../lib/utils');

module.exports = [
  // ── .devto {search} ─────────────────────────────────────
  {
    commands:    ['devto', 'devartikel', 'devblog'],
    category:    'Dev',
    description: 'Cari artikel programming di Dev.to',
    usage:       '.devto {pencarian}',

    async handler(sock, m, { text, reply, react }) {
      if (!text) return reply('❓ Masukkan kata kunci pencarian\nContoh: .devto react hooks');
      await react('🔍');

      try {
        const { data } = await axios.get('https://dev.to/api/articles', {
          params: { q: text, per_page: 6, top: 7 },
          timeout: 10000,
        });

        if (!data?.length) return reply(`❌ Artikel "${text}" tidak ditemukan di Dev.to`);

        const list = data.map((a, i) =>
          `${i + 1}. *${a.title}*\n   👤 ${a.user.name} | ❤️ ${a.positive_reactions_count} | 💬 ${a.comments_count}\n   🔗 ${a.url}`
        ).join('\n\n');

        await react('✅');
        await reply([
          `📰 *DEV.TO — "${text}"*`,
          ``,
          list,
          ``,
          settings.footer,
        ].join('\n'));
      } catch (err) {
        await react('❌');
        await reply(`❌ Gagal cari artikel: ${err.message}`);
      }
    },
  },

  // ── .artikelterbaru ─────────────────────────────────────
  {
    commands:    ['artikelterbaru', 'latestarticle', 'newdev', 'devnew'],
    category:    'Dev',
    description: 'Artikel programming terbaru dari Dev.to',
    usage:       '.artikelterbaru  |  .artikelterbaru javascript',

    async handler(sock, m, { text, reply, react }) {
      await react('📰');

      try {
        const params = { per_page: 8 };
        if (text) params.tag = text.trim().toLowerCase();

        const { data } = await axios.get('https://dev.to/api/articles', {
          params,
          timeout: 10000,
        });

        if (!data?.length) throw new Error('Tidak ada artikel');

        const list = data.map((a, i) =>
          `${i + 1}. *${truncate(a.title, 60)}*\n   ${a.tag_list.slice(0, 3).map(t => '#' + t).join(' ')}\n   ❤️${a.positive_reactions_count} | 🕒 ${new Date(a.published_at).toLocaleDateString('id-ID')}`
        ).join('\n\n');

        await react('✅');
        await reply([
          `📰 *ARTIKEL TERBARU DEV.TO${text ? ' — #' + text : ''}*`,
          ``,
          list,
          ``,
          `🔗 Baca selengkapnya di: https://dev.to`,
          ``,
          settings.footer,
        ].join('\n'));
      } catch (err) {
        await react('❌');
        await reply(`❌ Gagal ambil artikel: ${err.message}`);
      }
    },
  },

  // ── .eventkoding ────────────────────────────────────────
  {
    commands:    ['eventkoding', 'eventkodingbaru', 'devconf', 'hackathon'],
    category:    'Dev',
    description: 'Event dan hackathon programming terbaru',
    usage:       '.eventkoding  |  .eventkoding indonesia',

    async handler(sock, m, { text, reply, react }) {
      await react('🗓️');

      try {
        // Gunakan Dev.to untuk event/conference tags
        const tags = text ? [text.trim()] : ['hackathon', 'conference', 'event', 'devops'];
        const results = [];

        for (const tag of tags.slice(0, 2)) {
          const { data } = await axios.get('https://dev.to/api/articles', {
            params: { tag, per_page: 4, top: 30 },
            timeout: 10000,
          }).catch(() => ({ data: [] }));
          results.push(...data);
        }

        // Also fetch from Eventbrite-like free API or just use Dev.to
        const unique = [...new Map(results.map(a => [a.id, a])).values()].slice(0, 8);

        if (!unique.length) {
          // Fallback: show upcoming events from GitHub
          await reply([
            `🗓️ *EVENT & HACKATHON TERBARU*`,
            ``,
            `Beberapa sumber event developer Indonesia:`,
            ``,
            `🔥 *Hackathon:*`,
            `   • https://devpost.com`,
            `   • https://hackerearth.com`,
            `   • https://mlh.io`,
            ``,
            `📅 *Konferensi:*`,
            `   • https://sessionize.com/events`,
            `   • https://papercall.io/events`,
            ``,
            `🇮🇩 *Indonesia:*`,
            `   • https://gdg.community.dev`,
            `   • https://eventbrite.com/d/indonesia/technology`,
            ``,
            settings.footer,
          ].join('\n'));
          return;
        }

        const list = unique.map((a, i) =>
          `${i + 1}. *${truncate(a.title, 70)}*\n   👤 ${a.user.name}\n   🔗 ${a.url}`
        ).join('\n\n');

        await react('✅');
        await reply([
          `🗓️ *EVENT & CODING NEWS TERBARU*`,
          ``,
          list,
          ``,
          settings.footer,
        ].join('\n'));
      } catch (err) {
        await react('❌');
        await reply(`❌ Gagal ambil event: ${err.message}`);
      }
    },
  },

  // ── .npm {package} ─────────────────────────────────────
  {
    commands:    ['npm', 'npminfo', 'npmpackage'],
    category:    'Dev',
    description: 'Info package npm',
    usage:       '.npm {nama_package}',

    async handler(sock, m, { text, reply, react }) {
      if (!text) return reply('❓ Masukkan nama package\nContoh: .npm express');
      await react('📦');

      try {
        const { data } = await axios.get(`https://registry.npmjs.org/${text.trim()}`, {
          timeout: 10000,
        });

        const latest = data['dist-tags']?.latest || '-';
        const ver    = data.versions?.[latest] || {};
        const weekly = await axios.get(`https://api.npmjs.org/downloads/point/last-week/${text.trim()}`, { timeout: 8000 })
          .then(r => r.data.downloads?.toLocaleString() || '-').catch(() => '-');

        await react('✅');
        await reply([
          `📦 *NPM PACKAGE INFO*`,
          ``,
          `📛 *Name*      : ${data.name}`,
          `🏷️ *Version*   : ${latest}`,
          `📝 *Desc*      : ${truncate(data.description || '-', 100)}`,
          `👤 *Author*    : ${ver.author?.name || data.author?.name || '-'}`,
          `📜 *License*   : ${ver.license || data.license || '-'}`,
          `📥 *DL/week*   : ${weekly}`,
          `📅 *Modified*  : ${new Date(data.time?.modified).toLocaleDateString('id-ID')}`,
          `🔗 *Homepage*  : ${ver.homepage || '-'}`,
          ``,
          `💻 Install: \`npm install ${data.name}\``,
          `🧶 Yarn: \`yarn add ${data.name}\``,
          `📦 pnpm: \`pnpm add ${data.name}\``,
          ``,
          settings.footer,
        ].join('\n'));
      } catch (err) {
        await react('❌');
        if (err.response?.status === 404) {
          await reply(`❌ Package "${text}" tidak ditemukan di npm`);
        } else {
          await reply(`❌ ${err.message}`);
        }
      }
    },
  },

  // ── .paste {teks} — Paste to Hastebin ──────────────────
  {
    commands:    ['paste', 'hastebin', 'pastebin'],
    category:    'Dev',
    description: 'Upload teks/kode ke Hastebin dan dapatkan link',
    usage:       '.paste <teks_atau_kode>',

    async handler(sock, m, { text, reply, react }) {
      if (!text) {
        // Check quoted message
        const qt =
          m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation ||
          m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text;
        if (!qt) return reply('❓ Masukkan teks atau reply pesan yang mau di-paste\nContoh: .paste console.log("hello")');
        text = qt;
      }

      await react('⏳');

      try {
        const { data } = await axios.post('https://hastebin.com/documents', text, {
          headers: { 'Content-Type': 'text/plain' },
          timeout: 10000,
        });

        const url = `https://hastebin.com/${data.key}`;
        await react('✅');
        await reply([
          `📋 *Paste berhasil!*`,
          ``,
          `🔗 *Link*  : ${url}`,
          `📊 *Raw*   : ${url}.txt`,
          `📝 *Chars* : ${text.length}`,
          ``,
          settings.footer,
        ].join('\n'));
      } catch {
        // Fallback to alternative
        try {
          const { data } = await axios.post('https://paste.rs', text, {
            headers: { 'Content-Type': 'text/plain' },
            timeout: 10000,
          });
          await react('✅');
          await reply(`📋 Paste berhasil!\n🔗 ${data.trim()}\n\n${settings.footer}`);
        } catch (err2) {
          await react('❌');
          await reply(`❌ Gagal upload paste: ${err2.message}`);
        }
      }
    },
  },
];
