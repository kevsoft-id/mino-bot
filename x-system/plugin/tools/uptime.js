'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../settings');
const { formatDuration } = require('../../../lib/utils');
const os = require('os');

module.exports = {
  commands:    ['uptime', 'ping', 'memory', 'serverinfo', 'sysinfo', 'status'],
  category:    'Tools',
  description: 'Info status bot, uptime, memory, dan server',
  usage:       '.uptime  |  .ping  |  .memory  |  .serverinfo',

  async handler(sock, m, { command, reply, react }) {
    const { theme } = settings;
    const start = Date.now();

    await react('📊');

    const uptime  = formatDuration(process.uptime() * 1000);
    const mem     = process.memoryUsage();
    const heapMB  = (mem.heapUsed  / 1024 / 1024).toFixed(1);
    const totalMB = (mem.heapTotal / 1024 / 1024).toFixed(1);
    const rssMB   = (mem.rss       / 1024 / 1024).toFixed(1);
    const cpuLoad = os.loadavg();
    const freeMem = (os.freemem()  / 1024 / 1024 / 1024).toFixed(2);
    const totMem  = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);

    const latency = Date.now() - start;

    if (command === 'ping') {
      await react('🏓');
      return reply([
        `🏓 *PONG!*`,
        ``,
        `⚡ Latency : *${latency}ms*`,
        `⏱️ Uptime  : ${uptime}`,
        `💾 Memory  : ${heapMB} MB`,
        `📌 Plugin  : ${global.plugins?.size || 0}`,
        ``,
        settings.footer,
      ].join('\n'));
    }

    if (command === 'memory') {
      return reply([
        theme.header, '',
        ` ⬡  💾  ${theme.bold('MEMORY USAGE')}`, '',
        `    📊 Heap Used    : ${heapMB} MB`,
        `    📊 Heap Total   : ${totalMB} MB`,
        `    📊 RSS          : ${rssMB} MB`,
        `    💻 System Free  : ${freeMem} GB`,
        `    💻 System Total : ${totMem} GB`,
        '',
        theme.footer,
      ].join('\n'));
    }

    // .uptime / .serverinfo / .sysinfo / .status
    const nodeVer  = process.version;
    const platform = `${os.type()} ${os.arch()}`;
    const cpuModel = os.cpus()?.[0]?.model?.slice(0, 40) || '-';

    await reply([
      theme.header, '',
      ` ⬡  📊  ${theme.bold('BOT STATUS')}`, '',
      `    ${theme.bullet} Bot Name   : ${settings.botName} v${settings.botVersion}`,
      `    ${theme.bullet} Status     : 🟢 Online`,
      `    ${theme.bullet} Uptime     : ${uptime}`,
      `    ${theme.bullet} Latency    : ${latency}ms`,
      `    ${theme.bullet} Plugin     : ${global.plugins?.size || 0} aktif`,
      '',
      ` ⬡  💻  ${theme.bold('SERVER INFO')}`, '',
      `    ${theme.bullet} Platform   : ${platform}`,
      `    ${theme.bullet} CPU        : ${cpuModel}`,
      `    ${theme.bullet} CPU Load   : ${cpuLoad[0].toFixed(2)} (1m avg)`,
      `    ${theme.bullet} Memory     : ${heapMB}/${totalMB} MB`,
      `    ${theme.bullet} Sys RAM    : ${freeMem}/${totMem} GB`,
      `    ${theme.bullet} Node.js    : ${nodeVer}`,
      '',
      theme.footer,
    ].join('\n'));
  },
};
