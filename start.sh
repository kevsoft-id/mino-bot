#!/usr/bin/env bash
# ══════════════════════════════════════════════════════════════
#   🤖 MINO BOT ULTRA — Start Script
#   Jalankan dengan: bash start.sh
#   Dengan PM2     : bash start.sh pm2
#   Dengan screen  : bash start.sh screen
# ══════════════════════════════════════════════════════════════

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

ok()   { echo -e "${GREEN}✓ ${1}${NC}"; }
warn() { echo -e "${YELLOW}⚠ ${1}${NC}"; }
info() { echo -e "${CYAN}ℹ ${1}${NC}"; }

# Cek .env
if [ ! -f .env ]; then
  warn ".env tidak ditemukan! Jalankan dulu: node setup.js"
  exit 1
fi

# Cek node_modules
if [ ! -d node_modules ]; then
  info "node_modules belum ada. Menginstall..."
  npm install --production --no-fund --no-audit
fi

METHOD="${1:-node}"

case "$METHOD" in
  pm2)
    ok "Menjalankan dengan PM2..."
    if ! command -v pm2 &>/dev/null; then
      warn "PM2 tidak ada. Install: npm install -g pm2"
      exit 1
    fi
    pm2 start ecosystem.config.js
    pm2 save
    ok "Bot berjalan di background!"
    info "Perintah berguna:"
    echo "  pm2 logs mino-bot     # lihat log"
    echo "  pm2 restart mino-bot  # restart"
    echo "  pm2 stop mino-bot     # stop"
    ;;

  screen)
    ok "Menjalankan dengan screen..."
    if command -v screen &>/dev/null; then
      screen -dmS minobot node index.js
      ok "Bot berjalan di background (screen: minobot)"
      info "Masuk ke sesi: screen -r minobot"
      info "Keluar tanpa stop: Ctrl+A lalu D"
    else
      warn "screen tidak ada. Menggunakan nohup..."
      nohup node index.js > logs/nohup.out 2>&1 &
      ok "Bot berjalan di background (nohup)"
      info "Lihat log: tail -f logs/nohup.out"
    fi
    ;;

  *)
    ok "Menjalankan bot langsung..."
    node index.js
    ;;
esac
