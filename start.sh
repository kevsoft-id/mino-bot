#!/usr/bin/env bash
# Universal launcher — works on Termux, VPS (Linux/macOS), Pterodactyl,
# Katabump, Replit, and any other bash/sh host.
#
# Usage: bash start.sh   (or: chmod +x start.sh && ./start.sh)
set -e

cd "$(dirname "$0")"

if [ ! -d "node_modules" ]; then
  echo "[Start] node_modules tidak ditemukan, menjalankan npm install..."
  if command -v npm >/dev/null 2>&1; then
    npm install --no-audit --no-fund
  else
    echo "[Start] npm tidak ditemukan! Install Node.js dulu (Termux: pkg install nodejs)." >&2
    exit 1
  fi
fi

exec node index.js
