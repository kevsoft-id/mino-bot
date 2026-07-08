'use strict';

// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../settings');
const { replyImage } = require('../../../lib/utils');

// ── Urutan tampilan kategori yang diinginkan ──────────────────
const CAT_ORDER = ['Main', 'Fun', 'Tools', 'Downloader', 'Group', 'Owner', 'Extra'];
const CAT_EMOJI = {
  main:       '⚙️',
  fun:        '🎮',
  tools:      '🧰',
  downloader: '📥',
  group:      '👥',
  owner:      '👑',
  extra:      '🔌',
};

function getCatEmoji(cat) {
  return CAT_EMOJI[cat.toLowerCase()] || '📦';
}

// ── Build map: category → plugin list (deduped by filePath) ──
function buildCategoryMap() {
  const map = new Map();
  for (const [, p] of global.plugins) {
    const cat = (p.category || 'Extra');
    const key = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
    if (!map.has(key)) map.set(key, new Map());
    map.get(key).set(p.filePath, p);
  }
  const result = new Map();
  for (const [cat, inner] of map) {
    result.set(cat, [...inner.values()]);
  }
  return result;
}

// ── Sort kategori sesuai urutan ───────────────────────────────
function sortedCategories(catMap) {
  const ordered = [];
  for (const o of CAT_ORDER) {
    if (catMap.has(o)) ordered.push([o, catMap.get(o)]);
  }
  for (const [k, v] of catMap) {
    if (!CAT_ORDER.includes(k)) ordered.push([k, v]);
  }
  return ordered;
}

module.exports = {
  commands:    ['allmenu', 'allcmd', 'semua', 'listcmd'],
  category:    'Main',
  description: 'Tampilkan SEMUA perintah bot berdasarkan kategori',
  usage:       '.allmenu',

  async handler(sock, m, { reply: replyFn }) {
    const { theme } = settings;
    const catMap    = buildCategoryMap();
    const sorted    = sortedCategories(catMap);

    const totalPlugin  = [...catMap.values()].reduce((a, v) => a + v.length, 0);
    const totalCommand = global.plugins.size;

    const lines = [
      theme.header,
      '',
      ` 📊 ${theme.bold('Total')} : ${totalPlugin} plugin  •  ${totalCommand} perintah`,
      ` 🔑 ${theme.bold('Prefix')} : ${settings.prefix}`,
      '',
      theme.div,
    ];

    for (const [cat, plugins] of sorted) {
      const emoji = getCatEmoji(cat);
      lines.push('');
      lines.push(` ⬡  ${emoji}  ${theme.bold(cat.toUpperCase())}`);
      lines.push('');

      const sorted2 = [...plugins].sort((a, b) =>
        (a.commands[0] || '').localeCompare(b.commands[0] || '')
      );

      for (const p of sorted2) {
        const cmdPad = `.${p.commands[0]}`.padEnd(14);
        const desc   = (p.description || '-').slice(0, 60);
        const tag    = p.ownerOnly ? ' 👑' : p.adminOnly ? ' 👮' : p.groupOnly ? ' 👥' : '';
        const aliases = p.commands.length > 1
          ? ` (${p.commands.slice(1).map(c => '.' + c).join(', ')})`
          : '';
        lines.push(`${theme.indent}${theme.bullet} ${cmdPad} - ${desc}${tag}`);
        if (aliases) {
          lines.push(`${theme.indent}  ↳ alias: ${aliases}`);
        }
      }

      lines.push('');
      lines.push(theme.div);
    }

    lines.push('');
    lines.push(` 💡 ${theme.bold('Tips:')} .menu <kategori>  untuk navigasi cepat`);
    lines.push(` 💡 ${theme.bold('Help:')} .help <perintah>  untuk detail perintah`);
    lines.push('');
    lines.push(theme.footer);

    const text = lines.join('\n');

    // Kirim dengan thumbnail dari URL (fallback ke teks jika gagal)
    return replyImage(sock, m, settings.images.thumb, text);
  },
};
