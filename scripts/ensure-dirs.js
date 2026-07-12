'use strict';

// Cross-platform folder bootstrap — runs on `npm install` (postinstall) and
// via `npm run setup`. Pure Node.js (no bash/cmd needed) so it works
// identically on Termux, VPS, Pterodactyl/Katabump panels, Windows
// Command Prompt, Replit, or any other host with just Node installed.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const DIRS = [
  path.join(ROOT, 'session'),
  path.join(ROOT, 'data'),
  path.join(ROOT, 'media'),
  path.join(ROOT, 'x-system', 'plugin', 'extra'),
];

for (const dir of DIRS) {
  try {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`[Setup] ✓ ${path.relative(ROOT, dir) || '.'}`);
  } catch (err) {
    console.error(`[Setup] ✗ Gagal membuat ${dir}: ${err.message}`);
  }
}

console.log('[Setup] Folder siap. Edit set/settings.js lalu jalankan: npm start');
