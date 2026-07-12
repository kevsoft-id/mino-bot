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

const license = require('./lib/license');
license.verifyIntegrity();
license.startWatch(); // re-cek berkala (default 10 menit) selama bot berjalan

const chalk               = require('chalk');
const { createConnection }  = require('./lib/connection');
const { handleMessage }     = require('./lib/handler');
const { loadPlugins, watchPlugins } = require('./lib/loader');
const settings              = require('./set/settings');

global.plugins   = new Map();
global.startTime = Date.now();
global.db        = {};  // In-memory DB untuk group settings (antilink, welcome, dll)

/* ── Banner ASCII KEVSOFT style ─────────────────────────────*/
function printBanner() {
  const v = settings.botVersion;
  console.log(chalk.cyan(`
⠀⠀⠀⠠⠀⠀⠀⠀⠀⠀⠠⠀⠠⠀⠀⠄⠀⢤⡿⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠄⠀⠠⠀⠠⠀⠀⠄⠀⠄
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⠃⠈⢃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠃⠀⠀⠀
⠀⠀⠀⢀⠀⠀⠀⠀⡀⠀⢀⠀⢀⠀⠀⣀⣾⠏⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⣀⣴⠟⠀⠀⡀⠀⠀
⠄⠀⠀⠀⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⡟⠀⡀⠀⢰⠀⠀⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠀⠀⠀⣠⣾⣿⠁⠀⠰⠀⠀⠀⠀
⠀⠀⠀⠈⠀⠀⠀⠀⠁⠀⠀⠀⠈⢀⣾⣿⠇⡔⢳⣀⣸⣀⡀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⡿⠋⠀⠀⠀⠠⠀⠀⠀⠀
⡀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⢐⣿⣿⣿⡼⠀⠀⠀⠈⢹⠃⡀⠀⢀⠀⢀⠀⠀⡀⠀⡀⣠⣶⣿⡿⠋⣀⣠⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⢿⡏⠀⠀⠀⠀⠀⠀⠙⠦⠤⠤⠤⢤⣴⣆⠀⢠⣾⣟⣿⣿⠗⠉⠰⠥⠄⣠⠀⠀⠀⠀⠀⠀
⠁⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⣸⣿⣿⣾⠇⠀⠀⠀⠀⠀⣤⠼⠃⠀⠀⠀⠀⠉⠢⡙⠻⢿⣿⡿⠃⠀⠀⠀⠀⠛⢏⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠿⠋⡿⠿⠀⠀⣠⣤⡤⠊⠁⠀⠀⠀⠀⠀⠀⠀⠀⠈⢦⡀⠙⠲⣄⠀⠀⠀⠀⠀⣈⣳⠆⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⡼⠋⠀⠀⠀⠀⠀⢀⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢳⡀⠀⠈⠳⡄⠀⠀⢿⠃⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢠⠟⠀⠀⠀⠀⠀⠀⢀⠎⠀⠀⠀⠀⠀⠀⢠⡾⠀⠀⡆⠀⠀⠀⠀⠀⣷⡀⠀⠀⠘⢦⢤⣼⡆⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢠⠏⠀⠀⠀⠀⠀⠀⠀⡜⠀⠀⠀⠀⠀⠀⢠⠏⣇⠀⠀⡄⠀⠀⠀⠀⠀⢹⢳⠀⠀⠀⠈⢧⠁⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⡞⠀⠀⠀⠀⠀⠀⢀⢾⠁⠀⠀⠀⠀⠀⣰⣇⣀⣹⡀⢰⠁⠀⠀⠀⠀⣀⣼⣨⣇⠀⠀⠀⣸⣿⣀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⡇⠀⠀⠀⠀⢀⡴⠋⠎⠀⠀⠀⠀⠀⢠⠃⠀⠀⢸⠀⢸⠀⠀⠀⠀⠀⢠⠇⠀⠸⡄⠀⠸⣿⣿⣿⡆⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⡇⠀⠀⢀⡤⠊⠀⠀⠀⠀⠀⠀⠀⢠⠇⠀⠀⠀⠀⣇⡆⠀⠀⠀⠀⢀⡎⠀⠀⠀⢳⠀⠀⠈⢿⣿⡁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠈⣇⣠⣔⣁⠤⠔⠒⠉⣷⠀⠀⠀⢠⠏⣀⣀⣀⣀⡀⢹⠇⠀⠀⠀⢀⡞⢀⣠⣤⣶⣬⣇⠀⠀⡼⢷⣷⡀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢯⠉⠁⠀⠀⠀⠀⠆⠹⡆⠀⢠⣿⣾⢿⣿⣿⣿⡿⣿⠄⠀⠀⣠⡾⠡⣿⣿⣿⡍⠙⣿⠁⢀⣿⡆⠀⠙⣄⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠸⡄⠀⠀⠀⠀⢸⠀⠀⠹⡀⣼⡏⠁⣸⣿⣿⢿⡷⡇⠀⣠⠞⢹⠃⠀⡿⡟⢿⠃⠀⡟⡆⢸⠀⠑⠢⠤⠼⠆⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣧⠀⠀⠀⠀⢸⠀⠀⠀⠳⡇⢳⠀⢻⣄⠀⢰⢣⡧⠞⠀⠀⠀⠀⠀⢿⣀⡼⠀⢰⠇⠹⢻⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢰⠛⠀⠀⠀⠀⢸⡆⠀⠀⠀⠉⠀⢧⠀⢙⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⢁⢠⣾⡀⠀⢸⠀⠀⣶⡿⣿⠀⠀⠀
⠀⠀⠀⠀⠀⢀⡎⠀⢠⠀⠀⠀⠀⡇⠀⠀⠀⠀⢲⣄⣿⡌⠦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⡀⣿⠃⠀⢸⠀⠀⢸⠟⠛⠀⠀⠀
⠀⠀⠀⠀⢀⠞⢀⣠⠃⠀⠀⠀⡔⢻⢸⡀⠀⠀⠈⡇⠙⠓⠀⠀⠀⠀⠀⠀⠀⠀⠄⠀⠀⠀⠀⣠⠟⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢀⡴⠗⠚⠉⢸⠀⠀⠀⢠⡇⠀⠟⢣⠀⠀⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡞⠉⠀⠀⠀⣸⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠸⡄⠀⠀⡸⠹⡄⠀⢈⣇⠀⠀⣧⠀⠀⠘⢷⣶⣤⣄⣀⣀⣀⡤⠔⠋⢧⡿⡀⠀⠀⠀⡟⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢣⠀⠀⡇⠀⢙⣶⣿⣿⡆⠀⣿⢦⡀⠀⠀⢹⣿⣦⣀⣩⠟⠀⠀⠀⠈⠁⢣⠀⠀⢰⡇⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠳⠞⢣⡴⠋⠀⢿⣿⣿⡄⣟⣶⡻⣦⣀⢀⣿⣻⣿⣿⣄⡀⠀⠀⠀⠀⠈⢆⢀⡾⠀⠀⠀⠀⠀⠀⠀⠀⠀`));

  const c        = ['cyan', 'blueBright', 'blue'];
  const grad     = (s) => s.split('').map((ch, i) => chalk[c[i % c.length]](ch)).join('');
  const W        = 54;
  const top      = '╔' + '═'.repeat(W) + '╗';
  const bot      = '╚' + '═'.repeat(W) + '╝';
  const sep      = '╟' + '─'.repeat(W) + '╢';
  const row      = (s = '') => {
    const plain = s.replace(/\x1b\[[0-9;]*m/g, '');
    return `║ ${s}${' '.repeat(Math.max(0, W - plain.length - 1))}║`;
  };

  const devs = settings.credits?.additionalDevs || [];

  const lines = [
    chalk.cyanBright(top),
    chalk.cyanBright(row(grad(`  ⬡ ${settings.botName} `) + chalk.gray(`v${v}`))),
    chalk.cyanBright(row(chalk.dim('  ' + settings.botDesc))),
    chalk.cyanBright(sep),
    chalk.cyanBright(row(`  ${chalk.green('●')} STATUS      ${chalk.greenBright.bold('ONLINE')}`)),
    chalk.cyanBright(row(`  ${chalk.blueBright('◆')} DEVELOPER   ${chalk.white.bold('Kevin')} ${chalk.gray('(KevSoft-ID)')}`)),
    chalk.cyanBright(row(`  ${chalk.blueBright('◆')} GITHUB      ${chalk.underline('github.com/kevsoft-id')}`)),
    chalk.cyanBright(row(`  ${chalk.blueBright('◆')} WEB         ${settings.webUrl}`)),
    chalk.cyanBright(row(`  ${chalk.blueBright('◆')} TAG         ${settings.botTag}`)),
  ];

  if (devs.length) {
    lines.push(chalk.cyanBright(sep));
    lines.push(chalk.cyanBright(row(`  ${chalk.magentaBright('◆')} KONTRIBUTOR`)));
    for (const d of devs) {
      const name = typeof d === 'string' ? d : d.name;
      const role = typeof d === 'string' ? '' : (d.role ? chalk.gray(` — ${d.role}`) : '');
      lines.push(chalk.cyanBright(row(`     ${chalk.white('•')} ${name}${role}`)));
    }
  }

  lines.push(chalk.cyanBright(bot));
  console.log(lines.join('\n'));
  console.log(chalk.gray(`  [ system ] plugin-engine v${v}  ·  node ${process.version}  ·  license: verified\n`));
}

function attachHandlers(sock) {
  sock.ev.removeAllListeners('messages.upsert');
  sock.ev.on('messages.upsert', async (upsert) => {
    try {
      await handleMessage(sock, upsert, global.plugins);
    } catch (err) {
      console.error(chalk.red('[Main] Unhandled error:'), err.message);
    }

    // ── Secondary feature hooks (run for ALL messages, incl non-command) ──
    if (upsert.type !== 'notify') return;
    for (const m of upsert.messages) {
      try { if (global._antibadwordCheck) await global._antibadwordCheck(sock, m); } catch {}
      try { if (global._slowmodeCheck)    await global._slowmodeCheck(sock, m);    } catch {}
      try { if (global._afkCheck)         await global._afkCheck(sock, m);         } catch {}
      try {
        if (global._groupMsgCount && m.key?.remoteJid?.endsWith('@g.us')) {
          const sender = m.key.participant || m.participant;
          if (sender) global._groupMsgCount(m.key.remoteJid, sender);
        }
      } catch {}
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
