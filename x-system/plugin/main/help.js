'use strict';

// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../set/settings');

module.exports = {
  commands: ['help', 'h', 'bantuan'],
  category: 'Main',
  description: 'Detail informasi sebuah perintah',
  usage: '.help <perintah>',

  async handler(sock, m, { args, reply }) {
    const { theme } = settings;
    const cmd = args[0]?.toLowerCase().replace(/^\./, '');

    if (!cmd) {
      return reply([
        theme.header,
        '',
        ` ⬡  💡  ${theme.bold('HELP')}`,
        '',
        `    ${theme.bullet} ${theme.bold('Usage')}  : .help <perintah>`,
        `    ${theme.bullet} ${theme.bold('Contoh')} : .help ping`,
        '',
        `    ${theme.bullet} Ketik ${theme.bold('.menu')} untuk navigasi kategori`,
        `    ${theme.bullet} Ketik ${theme.bold('.allmenu')} untuk semua perintah`,
        '',
        theme.footer,
      ].join('\n'));
    }

    const plugin = global.plugins?.get(cmd);
    if (!plugin) {
      return reply(`❌ Perintah \`${settings.prefix}${cmd}\` tidak ditemukan.\nKetik ${theme.bold('.allmenu')} untuk daftar lengkap.`);
    }

    const tags = [
      plugin.ownerOnly  ? '👑 Owner Only' : null,
      plugin.groupOnly  ? '👥 Grup Only'  : null,
      plugin.privateOnly? '💬 PM Only'    : null,
      plugin.adminOnly  ? '👮 Admin Only' : null,
      plugin.botAdmin   ? '🤖 Bot Admin'  : null,
    ].filter(Boolean);

    await reply([
      theme.header,
      '',
      ` ⬡  💡  ${theme.bold('COMMAND INFO')}`,
      '',
      `    ${theme.bullet} ${theme.bold('Perintah')}  : ${settings.prefix}${cmd}`,
      `    ${theme.bullet} ${theme.bold('Alias')}     : ${plugin.commands.map(c => settings.prefix + c).join(', ')}`,
      `    ${theme.bullet} ${theme.bold('Kategori')}  : ${plugin.category || '-'}`,
      `    ${theme.bullet} ${theme.bold('Deskripsi')} : ${plugin.description || '-'}`,
      `    ${theme.bullet} ${theme.bold('Penggunaan')}: ${plugin.usage || settings.prefix + cmd}`,
      tags.length ? `    ${theme.bullet} ${theme.bold('Akses')}     : ${tags.join(' • ')}` : '',
      '',
      theme.footer,
    ].filter(l => l !== '').join('\n'));
  },
};
