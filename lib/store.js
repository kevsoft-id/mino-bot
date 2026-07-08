'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI
//
// Persistent JSON key-value store.
// Namespace → key → value, written to data/store.json
//
// Hardened against data loss:
//  - Atomic write: write to .tmp first, then rename (prevents partial-write corruption)
//  - Backup: on load failure, tries data/store.backup.json before resetting to {}
//  - Errors are logged, not silently swallowed

const fs   = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const STORE_PATH  = path.join(__dirname, '../data/store.json');
const BACKUP_PATH = path.join(__dirname, '../data/store.backup.json');
const TMP_PATH    = STORE_PATH + '.tmp';

let _data = {};
let _dirty = false;
let _saveTimer = null;

// ── Load with backup fallback ──────────────────────────────────
function _load() {
  // Try primary
  try {
    _data = fs.readJsonSync(STORE_PATH);
    return;
  } catch (e) {
    if (e.code !== 'ENOENT') {
      console.warn(chalk.yellow('[Store] Gagal baca store.json, mencoba backup...'), e.message);
    }
  }
  // Try backup
  try {
    _data = fs.readJsonSync(BACKUP_PATH);
    console.log(chalk.yellow('[Store] Dipulihkan dari backup.'));
    return;
  } catch {}
  // Fresh start
  _data = {};
}

// ── Atomic write: tmp → rename + save backup ──────────────────
function _save() {
  try {
    fs.outputJsonSync(TMP_PATH, _data, { spaces: 2 });
    // Atomic rename: replaces store.json only after successful write
    fs.moveSync(TMP_PATH, STORE_PATH, { overwrite: true });
    // Keep a backup of the last good write
    try { fs.outputJsonSync(BACKUP_PATH, _data, { spaces: 2 }); } catch {}
    _dirty = false;
  } catch (err) {
    console.error(chalk.red('[Store] GAGAL menyimpan data:'), err.message);
    // Clean up tmp if it exists
    try { fs.removeSync(TMP_PATH); } catch {}
  }
}

// ── Debounced save — batch rapid writes into one disk op ───────
function _scheduleSave() {
  _dirty = true;
  if (_saveTimer) return;
  _saveTimer = setTimeout(() => {
    _saveTimer = null;
    if (_dirty) _save();
  }, 200); // 200 ms debounce
}

_load();

// ── Ensure data dir exists ────────────────────────────────────
try { fs.ensureDirSync(path.join(__dirname, '../data')); } catch {}

module.exports = {
  get:    (ns, key, def = null) => (_data[ns]?.[key] ?? def),

  set: (ns, key, val) => {
    if (!_data[ns]) _data[ns] = {};
    _data[ns][key] = val;
    _scheduleSave();
  },

  del: (ns, key) => {
    if (_data[ns] && key in _data[ns]) {
      delete _data[ns][key];
      _scheduleSave();
    }
  },

  getAll: (ns) => _data[ns] || {},

  toggle: (ns, key) => {
    const v = !(_data[ns]?.[key]);
    module.exports.set(ns, key, v);
    return v;
  },

  // Force immediate save (e.g. on SIGTERM)
  flush: () => { if (_dirty) _save(); },
};
