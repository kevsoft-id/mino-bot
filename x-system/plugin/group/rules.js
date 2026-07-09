'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../settings');
const store    = require('../../../lib/store');

module.exports = {
  commands:    ['rules', 'setrules', 'delrules', 'peraturan', 'aturan'],
  category:    'Group',
  description: 'Lihat atau atur peraturan grup',
  usage:       '.rules  |  .setrules {teks}  |  .delrules',
  groupOnly:   true,

  async handler(sock, m, { args, jid, isAdmin, isOwner, command, text, reply, react }) {
    const { theme } = settings;
    const cmd = command;

    // ── Lihat rules ───────────────────────────────────────
    if (cmd === 'rules' || cmd === 'peraturan' || cmd === 'aturan') {
      const rules = store.get('grouprules', jid);
      if (!rules) {
        return reply([
          `📋 *PERATURAN GRUP*`,
          ``,
          `_(Belum ada peraturan yang ditetapkan)_`,
          ``,
          `Admin dapat menggunakan: .setrules {teks}`,
          ``,
          settings.footer,
        ].join('\n'));
      }
      return reply([
        `📋 *PERATURAN GRUP*`,
        ``,
        rules,
        ``,
        settings.footer,
      ].join('\n'));
    }

    // ── Set rules (admin only) ────────────────────────────
    if (cmd === 'setrules') {
      if (!isAdmin && !isOwner) return reply(settings.msg.adminOnly);
      if (!text) return reply('❓ Masukkan teks peraturan\nContoh:\n.setrules\n1. Tidak boleh spam\n2. Hormati sesama');

      store.set('grouprules', jid, text);
      await react('✅');
      return reply([
        `✅ *Peraturan grup berhasil diatur!*`,
        ``,
        `Ketik .rules untuk melihat peraturan`,
        ``,
        settings.footer,
      ].join('\n'));
    }

    // ── Delete rules (admin only) ──────────────────────────
    if (cmd === 'delrules') {
      if (!isAdmin && !isOwner) return reply(settings.msg.adminOnly);
      store.del('grouprules', jid);
      await react('🗑️');
      return reply(`🗑️ Peraturan grup berhasil dihapus\n\n${settings.footer}`);
    }
  },
};
