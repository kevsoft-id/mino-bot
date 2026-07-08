'use strict';
const settings = require('../../../settings');

module.exports = {
  commands:  ['add', 'tambah', 'addmember'],
  category:  'Group',
  description: 'Tambahkan member baru ke grup~',
  usage:     '.add <nomor> (contoh: .add 628xxx)',
  groupOnly: true,
  adminOnly: true,
  botAdmin:  true,

  async handler(sock, m, { args, reply, react }) {
    if (!args[0]) return reply('❓ Masukkan nomor HP yang mau ditambahkan nya~\nContoh: `.add 628123456789`');

    let number = args[0].replace(/[^0-9]/g, '');
    if (number.startsWith('0')) number = '62' + number.slice(1);
    const jid = number + '@s.whatsapp.net';

    try {
      await react('⏳');
      const result = await sock.groupParticipantsUpdate(m.key.remoteJid, [jid], 'add');
      const status = result[0]?.status;

      if (status === '200' || status === 200) {
        await react('✅');
        await reply(`✅ *@${number} berhasil ditambahkan ke grup!*\n\n🐾 Selamat datang nya~ UwU\n\n${settings.footer}`);
      } else if (status === '403') {
        await reply(`❌ Nomor ${number} tidak bisa ditambahkan~\nMungkin privasi kontaknya dibatasi UwU`);
      } else {
        await reply(`❌ Gagal menambahkan nomor ${number}~\nStatus: ${status}`);
      }
    } catch {
      await react('❌');
      await reply(`❌ Gagal menambahkan nomor tersebut nya~\nPastikan nomor valid dan Mino adalah admin ya UwU`);
    }
  },
};
