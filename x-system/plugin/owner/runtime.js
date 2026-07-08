'use strict';

// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../settings');
const { formatDuration } = require('../../../lib/utils');
const os = require('os');

module.exports = {
  commands:  ['runtime', 'uptime', 'status'],
  category:  'Owner',
  description: 'Status lengkap mesin & uptime bot',
  usage:     '.runtime',
  ownerOnly: true,

  async handler(sock, m, { reply }) {
    const { theme } = settings;
    const uptime   = formatDuration(Date.now() - global.startTime);
    const mem      = process.memoryUsage();
    const heapMB   = (mem.heapUsed  / 1024 / 1024).toFixed(2);
    const rssMB    = (mem.rss       / 1024 / 1024).toFixed(2);
    const extMB    = (mem.external  / 1024 / 1024).toFixed(2);
    const cpus     = os.cpus();
    const cpuModel = cpus[0]?.model?.trim() || 'Unknown';
    const cpuCount = cpus.length;
    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const freeMem  = (os.freemem()  / 1024 / 1024 / 1024).toFixed(2);
    const totalPlugins = new Set([...global.plugins.values()].map(p => p.filePath)).size;

    await reply([
      theme.header,
      '',
      ` ⬡  🤖  ${theme.bold('BOT STATUS')}`,
      '',
      `    ${theme.bullet} ${theme.bold('Bot')}     : ${settings.botName} v${settings.botVersion}`,
      `    ${theme.bullet} ${theme.bold('Uptime')}  : ${uptime}`,
      `    ${theme.bullet} ${theme.bold('Plugin')}  : ${totalPlugins} file  •  ${global.plugins.size} cmd`,
      '',
      theme.div,
      '',
      ` ⬡  💻  ${theme.bold('SYSTEM')}`,
      '',
      `    ${theme.bullet} ${theme.bold('Platform')} : ${os.platform()} / ${os.arch()}`,
      `    ${theme.bullet} ${theme.bold('Host')}     : ${os.hostname()}`,
      `    ${theme.bullet} ${theme.bold('Node.js')}  : ${process.version}`,
      `    ${theme.bullet} ${theme.bold('CPU')}      : ${cpuModel} (${cpuCount} core)`,
      '',
      theme.div,
      '',
      ` ⬡  🧠  ${theme.bold('MEMORY')}`,
      '',
      `    ${theme.bullet} ${theme.bold('Heap')}     : ${heapMB} MB`,
      `    ${theme.bullet} ${theme.bold('RSS')}      : ${rssMB} MB`,
      `    ${theme.bullet} ${theme.bold('External')} : ${extMB} MB`,
      `    ${theme.bullet} ${theme.bold('RAM')}      : ${freeMem} GB free / ${totalMem} GB total`,
      '',
      theme.footer,
    ].join('\n'));
  },
};
