'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../settings');

// Message counter per group (in-memory)
const msgCounter = {};
global._groupMsgCount = function(jid, sender) {
  if (!msgCounter[jid]) msgCounter[jid] = {};
  msgCounter[jid][sender] = (msgCounter[jid][sender] || 0) + 1;
};

module.exports = {
  commands:    ['groupstats', 'gstats', 'statsgrup', 'topactive', 'aktivmember'],
  category:    'Group',
  description: 'Statistik grup dan member paling aktif',
  usage:       '.groupstats',
  groupOnly:   true,

  async handler(sock, m, { jid, groupMetadata, reply, react }) {
    const { theme } = settings;
    await react('📊');

    try {
      const meta    = groupMetadata || await sock.groupMetadata(jid);
      const total   = meta.participants.length;
      const admins  = meta.participants.filter(p => p.admin).length;
      const members = total - admins;

      // Top active from counter
      const counter = msgCounter[jid] || {};
      const ranked  = Object.entries(counter)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      const topList = ranked.length
        ? ranked.map(([id, cnt], i) => `    ${i + 1}. @${id.split('@')[0]} — ${cnt} pesan`).join('\n')
        : '    _(Belum ada data, mulai setelah bot aktif)_';

      const createdAt = meta.creation
        ? new Date(meta.creation * 1000).toLocaleDateString('id-ID')
        : '-';

      await react('✅');
      await reply([
        theme.header, '',
        ` ⬡  📊  ${theme.bold('STATISTIK GRUP')}`, '',
        `    ${theme.bullet} Nama      : ${meta.subject}`,
        `    ${theme.bullet} Total     : ${total} member`,
        `    ${theme.bullet} Admin     : ${admins} orang`,
        `    ${theme.bullet} Member    : ${members} orang`,
        `    ${theme.bullet} Dibuat    : ${createdAt}`,
        `    ${theme.bullet} Deskripsi : ${meta.desc?.slice(0, 60) || '-'}`,
        '',
        ` ⬡  🏆  ${theme.bold('TOP 5 AKTIF (sesi ini)')}`,
        '',
        topList,
        '',
        theme.footer,
      ].join('\n'));
    } catch (err) {
      await react('❌');
      await reply(`❌ Gagal ambil statistik: ${err.message}`);
    }
  },
};
