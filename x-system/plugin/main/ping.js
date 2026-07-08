'use strict';

// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../settings');

module.exports = {
  commands:    ['ping', 'latency', 'speed'],
  category:    'Main',
  description: 'Cek latensi & status server bot',
  usage:       '.ping',

  async handler(sock, m, { reply, react }) {
    const { theme } = settings;
    const start = Date.now();

    await react('📡');
    await sock.sendMessage(m.key.remoteJid, { text: '...' }, { quoted: m });

    const ms      = Date.now() - start;
    const quality =
      ms < 300  ? `🟢 EXCELLENT (${ms}ms)` :
      ms < 700  ? `🟡 GOOD (${ms}ms)` :
      ms < 1500 ? `🟠 FAIR (${ms}ms)` :
                  `🔴 SLOW (${ms}ms)`;

    await react('✅');
    await reply([
      theme.header,
      '',
      ` ⬡  📡  ${theme.bold('SERVER LATENCY')}`,
      '',
      `    ${theme.bullet} ${theme.bold('Ping')}    : ${quality}`,
      `    ${theme.bullet} ${theme.bold('Uptime')}  : ${require('../../../lib/utils').formatDuration(Date.now() - global.startTime)}`,
      `    ${theme.bullet} ${theme.bold('Plugin')}  : ${global.plugins.size} perintah aktif`,
      `    ${theme.bullet} ${theme.bold('Node.js')} : ${process.version}`,
      '',
      theme.footer,
    ].join('\n'));
  },
};
