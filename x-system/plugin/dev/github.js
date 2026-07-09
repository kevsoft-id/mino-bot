'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const axios    = require('axios');
const settings = require('../../../settings');
const { replyDoc } = require('../../../lib/utils');

function ghHeaders() {
  const h = { 'User-Agent': 'KEVSOFTBot/2.0', Accept: 'application/vnd.github.v3+json' };
  if (settings.githubToken) h.Authorization = `Bearer ${settings.githubToken}`;
  return h;
}

// Parse GitHub URL → { owner, repo, filePath, branch }
function parseGithubUrl(url) {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    if (!u.hostname.includes('github.com')) return null;
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    const [owner, repo, ...rest] = parts;
    let branch   = 'main';
    let filePath = '';
    if (rest[0] === 'blob' || rest[0] === 'raw') {
      branch   = rest[1] || 'main';
      filePath = rest.slice(2).join('/');
    } else if (rest.length) {
      filePath = rest.join('/');
    }
    return { owner, repo: repo.replace('.git', ''), branch, filePath };
  } catch { return null; }
}

module.exports = [
  // ── .github {url} — Download file dari GitHub ──────────
  {
    commands:    ['github', 'ghfile', 'ghdownload'],
    category:    'Dev',
    description: 'Download file langsung dari URL GitHub',
    usage:       '.github {url_github}',

    async handler(sock, m, { args, text, reply, react }) {
      const { theme } = settings;

      if (!text) {
        return reply([
          theme.header, '',
          ` ⬡  🐙  ${theme.bold('GITHUB FILE DOWNLOADER')}`, '',
          `    ${theme.bullet} Masukkan URL file GitHub`,
          `    ${theme.bullet} Contoh:`,
          `      .github https://github.com/user/repo/blob/main/file.js`,
          `      .github https://raw.githubusercontent.com/user/repo/main/file.js`,
          '',
          theme.footer,
        ].join('\n'));
      }

      // Validate & convert to raw URL — only GitHub domains allowed
      let rawUrl = text.trim();
      let parsedUrl;
      try { parsedUrl = new URL(rawUrl.startsWith('http') ? rawUrl : 'https://' + rawUrl); } catch {
        return reply('❌ URL tidak valid');
      }
      const allowedHosts = ['github.com', 'raw.githubusercontent.com', 'gist.githubusercontent.com'];
      if (!allowedHosts.some(h => parsedUrl.hostname === h || parsedUrl.hostname.endsWith('.' + h))) {
        return reply('❌ Hanya URL dari GitHub yang diperbolehkan\n(github.com atau raw.githubusercontent.com)');
      }
      if (rawUrl.includes('github.com') && !rawUrl.includes('raw.githubusercontent.com')) {
        rawUrl = rawUrl
          .replace('https://github.com/', 'https://raw.githubusercontent.com/')
          .replace('/blob/', '/');
      }

      await react('⬇️');

      try {
        const { data, headers } = await axios.get(rawUrl, {
          responseType: 'arraybuffer',
          timeout: 30000,
          headers: { 'User-Agent': 'KEVSOFTBot/2.0' },
        });

        const buf      = Buffer.from(data);
        const fileName = rawUrl.split('/').pop() || 'file';
        const mime     = headers['content-type'] || 'application/octet-stream';

        await react('✅');
        await reply([
          `✅ *File berhasil didownload!*`,
          ``,
          `📁 Nama: ${fileName}`,
          `📦 Ukuran: ${(buf.length / 1024).toFixed(1)} KB`,
          `🌐 Source: GitHub`,
          ``,
          settings.footer,
        ].join('\n'));

        await replyDoc(sock, m, buf, fileName, mime);
      } catch (err) {
        await react('❌');
        if (err.response?.status === 404) {
          await reply(`❌ File tidak ditemukan di GitHub\nCek URL-nya ya~`);
        } else {
          await reply(`❌ Gagal download: ${err.message}`);
        }
      }
    },
  },

  // ── .ghrepo {owner/repo} — Info repository ─────────────
  {
    commands:    ['ghrepo', 'gitrepo', 'repoinfo'],
    category:    'Dev',
    description: 'Info detail sebuah repositori GitHub',
    usage:       '.ghrepo {owner/repo}',

    async handler(sock, m, { text, reply, react }) {
      if (!text) return reply('❓ Masukkan nama repo\nContoh: .ghrepo kevsoft-id/mino-bot');
      await react('🔍');

      try {
        const repo = text.trim().replace('https://github.com/', '');
        const { data: r } = await axios.get(`https://api.github.com/repos/${repo}`, {
          headers: ghHeaders(), timeout: 10000,
        });

        const lang = await axios.get(`https://api.github.com/repos/${repo}/languages`, {
          headers: ghHeaders(), timeout: 8000,
        }).then(x => Object.keys(x.data).slice(0, 5).join(', ')).catch(() => '-');

        await react('✅');
        await reply([
          `🐙 *GITHUB REPO INFO*`,
          ``,
          `📦 *Nama*   : ${r.full_name}`,
          `📝 *Desc*   : ${r.description || '-'}`,
          `⭐ *Stars*  : ${r.stargazers_count.toLocaleString()}`,
          `🍴 *Forks*  : ${r.forks_count.toLocaleString()}`,
          `👁️ *Watch*  : ${r.watchers_count.toLocaleString()}`,
          `🐛 *Issues* : ${r.open_issues_count.toLocaleString()}`,
          `📊 *Lang*   : ${lang}`,
          `🌿 *Branch* : ${r.default_branch}`,
          `📅 *Updated*: ${new Date(r.updated_at).toLocaleDateString('id-ID')}`,
          `🔒 *Visib*  : ${r.private ? 'Private' : 'Public'}`,
          ``,
          `🔗 ${r.html_url}`,
          ``,
          settings.footer,
        ].join('\n'));
      } catch (err) {
        await react('❌');
        await reply(`❌ Gagal ambil info repo: ${err.response?.status === 404 ? 'Repo tidak ditemukan' : err.message}`);
      }
    },
  },

  // ── .ghuser {username} — Info user GitHub ──────────────
  {
    commands:    ['ghuser', 'gituser', 'devprofile'],
    category:    'Dev',
    description: 'Info profil developer di GitHub',
    usage:       '.ghuser {username}',

    async handler(sock, m, { text, reply, react }) {
      if (!text) return reply('❓ Masukkan username GitHub\nContoh: .ghuser torvalds');
      await react('🔍');

      try {
        const { data: u } = await axios.get(`https://api.github.com/users/${text.trim()}`, {
          headers: ghHeaders(), timeout: 10000,
        });

        await react('✅');
        await reply([
          `👤 *GITHUB USER PROFILE*`,
          ``,
          `🆔 *Username* : @${u.login}`,
          `📛 *Nama*     : ${u.name || '-'}`,
          `📝 *Bio*      : ${u.bio || '-'}`,
          `🏢 *Company*  : ${u.company || '-'}`,
          `📍 *Lokasi*   : ${u.location || '-'}`,
          `📦 *Repos*    : ${u.public_repos} public`,
          `👥 *Followers*: ${u.followers.toLocaleString()}`,
          `👣 *Following*: ${u.following.toLocaleString()}`,
          `📅 *Join*     : ${new Date(u.created_at).toLocaleDateString('id-ID')}`,
          ``,
          `🔗 ${u.html_url}`,
          ``,
          settings.footer,
        ].join('\n'));
      } catch (err) {
        await react('❌');
        await reply(`❌ ${err.response?.status === 404 ? 'User tidak ditemukan' : err.message}`);
      }
    },
  },

  // ── .ghtrending — GitHub trending repos ─────────────────
  {
    commands:    ['ghtrending', 'gittrend', 'trendingdev'],
    category:    'Dev',
    description: 'Repo GitHub yang sedang trending hari ini',
    usage:       '.ghtrending  |  .ghtrending python',

    async handler(sock, m, { text, reply, react }) {
      await react('📈');

      try {
        const lang   = text?.trim() || '';
        const since  = 'daily';
        const url    = `https://gh-trending-api.miguelmota.com/repositories?language=${encodeURIComponent(lang)}&since=${since}`;
        const { data } = await axios.get(url, { timeout: 15000 });

        if (!data?.length) throw new Error('Tidak ada data trending');

        const list = data.slice(0, 8).map((r, i) =>
          `${i + 1}. *${r.name}* — ⭐${r.stars || 0}\n   ${r.description?.slice(0, 60) || '-'}\n   ${r.url}`
        ).join('\n\n');

        await react('✅');
        await reply([
          `📈 *GITHUB TRENDING${lang ? ' — ' + lang.toUpperCase() : ''}*`,
          `📅 ${new Date().toLocaleDateString('id-ID')}`,
          ``,
          list,
          ``,
          settings.footer,
        ].join('\n'));
      } catch (err) {
        await react('❌');
        // Fallback: use GitHub Search API
        try {
          const q    = text ? `language:${text}` : 'stars:>1000';
          const { data } = await axios.get('https://api.github.com/search/repositories', {
            params: { q, sort: 'stars', order: 'desc', per_page: 6 },
            headers: ghHeaders(), timeout: 10000,
          });
          const list = data.items.map((r, i) =>
            `${i + 1}. *${r.full_name}* — ⭐${r.stargazers_count.toLocaleString()}\n   ${r.description?.slice(0, 60) || '-'}`
          ).join('\n\n');
          await react('✅');
          await reply([`📈 *TOP GITHUB REPOS*\n`, list, '', settings.footer].join('\n'));
        } catch {
          await reply(`❌ Gagal ambil data trending: ${err.message}`);
        }
      }
    },
  },
];
