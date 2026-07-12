'use strict';

// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../set/settings');
const { formatDuration } = require('../../../lib/utils');
const os = require('os');

module.exports = {
  commands:    ['info', 'botinfo', 'about'],
  category:    'Main',
  description: 'Informasi lengkap tentang bot ini',
  usage:       '.info',

  async handler(sock, m, { reply }) {
    const { theme } = settings;
    const mem     = process.memoryUsage();
    const heapMB  = (mem.heapUsed / 1024 / 1024).toFixed(1);
    const rssMB   = (mem.rss      / 1024 / 1024).toFixed(1);
    const uptime  = formatDuration(Date.now() - global.startTime);
    const totalPlugins = new Set([...global.plugins.values()].map(p => p.filePath)).size;

    await reply([
      theme.header,
      '',
      ` ⬡  🤖  ${theme.bold('BOT INFORMATION')}`,
      '',
      `    ${theme.bullet} ${theme.bold('Name')}     : ${settings.botName} v${settings.botVersion}`,
      `    ${theme.bullet} ${theme.bold('Tagline')}  : ${settings.botDesc}`,
      `    ${theme.bullet} ${theme.bold('Developer')}: Kevin (KevSoft-ID)`,
      `    ${theme.bullet} ${theme.bold('Web')}      : ${settings.webUrl}`,
      '',
      theme.div,
      '',
      ` ⬡  ⚙️  ${theme.bold('RUNTIME')}`,
      '',
      `    ${theme.bullet} ${theme.bold('Uptime')}   : ${uptime}`,
      `    ${theme.bullet} ${theme.bold('Node.js')}  : ${process.version}`,
      `    ${theme.bullet} ${theme.bold('Platform')} : ${os.platform()} / ${os.arch()}`,
      `    ${theme.bullet} ${theme.bold('Plugin')}   : ${totalPlugins} file  •  ${global.plugins.size} perintah`,
      `    ${theme.bullet} ${theme.bold('Heap')}     : ${heapMB} MB  •  RSS: ${rssMB} MB`,
      '',
      theme.div,
      '',
      ` ⬡  📋  ${theme.bold('COMMANDS')}`,
      '',
      `    ${theme.bullet} ${theme.bold('.menu')}      — navigasi kategori`,
      `    ${theme.bullet} ${theme.bold('.allmenu')}   — semua perintah`,
      `    ${theme.bullet} ${theme.bold('.help <cmd>')}— detail perintah`,
      '',
      theme.footer,
    ].join('\n'));
  },
};
