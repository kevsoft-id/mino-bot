'use strict';

// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../settings');
const path     = require('path');
const fs       = require('fs-extra');
const { unloadPlugin } = require('../../../lib/loader');

module.exports = {
  commands:  ['delplugin', 'removeplugin', 'unplug'],
  category:  'Main',
  description: 'Hapus plugin yang sudah diinstall',
  usage:     '.delplugin <nama-file>',
  ownerOnly: true,

  async handler(sock, m, { args, reply, react }) {
    const { theme } = settings;
    const name = args[0];

    if (!name) {
      // Tampilkan daftar plugin di folder extra
      const extraDir = path.join(__dirname, '..', '..', '..', 'x-system', 'plugin', 'extra');
      let files = [];
      try {
        files = (await fs.readdir(extraDir)).filter(f => f.endsWith('.js'));
      } catch {}

      return reply([
        theme.header,
        '',
        ` ⬡  🗑️  ${theme.bold('DEL PLUGIN')}`,
        '',
        `    ${theme.bullet} ${theme.bold('Usage')} : .delplugin <nama-file>`,
        '',
        files.length
          ? `    Plugin di folder extra:\n${files.map(f => `      – ${f}`).join('\n')}`
          : `    (Tidak ada plugin di folder extra)`,
        '',
        theme.footer,
      ].join('\n'));
    }

    const fname    = name.endsWith('.js') ? name : name + '.js';
    const filePath = path.join(__dirname, '..', '..', '..', 'x-system', 'plugin', 'extra', fname);

    if (!await fs.pathExists(filePath)) {
      return reply(`❌ File \`${fname}\` tidak ditemukan di folder extra.`);
    }

    await react('⏳');
    const removed = unloadPlugin(global.plugins, filePath);
    await fs.remove(filePath);
    await react('✅');

    await reply([
      theme.header,
      '',
      ` ⬡  🗑️  ${theme.bold('PLUGIN REMOVED')}`,
      '',
      `    ${theme.bullet} ${theme.bold('File')}    : ${fname}`,
      `    ${theme.bullet} ${theme.bold('Removed')} : ${removed} perintah`,
      `    ${theme.bullet} ${theme.bold('Total')}   : ${global.plugins.size} perintah tersisa`,
      '',
      theme.footer,
    ].join('\n'));
  },
};
