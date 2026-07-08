/*
  ===========================================================
  [ WATERMARK & LICENSE NOTICE ]
  ===========================================================
  🤖 BOT NAME : KEVSOFT BOT
  👤 DEVELOPER: KEVIN (KevSoft-ID)
  🌐 GITHUB   : https://github.com/kevsoft-id/mino-bot
  ===========================================================

  ⚠️ KETENTUAN PENGGUNAAN (TERMS OF SERVICE):
  1. [DILARANG] Menghapus atau mengubah kredit & lisensi asli.
  2. [DILARANG] Menghapus watermark developer.
  3. [DILARANG] Memperjualbelikan (mengkomersilkan) script bot ini.
  🔄 [DIPERBOLEHKAN] Mengubah nama bot sesuai keinginan.

  Created by Kevin © 2026. All rights reserved.
  ===========================================================
*/

'use strict';

// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

require('./lib/license').verifyIntegrity();

const chalk               = require('chalk');
const { createConnection }  = require('./lib/connection');
const { handleMessage }     = require('./lib/handler');
const { loadPlugins, watchPlugins } = require('./lib/loader');
const settings              = require('./settings');

global.plugins   = new Map();
global.startTime = Date.now();
global.db        = {};  // In-memory DB untuk group settings (antilink, welcome, dll)

/* ── Banner ASCII KEVSOFT style ─────────────────────────────*/
function printBanner() {
  const v = settings.botVersion;
  console.log(chalk.cyan(`
  ██╗  ██╗███████╗██╗   ██╗███████╗ ██████╗ ███████╗████████╗
  ██║ ██╔╝██╔════╝██║   ██║██╔════╝██╔═══██╗██╔════╝╚══██╔══╝
  █████╔╝ █████╗  ██║   ██║███████╗██║   ██║█████╗     ██║
  ██╔═██╗ ██╔══╝  ╚██╗ ██╔╝╚════██║██║   ██║██╔══╝     ██║
  ██║  ██╗███████╗ ╚████╔╝ ███████║╚██████╔╝██║        ██║
  ╚═╝  ╚═╝╚══════╝  ╚═══╝  ╚══════╝ ╚═════╝ ╚═╝        ╚═╝`));
  console.log(chalk.white(`
  ──────────────────────────────────────────────────────────────
   ${chalk.bold('KEVSOFT BOT')} v${v}  •  Logic Driven, High Performance.
   by Kevin (KevSoft-ID)  •  ${settings.webUrl}  •  ${settings.botTag}
  ──────────────────────────────────────────────────────────────
`));
}

function attachHandlers(sock) {
  sock.ev.removeAllListeners('messages.upsert');
  sock.ev.on('messages.upsert', async (upsert) => {
    try {
      await handleMessage(sock, upsert, global.plugins);
    } catch (err) {
      console.error(chalk.red('[Main] Unhandled error:'), err.message);
    }
  });
  console.log(chalk.green('[Main] ✓ Event handler terpasang'));
}

async function main() {
  printBanner();

  // 1. Load semua plugin
  console.log(chalk.blue('[Main] Memuat plugin...'));
  await loadPlugins(global.plugins);
  console.log(chalk.green(`[Main] ✓ ${global.plugins.size} perintah siap\n`));

  // 2. Aktifkan auto-watcher (plugin baru = auto-load, tanpa restart)
  watchPlugins(global.plugins);

  // 3. Koneksi WhatsApp
  await createConnection((sock) => {
    attachHandlers(sock);
    global.sock = sock;
  });
}

process.on('uncaughtException',  (err) => console.error(chalk.red('[!] uncaughtException:'), err.message));
process.on('unhandledRejection', (r)   => console.error(chalk.red('[!] unhandledRejection:'), String(r)));

// Flush persistent store before exit so no pending writes are lost
const _storeFlush = () => { try { require('./lib/store').flush(); } catch {} };
process.on('SIGTERM', () => { _storeFlush(); process.exit(0); });
process.on('SIGINT',  () => { _storeFlush(); process.exit(0); });
process.on('exit',    _storeFlush);

main().catch((err) => {
  console.error(chalk.red('[Main] Fatal:'), err);
  process.exit(1);
});
