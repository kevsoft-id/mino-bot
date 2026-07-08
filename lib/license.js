'use strict';

// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const fs   = require('fs');
const path = require('path');

const SEAL = '@minobot-seal:KevSoft-ID';
const REQUIRED_FILES = [
  path.join(__dirname, '..', 'index.js'),
  path.join(__dirname, '..', 'settings.js'),
  path.join(__dirname, 'connection.js'),
  path.join(__dirname, 'handler.js'),
];

function verifyIntegrity() {
  let failed = false;
  for (const file of REQUIRED_FILES) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      if (!content.includes(SEAL)) {
        console.error(`\x1b[31m[LICENSE] Watermark dihapus dari ${path.basename(file)}! Hargai developer!\x1b[0m`);
        failed = true;
      }
    } catch {
      // File mungkin belum ada saat pertama kali
    }
  }
  if (failed) {
    console.error('\x1b[31m[LICENSE] Integritas gagal. Silakan restore watermark KevSoft-ID.\x1b[0m');
  }
}

module.exports = { verifyIntegrity };
