'use strict';

// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../set/settings');

module.exports = {
  commands:  ['restart', 'reboot', 'reload'],
  category:  'Owner',
  description: 'Restart bot atau reload semua plugin',
  usage:     '.restart | .reload',
  ownerOnly: true,

  async handler(sock, m, { command, reply, react }) {
    const { theme } = settings;

    if (command === 'reload') {
      await react('🔄');
      await reply([
        theme.header,
        '',
        ` ⬡  🔄  ${theme.bold('RELOADING PLUGINS...')}`,
        '',
        theme.footer,
      ].join('\n'));

      const { loadPlugins } = require('../../../lib/loader');
      global.plugins.clear();
      await loadPlugins(global.plugins);

      await react('✅');
      return reply([
        theme.header,
        '',
        ` ⬡  ✅  ${theme.bold('RELOAD COMPLETE')}`,
        '',
        `    ${theme.bullet} ${global.plugins.size} perintah dimuat ulang`,
        '',
        theme.footer,
      ].join('\n'));
    }

    await react('🔁');
    await reply([
      theme.header,
      '',
      ` ⬡  🔁  ${theme.bold('RESTARTING...')}`,
      '',
      `    Bot akan restart dalam 2 detik.`,
      '',
      theme.footer,
    ].join('\n'));
    setTimeout(() => process.exit(0), 2000);
  },
};
