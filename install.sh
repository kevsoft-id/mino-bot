#!/usr/bin/env bash
# ══════════════════════════════════════════════════════════════
#   🤖 MINO BOT ULTRA — Install Script
#   Mendukung: Termux, Ubuntu/Debian VPS, CentOS/RHEL, macOS
#
#   Cara pakai: bash install.sh
#   ATAU langsung: node setup.js (jika Node.js sudah ada)
# ══════════════════════════════════════════════════════════════

set -e

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

ok()   { echo -e "${GREEN}✓ ${1}${NC}"; }
warn() { echo -e "${YELLOW}⚠ ${1}${NC}"; }
err()  { echo -e "${RED}✗ ${1}${NC}"; }
info() { echo -e "${CYAN}ℹ ${1}${NC}"; }

echo -e "${CYAN}${BOLD}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║   🤖  MINO BOT ULTRA v2.0 — Auto Installer              ║"
echo "║       github.com/kevsoft-id/minobot                      ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# ── Deteksi platform ──────────────────────────────────────────
if [ -d "/data/data/com.termux" ]; then
  PLATFORM="termux"
elif [ "$(uname -s)" = "Darwin" ]; then
  PLATFORM="macos"
elif [ -f "/etc/debian_version" ] || grep -qi debian /etc/os-release 2>/dev/null; then
  PLATFORM="debian"
elif [ -f "/etc/redhat-release" ] || grep -qi "rhel\|centos\|fedora" /etc/os-release 2>/dev/null; then
  PLATFORM="redhat"
else
  PLATFORM="unknown"
fi
ok "Platform: ${PLATFORM}"

# ── Cek & install Node.js ──────────────────────────────────────
install_node() {
  warn "Node.js tidak ditemukan. Menginstall..."
  if [ "$PLATFORM" = "termux" ]; then
    pkg update -y && pkg install nodejs-lts -y
  elif [ "$PLATFORM" = "debian" ]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
  elif [ "$PLATFORM" = "redhat" ]; then
    curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
    yum install -y nodejs
  elif [ "$PLATFORM" = "macos" ]; then
    if command -v brew &>/dev/null; then
      brew install node
    else
      err "Homebrew tidak ada. Install Node.js dari https://nodejs.org"
      exit 1
    fi
  else
    err "Install Node.js v18+ dari https://nodejs.org lalu jalankan ulang."
    exit 1
  fi
}

if ! command -v node &>/dev/null; then
  install_node
fi

NODE_VER=$(node -v 2>/dev/null || echo "v0")
NODE_MAJOR=$(echo "$NODE_VER" | sed 's/v\([0-9]*\).*/\1/')
ok "Node.js: ${NODE_VER}"

if [ "$NODE_MAJOR" -lt 18 ] 2>/dev/null; then
  err "Node.js versi ${NODE_VER} terlalu lama! Minimal v18."
  if [ "$PLATFORM" = "termux" ]; then
    info "Jalankan: pkg install nodejs-lts"
  else
    info "Update di: https://nodejs.org"
  fi
  exit 1
fi

# ── Cek npm ──────────────────────────────────────────────────
if ! command -v npm &>/dev/null; then
  warn "npm tidak ditemukan. Mencoba install..."
  if [ "$PLATFORM" = "termux" ]; then
    pkg install npm -y
  fi
fi
ok "npm: $(npm -v 2>/dev/null || echo 'tersedia')"

# ── Buat direktori wajib ──────────────────────────────────────
mkdir -p database logs auth_info_baileys assets/thumb
ok "Direktori dibuat"

# ── Init database jika belum ada ─────────────────────────────
[ ! -f database/users.json ]   && echo '{"users":{}}' > database/users.json
[ ! -f database/groups.json ]  && echo '{"groups":{}}' > database/groups.json
[ ! -f database/settings.json ] && echo '{}' > database/settings.json
ok "Database diinisialisasi"

# ── Copy .env.example → .env jika belum ada ──────────────────
if [ ! -f .env ] && [ -f .env.example ]; then
  cp .env.example .env
  warn ".env dibuat dari template. Setup interaktif akan dilanjutkan oleh node setup.js"
fi

# ── Install dependencies ──────────────────────────────────────
info "Menginstall dependencies Node.js..."
npm install --production --no-fund --no-audit
ok "Dependencies berinstall"

# ── Selesai, lanjut ke setup interaktif ─────────────────────
echo ""
echo -e "${GREEN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}${BOLD}  ✅  Persiapan selesai! Melanjutkan setup...${NC}"
echo -e "${GREEN}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Jalankan setup interaktif
exec node setup.js
