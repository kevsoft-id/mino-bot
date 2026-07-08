'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
const settings = require('../../../settings');
const store    = require('../../../lib/store');
const { replyImage } = require('../../../lib/utils');

module.exports = {
  commands:    ['couple', 'pasang', 'jodohku'],
  category:    'Fun',
  description: 'Pasang / lihat / hapus couple di grup 💑',
  usage:       '.couple @user  |  .couple cek  |  .couple hapus',
  groupOnly:   true,

  async handler(sock, m, { args, text, mentions, sender, jid, reply }) {
    const { theme } = settings;
    const ns   = 'couple';
    const key  = `${jid}_${sender}`;

    // .couple hapus / reset
    if (['hapus', 'putus', 'reset', 'delete'].includes(args[0]?.toLowerCase())) {
      const partner = store.get(ns, key);
      if (!partner) return reply('💔 Kamu belum punya couple.');
      const partnerKey = `${jid}_${partner}`;
      store.del(ns, key);
      store.del(ns, partnerKey);
      return reply(`💔 Couple dengan @${partner.split('@')[0]} telah diputus.`);
    }

    // .couple cek
    if (['cek', 'info', 'lihat'].includes(args[0]?.toLowerCase()) || !mentions[0]) {
      const partner = store.get(ns, key);
      if (!partner) {
        return reply(`💔 Kamu belum punya couple.\n\nPakai: .couple @user untuk pasang couple.`);
      }
      return replyImage(sock, m, settings.images.thumb, [
        theme.header, '',
        ` ⬡  💑  ${theme.bold('COUPLE INFO')}`, '',
        `  👤 @${sender.split('@')[0]}`,
        `  💕 pasangan dengan`,
        `  👤 @${partner.split('@')[0]}`,
        '', theme.footer,
      ].join('\n'));
    }

    // .couple @user — pasang couple
    const target = mentions[0];
    if (!target) return reply('❓ Tag user yang ingin dijadikan couple.\nContoh: .couple @user');
    if (target === sender) return reply('😅 Tidak bisa couple dengan diri sendiri.');

    const myPartner     = store.get(ns, key);
    const theirPartnerK = `${jid}_${target}`;
    const theirPartner  = store.get(ns, theirPartnerK);

    if (myPartner) return reply(`💔 Kamu sudah punya couple dengan @${myPartner.split('@')[0]}.\nHapus dulu: .couple hapus`);
    if (theirPartner) return reply(`💔 @${target.split('@')[0]} sudah punya couple dengan orang lain.`);

    store.set(ns, key, target);
    store.set(ns, theirPartnerK, sender);

    return replyImage(sock, m, settings.images.thumb, [
      theme.header, '',
      ` ⬡  💑  ${theme.bold('COUPLE BARU!')}`, '',
      `  👤 @${sender.split('@')[0]}`,
      `  💕  +  `,
      `  👤 @${target.split('@')[0]}`,
      '',
      `  🎊 Selamat, kalian resmi couple!`,
      '', theme.footer,
    ].join('\n'));
  },
};
