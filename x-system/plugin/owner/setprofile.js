'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const axios    = require('axios');
const settings = require('../../../set/settings');
const { fetchImageBuffer } = require('../../../lib/utils');

module.exports = [
  // ── .setavatar {url} ────────────────────────────────────
  {
    commands:    ['setavatar', 'setpp', 'setfoto', 'setpfp'],
    category:    'Owner',
    description: 'Ganti foto profil bot (kirim gambar atau URL)',
    usage:       '.setavatar {url}  |  Reply gambar + .setavatar',
    ownerOnly:   true,

    async handler(sock, m, { text, reply, react }) {
      await react('⏳');

      try {
        let imgBuf = null;

        // Check quoted image
        const qMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (qMsg?.imageMessage) {
          const { downloadMediaMessage } = require('@whiskeysockets/baileys');
          const pino = require('pino');
          const fakeMsg = {
            key:     { remoteJid: m.key.remoteJid, id: m.message.extendedTextMessage.contextInfo.stanzaId },
            message: qMsg,
          };
          imgBuf = await downloadMediaMessage(fakeMsg, 'buffer', {}, {
            logger: pino({ level: 'silent' }),
            reuploadRequest: sock.updateMediaMessage,
          }).catch(() => null);
        }

        // Check image in current message
        if (!imgBuf && m.message?.imageMessage) {
          const { downloadMediaMessage } = require('@whiskeysockets/baileys');
          const pino = require('pino');
          imgBuf = await downloadMediaMessage(m, 'buffer', {}, {
            logger: pino({ level: 'silent' }),
            reuploadRequest: sock.updateMediaMessage,
          }).catch(() => null);
        }

        // Check URL
        if (!imgBuf && text) {
          imgBuf = await fetchImageBuffer(text.trim());
        }

        if (!imgBuf) return reply('❓ Kirim gambar, reply gambar, atau masukkan URL gambar');

        await sock.updateProfilePicture(sock.user.id, imgBuf);
        await react('✅');
        await reply(`✅ Foto profil bot berhasil diubah!\n\n${settings.footer}`);
      } catch (err) {
        await react('❌');
        await reply(`❌ Gagal ubah foto profil: ${err.message}`);
      }
    },
  },

  // ── .setstatus {teks} ───────────────────────────────────
  {
    commands:    ['setstatus', 'setstory', 'setbio', 'ubahstatus'],
    category:    'Owner',
    description: 'Ubah status/bio bot',
    usage:       '.setstatus <teks>',
    ownerOnly:   true,

    async handler(sock, m, { text, reply, react }) {
      if (!text) return reply('❓ Masukkan teks status\nContoh: .setstatus Siap melayani 24/7!');

      await react('⏳');
      try {
        await sock.updateProfileStatus(text);
        await react('✅');
        await reply([
          `✅ *Status bot berhasil diubah!*`,
          ``,
          `📝 Status baru:`,
          text,
          ``,
          settings.footer,
        ].join('\n'));
      } catch (err) {
        await react('❌');
        await reply(`❌ Gagal ubah status: ${err.message}`);
      }
    },
  },
];
