'use strict';

// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../set/settings');
const { replyImage, replyList } = require('../../../lib/utils');

// ── Peta kategori: key canonical → info tampilan ─────────────
const CATS = {
  main: {
    emoji: '⚙️',
    label: settings.theme.bold('MAIN MENU'),
    desc:  'Sistem bot & perintah utama',
    match: ['main', 'sistem', 'system', 'utama', 'm'],
  },
  fun: {
    emoji: '🎮',
    label: settings.theme.bold('FUN & HIBURAN'),
    desc:  'Games, meme, waifu, zodiak, dll',
    match: ['fun', 'hiburan', 'game', 'games', 'f'],
  },
  tools: {
    emoji: '🧰',
    label: settings.theme.bold('TOOLS & UTILITAS'),
    desc:  'Kalkulator, cuaca, translate, QR, dll',
    match: ['tools', 'tool', 'utilitas', 'utils', 't'],
  },
  downloader: {
    emoji: '📥',
    label: settings.theme.bold('DOWNLOADER'),
    desc:  'YouTube MP3/MP4, TikTok, Instagram',
    match: ['downloader', 'dl', 'download', 'd'],
  },
  group: {
    emoji: '👥',
    label: settings.theme.bold('GROUP MANAGEMENT'),
    desc:  'TagAll, Kick, Antilink, Mute, dll',
    match: ['group', 'grup', 'grp', 'g'],
  },
  owner: {
    emoji: '👑',
    label: settings.theme.bold('OWNER ONLY'),
    desc:  'Eval, broadcast, block, restart, dll',
    match: ['owner', 'own', 'o'],
  },
  anime: {
    emoji: '🌸',
    label: settings.theme.bold('ANIME & MANGA'),
    desc:  'Search anime, manga, quotes, karakter, gambar SFW',
    match: ['anime', 'ani', 'manga', 'weeb', 'a'],
  },
};

// ── Resolve alias → canonical key ────────────────────────────
function resolveCategory(input) {
  const q = input.toLowerCase().trim();
  for (const [key, cat] of Object.entries(CATS)) {
    if (cat.match.includes(q)) return key;
    if (key.startsWith(q)) return key;
  }
  return null;
}

// ── Kumpulkan plugin per canonical category ───────────────────
function getPluginsForCategory(catKey) {
  const seen = new Set();
  const list  = [];
  for (const [, p] of global.plugins) {
    const pCat = (p.category || 'Extra').toLowerCase().trim();
    if (pCat !== catKey && !CATS[catKey]?.match.includes(pCat)) continue;
    if (seen.has(p.filePath)) continue;
    seen.add(p.filePath);
    list.push(p);
  }
  return list;
}

// ── Render teks KEVSOFT style untuk satu kategori ─────────────
function renderCategoryText(catKey, plugins) {
  const cat = CATS[catKey];
  const { theme } = settings;
  const lines = [
    theme.header,
    '',
    ` ⬡  ${cat.emoji}  ${cat.label}`,
    '',
  ];

  if (plugins.length === 0) {
    lines.push(`${theme.indent}${theme.bullet} (belum ada plugin di kategori ini)`);
  } else {
    for (const p of plugins) {
      const cmd    = p.commands[0];
      const desc   = p.description || '-';
      const tag    = p.ownerOnly ? ' 👑' : p.adminOnly ? ' 👮' : p.groupOnly ? ' 👥' : '';
      const cmdPad = `.${cmd}`.padEnd(12);
      lines.push(`${theme.indent}${theme.bullet} ${cmdPad} - ${desc}${tag}`);
    }
  }

  lines.push('');
  lines.push(theme.footer);
  return lines.join('\n');
}

// ── Render teks menu utama (daftar kategori) ──────────────────
function renderMainMenuText(pushName, isOwner) {
  const { theme } = settings;
  const now = new Date().toLocaleString('id-ID', {
    timeZone: settings.timezone,
    weekday:  'long',
    day:      '2-digit',
    month:    'long',
    year:     'numeric',
    hour:     '2-digit',
    minute:   '2-digit',
  });

  const totalPlugins = new Set([...global.plugins.values()].map(p => p.filePath)).size;

  const lines = [
    theme.header,
    '',
    ` 👤 ${theme.bold('User')}    : ${pushName}${isOwner ? ' 👑' : ''}`,
    ` 📅 ${theme.bold('Tanggal')} : ${now}`,
    ` 🔌 ${theme.bold('Plugin')}  : ${totalPlugins} aktif  •  ${global.plugins.size} perintah`,
    ` 🔑 ${theme.bold('Prefix')}  : ${settings.prefix}`,
    '',
    theme.div,
    '',
  ];

  for (const [key, cat] of Object.entries(CATS)) {
    lines.push(` ⬡  ${cat.emoji}  ${cat.label}`);
    lines.push(`${theme.indent}${theme.bullet} ketik ${theme.bold('.menu ' + key)}`);
    lines.push('');
  }

  lines.push(theme.div);
  lines.push('');
  lines.push(` 💡 ${theme.bold('Tips:')} ketik .menu <kategori> untuk lihat perintah`);
  lines.push(` 📋 Semua perintah → ketik ${theme.bold('.allmenu')}`);
  lines.push('');
  lines.push(theme.footer);
  return lines.join('\n');
}

module.exports = {
  commands:    ['menu', 'm'],
  category:    'Main',
  description: 'Menu utama bot dengan navigasi kategori',
  usage:       '.menu  |  .menu <kategori>  (contoh: .menu fun)',

  async handler(sock, m, { args, pushName, isOwner, reply }) {

    // ── .menu <kategori> → tampilkan perintah kategori tersebut ─
    if (args[0]) {
      const catKey = resolveCategory(args[0]);
      if (!catKey) {
        const list = Object.entries(CATS)
          .map(([k, c]) => `  ${c.emoji} .menu ${k}`)
          .join('\n');
        return reply(
          `❌ Kategori *${args[0]}* tidak ditemukan.\n\nKategori tersedia:\n${list}`
        );
      }

      const plugins = getPluginsForCategory(catKey);
      const text    = renderCategoryText(catKey, plugins);

      // Kirim dengan thumbnail dari URL (replyImage fallback ke teks jika gagal)
      return replyImage(sock, m, settings.images.thumb, text);
    }

    // ── .menu (tanpa args) → listMessage + thumbnail ──────────
    const menuText = renderMainMenuText(pushName, isOwner);

    const rows = Object.entries(CATS).map(([key, cat]) => {
      const pluginCount = getPluginsForCategory(key).length;
      return {
        id:          `.menu ${key}`,
        title:       `${cat.emoji}  ${key.toUpperCase()}`,
        description: `${cat.desc}  (${pluginCount} plugin)`,
      };
    });

    const sections = [{
      title: '📁  PILIH KATEGORI',
      rows,
    }];

    return replyList(
      sock, m,
      settings.theme.bold('KEVSOFT BOT INTERFACE'),  // title
      menuText,                                        // body
      '📂  Buka Kategori',                             // button text
      sections,
      settings.footer,
      settings.images.menu,                            // thumbnail URL
    );
  },
};
