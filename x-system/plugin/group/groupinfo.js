'use strict';
const settings = require('../../../set/settings');

module.exports = {
  commands:  ['groupinfo', 'gc', 'ginfo', 'infogroup'],
  category:  'Group',
  description: 'Tampilkan informasi lengkap grup~',
  usage:     '.groupinfo',
  groupOnly: true,

  async handler(sock, m, { groupMetadata, reply }) {
    const g       = groupMetadata;
    const admins  = g.participants.filter(p => p.admin).length;
    const members = g.participants.length;
    const created = new Date(g.creation * 1000).toLocaleString('id-ID', { timeZone: settings.timezone });
    const desc    = g.desc ? String(g.desc).slice(0, 200) : '(tidak ada deskripsi)';

    await reply([
      `👥 *INFO GRUP* nya~`,
      ``,
      `📛 *Nama    :* ${g.subject}`,
      `🆔 *ID      :* ${g.id}`,
      `📅 *Dibuat  :* ${created}`,
      `👑 *Pembuat :* @${(g.owner || '').split('@')[0]}`,
      ``,
      `━━━━━━━━━━━━━━━`,
      `👤 *Member  :* ${members}`,
      `👮 *Admin   :* ${admins}`,
      `📎 *Link    :* (gunakan .link)`,
      ``,
      `━━━━━━━━━━━━━━━`,
      `📝 *Deskripsi:*`,
      desc,
      ``,
      settings.footer,
    ].join('\n'));
  },
};
