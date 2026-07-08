'use strict';

// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const path  = require('path');
const fs    = require('fs-extra');
const chalk = require('chalk');

const PLUGIN_DIR = path.join(__dirname, '..', 'x-system', 'plugin');

// ── Load semua plugin dari semua subfolder ──────────────────
async function loadPlugins(pluginMap) {
  pluginMap.clear();

  const categories = await fs.readdir(PLUGIN_DIR);
  let loaded = 0;

  for (const cat of categories) {
    const catPath = path.join(PLUGIN_DIR, cat);
    const stat    = await fs.stat(catPath);
    if (!stat.isDirectory()) continue;

    const files = await fs.readdir(catPath);
    for (const file of files) {
      if (!file.endsWith('.js')) continue;
      const ok = await loadSinglePlugin(pluginMap, path.join(catPath, file));
      if (ok) loaded++;
    }
  }

  console.log(chalk.green(`[Loader] ${pluginMap.size} perintah dimuat (${loaded} plugin aktif)`));
  return pluginMap;
}

// ── Load satu plugin file (dengan cache-bust) ───────────────
async function loadSinglePlugin(pluginMap, filePath) {
  try {
    delete require.cache[require.resolve(filePath)];
    const plugin = require(filePath);

    if (!plugin.commands || !Array.isArray(plugin.commands)) {
      console.warn(chalk.yellow(`[Loader] Skip ${path.basename(filePath)}: tidak ada 'commands'`));
      return false;
    }
    if (typeof plugin.handler !== 'function') {
      console.warn(chalk.yellow(`[Loader] Skip ${path.basename(filePath)}: tidak ada 'handler'`));
      return false;
    }

    for (const cmd of plugin.commands) {
      pluginMap.set(cmd.toLowerCase(), {
        ...plugin,
        filePath,
        category: plugin.category || 'Extra',
      });
    }

    console.log(chalk.blue(`[Loader] ✓ [${plugin.category || 'Extra'}] ${plugin.commands.join(', ')}`));
    return true;
  } catch (err) {
    console.error(chalk.red(`[Loader] ✗ ${path.basename(filePath)}:`), err.message);
    return false;
  }
}

// ── Hapus plugin dari map berdasarkan filePath ──────────────
function unloadPlugin(pluginMap, filePath) {
  let removed = 0;
  for (const [cmd, p] of pluginMap.entries()) {
    if (p.filePath === filePath) {
      pluginMap.delete(cmd);
      removed++;
    }
  }
  delete require.cache[filePath];
  return removed;
}

// ── Auto-watch: load plugin baru otomatis tanpa restart ──────
//
// Memantau setiap subfolder di PLUGIN_DIR menggunakan fs.watch().
// Ketika file .js ditambah, diubah, atau dihapus → langsung
// update global.plugins tanpa perlu restart bot atau .addplugin manual.
//
function watchPlugins(pluginMap) {
  // Debounce map: filePath → timer
  const debounce = new Map();

  function handleChange(eventType, filePath) {
    // Debounce 300ms supaya rapid saves hanya trigger sekali
    if (debounce.has(filePath)) clearTimeout(debounce.get(filePath));
    debounce.set(filePath, setTimeout(async () => {
      debounce.delete(filePath);

      const exists = await fs.pathExists(filePath);

      if (!exists) {
        // File dihapus → unload plugin
        const n = unloadPlugin(pluginMap, filePath);
        if (n > 0) {
          console.log(chalk.yellow(`[Watch] 🗑 Unloaded: ${path.basename(filePath)} (${n} cmd)`));
        }
        return;
      }

      // File baru / diubah → unload lama dulu, lalu load ulang
      // (mencegah stale alias saat commands[] berubah)
      unloadPlugin(pluginMap, filePath);
      const ok = await loadSinglePlugin(pluginMap, filePath);
      if (ok) {
        console.log(chalk.green(`[Watch] ⚡ Auto-loaded: ${path.basename(filePath)}`));
      }
    }, 300));
  }

  // Watch setiap subfolder yang sudah ada
  function watchDir(dirPath) {
    try {
      fs.watch(dirPath, { persistent: false }, (eventType, filename) => {
        if (!filename || !filename.endsWith('.js')) return;
        handleChange(eventType, path.join(dirPath, filename));
      });
      console.log(chalk.gray(`[Watch] 👁 ${path.relative(process.cwd(), dirPath)}`));
    } catch (err) {
      console.warn(chalk.yellow(`[Watch] Tidak bisa watch ${dirPath}: ${err.message}`));
    }
  }

  // Watch root plugin dir untuk subfolder baru
  fs.watch(PLUGIN_DIR, { persistent: false }, async (eventType, dirname) => {
    if (!dirname) return;
    const newDir = path.join(PLUGIN_DIR, dirname);
    try {
      const stat = await fs.stat(newDir);
      if (stat.isDirectory()) {
        watchDir(newDir);
        console.log(chalk.green(`[Watch] 📂 Folder baru terdeteksi: ${dirname}`));
      }
    } catch {}
  });

  // Watch semua subfolder yang sudah ada sekarang
  fs.readdir(PLUGIN_DIR).then(cats => {
    for (const cat of cats) {
      const catPath = path.join(PLUGIN_DIR, cat);
      try {
        if (fs.statSync(catPath).isDirectory()) watchDir(catPath);
      } catch {}
    }
  });

  console.log(chalk.green('[Watch] ✅ Auto-plugin-loader aktif — drop .js ke folder plugin, langsung jalan!'));
}

module.exports = { loadPlugins, loadSinglePlugin, unloadPlugin, watchPlugins };
