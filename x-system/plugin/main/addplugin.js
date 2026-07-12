'use strict';

// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../set/settings');
const axios    = require('axios');
const path     = require('path');
const fs       = require('fs-extra');
const { loadSinglePlugin } = require('../../../lib/loader');

const PLUGIN_DIR = path.join(__dirname, '..', '..', '..', 'x-system', 'plugin', 'extra');

module.exports = {
  commands:  ['addplugin', 'instalplugin', 'plug'],
  category:  'Main',
  description: 'Install plugin dari URL (auto-load tanpa restart)',
  usage:     '.addplugin <url>',
  ownerOnly: true,

  async handler(sock, m, { args, reply, react }) {
    const { theme } = settings;
    const url = args[0];
    if (!url || !url.startsWith('http')) {
      return reply([
        theme.header,
        '',
        ` ⬡  🔌  ${theme.bold('ADD PLUGIN')}`,
        '',
        `    ${theme.bullet} ${theme.bold('Usage')}  : .addplugin <url>`,
        `    ${theme.bullet} ${theme.bold('Format')} : URL ke file .js`,
        '',
        `    Atau cukup copy file .js ke folder:`,
        `    \`x-system/plugin/extra/\``,
        `    → bot akan auto-load tanpa perintah apapun!`,
        '',
        theme.footer,
      ].join('\n'));
    }

    await react('⏳');

    const filename = path.basename(new URL(url).pathname);
    if (!filename.endsWith('.js')) return reply('❌ URL harus mengarah ke file .js');

    const savePath = path.join(PLUGIN_DIR, filename);

    try {
      await fs.ensureDir(PLUGIN_DIR);
      const { data } = await axios.get(url, { timeout: 15000, responseType: 'text' });

      // Cek minimal ada handler
      if (typeof data !== 'string' || !data.includes('handler')) {
        return reply('❌ File tidak tampak seperti plugin yang valid (tidak ada `handler`).');
      }

      await fs.writeFile(savePath, data, 'utf8');

      // Load langsung (watcher juga akan trigger, tapi ini lebih cepat)
      const ok = await loadSinglePlugin(global.plugins, savePath);
      if (!ok) {
        await fs.remove(savePath);
        return reply('❌ Plugin gagal dimuat — cek format plugin (harus ada commands[] dan handler()).');
      }

      await react('✅');
      await reply([
        theme.header,
        '',
        ` ⬡  ✅  ${theme.bold('PLUGIN INSTALLED')}`,
        '',
        `    ${theme.bullet} ${theme.bold('File')}   : ${filename}`,
        `    ${theme.bullet} ${theme.bold('URL')}    : ${url.slice(0, 60)}`,
        `    ${theme.bullet} ${theme.bold('Status')} : Aktif & siap digunakan`,
        `    ${theme.bullet} ${theme.bold('Total')}  : ${global.plugins.size} perintah aktif`,
        '',
        theme.footer,
      ].join('\n'));
    } catch (err) {
      await react('❌');
      await reply(`❌ Gagal install plugin: ${err.message}`);
    }
  },
};
