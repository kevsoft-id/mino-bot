'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../settings');
const store    = require('../../../lib/store');
const { replyList } = require('../../../lib/utils');

if (!global.botMode) global.botMode = store.get('config', 'mode') || 'public';

const MODES = {
  public:  { emoji: '🌐', label: 'Public Mode',  desc: 'Semua orang bisa pakai bot' },
  group:   { emoji: '👥', label: 'Group Only',   desc: 'Bot hanya aktif di grup' },
  private: { emoji: '🔒', label: 'Private Only', desc: 'Bot hanya aktif di PM' },
  owner:   { emoji: '👑', label: 'Owner Only',   desc: 'Hanya owner yang bisa pakai' },
};

module.exports = {
  commands:    ['mode', 'botmode'],
  category:    'Owner',
  description: 'Atur mode bot: public / group / private / owner ⚙️',
  usage:       '.mode  |  .mode public  |  .mode group',
  ownerOnly:   true,

  async handler(sock, m, { args, prefix, reply }) {
    const { theme } = settings;
    const modeArg = args[0]?.toLowerCase();

    if (modeArg && MODES[modeArg]) {
      global.botMode = modeArg;
      store.set('config', 'mode', modeArg);
      const info = MODES[modeArg];
      return reply([
        theme.header, '',
        ` ✅  ${theme.bold('BOT MODE DIUBAH')}`, '',
        `  ${info.emoji} Mode baru : *${info.label}*`,
        `  📝 Deskripsi: ${info.desc}`,
        '', theme.footer,
      ].join('\n'));
    }

    const rows = Object.entries(MODES).map(([key, info]) => ({
      id:          `${prefix}mode ${key}`,
      title:       `${info.emoji}  ${info.label}`,
      description: info.desc + (global.botMode === key ? ' ← AKTIF' : ''),
    }));

    return replyList(
      sock, m,
      theme.bold('BOT MODE SELECTOR'),
      [
        theme.header, '',
        ` ⬡  ⚙️  ${theme.bold('BOT MODE')}`, '',
        `  Mode saat ini: ${MODES[global.botMode]?.emoji} *${MODES[global.botMode]?.label || global.botMode}*`,
        '', theme.footer,
      ].join('\n'),
      '⚙️  Pilih Mode',
      [{ title: '🔧 PILIH MODE BOT', rows }],
      settings.footer,
      settings.images.thumb,
    );
  },
};
