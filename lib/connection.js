'use strict';

// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  makeCacheableSignalKeyStore,
  Browsers,
} = require('@whiskeysockets/baileys');
const pino    = require('pino');
const chalk   = require('chalk');
const path    = require('path');
const fs      = require('fs-extra');
const settings = require('../settings');

const AUTH_DIR = path.join(__dirname, '..', 'session');

async function createConnection(onReady) {
  await fs.ensureDir(AUTH_DIR);

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const { version }          = await fetchLatestBaileysVersion();

  const logger = pino({ level: 'silent' });

  const sock = makeWASocket({
    version,
    logger,
    auth: {
      creds: state.creds,
      keys:  makeCacheableSignalKeyStore(state.keys, logger),
    },
    browser:          Browsers.ubuntu('Chrome'),
    printQRInTerminal: true,
    markOnlineOnConnect: settings.autoOnline,
    syncFullHistory:  false,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 60000,
    generateHighQualityLinkPreview: true,
  });

  // ── Save credentials ──
  sock.ev.on('creds.update', saveCreds);

  // ── Connection state ──
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log(chalk.yellow('\n[QR] Scan QR code di atas dengan WhatsApp kamu~\n'));
    }

    if (connection === 'open') {
      console.log(chalk.green(`\n[Conn] Nyambung! Bot ${settings.botName} aktif nya~`));
      console.log(chalk.cyan(`[Conn] Menggunakan WA versi: ${version.join('.')}\n`));
      if (typeof onReady === 'function') onReady(sock);
    }

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = code !== DisconnectReason.loggedOut;

      console.log(chalk.red(`[Conn] Koneksi terputus. Kode: ${code}`));

      if (shouldReconnect) {
        console.log(chalk.yellow('[Conn] Reconnecting dalam 5 detik...'));
        setTimeout(() => createConnection(onReady), 5000);
      } else {
        console.log(chalk.red('[Conn] Logged out! Hapus folder session/ dan scan ulang.'));
        process.exit(0);
      }
    }
  });

  // ── Group participants update ──
  sock.ev.on('group-participants.update', async (update) => {
    try {
      const { welcomeOnParticipantsUpdate } = require('./utils');
      await welcomeOnParticipantsUpdate(sock, update);
    } catch {}
  });

  return sock;
}

module.exports = { createConnection };
