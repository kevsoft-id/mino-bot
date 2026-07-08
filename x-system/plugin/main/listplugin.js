'use strict';

// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../settings');

module.exports = {
  commands:  ['listplugin', 'plugins', 'pluginlist'],
  category:  'Main',
  description: 'Daftar semua plugin yang aktif, dikelompokkan per kategori',
  usage:     '.listplugin',
  ownerOnly: true,

  async handler(sock, m, { reply }) {
    const { theme } = settings;

    // Kelompokkan per kategori, dedup per filePath
    const catMap = new Map();
    for (const [, p] of global.plugins) {
      const cat = p.category || 'Extra';
      if (!catMap.has(cat)) catMap.set(cat, new Map());
      catMap.get(cat).set(p.filePath, p);
    }

    const totalPlugin  = [...catMap.values()].reduce((a, v) => a + v.size, 0);
    const totalCommand = global.plugins.size;

    const lines = [
      theme.header,
      '',
      ` ⬡  🔌  ${theme.bold('ACTIVE PLUGINS')}`,
      '',
      `    ${theme.bullet} ${theme.bullet} ${totalPlugin} file  •  ${totalCommand} perintah`,
      '',
      theme.div,
    ];

    for (const [cat, inner] of [...catMap.entries()].sort()) {
      lines.push('');
      lines.push(`    📂 ${theme.bold(cat.toUpperCase())}  (${inner.size})`);
      for (const p of inner.values()) {
        const cmds = p.commands.map(c => settings.prefix + c).join(', ');
        lines.push(`    ${theme.bullet} ${cmds}`);
      }
    }

    lines.push('');
    lines.push(theme.div);
    lines.push('');
    lines.push(` 💡 Drop file .js ke x-system/plugin/<kategori>/ → auto-load!`);
    lines.push('');
    lines.push(theme.footer);

    await reply(lines.join('\n'));
  },
};
