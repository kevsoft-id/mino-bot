#!/usr/bin/env bash
# ══════════════════════════════════════════
#   🤖 MINO BOT ULTRA — Auto Installer
#   Mendukung: Termux, Ubuntu/Debian VPS, Panel
# ══════════════════════════════════════════

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  🤖 MINO BOT ULTRA v2.0 — INSTALLER  ${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

detect_platform() {
  if [ -d "/data/data/com.termux" ]; then echo "termux"
  elif [ "$(uname)" = "Darwin" ]; then echo "macos"
  elif [ -f "/etc/debian_version" ]; then echo "debian"
  elif [ -f "/etc/redhat-release" ]; then echo "redhat"
  else echo "unknown"; fi
}

PLATFORM=$(detect_platform)
echo -e "${GREEN}✓ Platform terdeteksi: ${PLATFORM}${NC}"

# ── Install Node.js jika belum ada ──
if ! command -v node &>/dev/null; then
  echo -e "${YELLOW}📦 Menginstall Node.js...${NC}"
  if [ "$PLATFORM" = "termux" ]; then
    pkg update -y && pkg install nodejs -y
  elif [ "$PLATFORM" = "debian" ]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
  else
    echo -e "${RED}⚠ Install Node.js v18+ secara manual dari https://nodejs.org${NC}"; exit 1
  fi
fi

NODE_VER=$(node -v 2>/dev/null || echo "v0")
echo -e "${GREEN}✓ Node.js: ${NODE_VER}${NC}"

# ── Buat direktori yang diperlukan ──
mkdir -p database logs auth_info_baileys assets/thumb
echo -e "${GREEN}✓ Direktori dibuat${NC}"

# ── Setup .env ──
if [ ! -f .env ]; then
  cp .env.example .env
  echo -e "${YELLOW}📝 .env dibuat dari template.${NC}"
  echo ""
  echo -e "${YELLOW}════ KONFIGURASI WAJIB ════${NC}"
  echo ""
  read -p "  ➤ Nomor Owner (6281234567890): " OWNER
  read -p "  ➤ Nama Bot (Mino Bot Ultra): " BOTNAME
  read -p "  ➤ Gemini API Key (dari aistudio.google.com): " GEMINI
  OWNER=${OWNER:-6281234567890}
  BOTNAME=${BOTNAME:-"Mino Bot Ultra"}
  sed -i "s/6281234567890/${OWNER}/g" .env 2>/dev/null || sed -i "" "s/6281234567890/${OWNER}/g" .env
  sed -i "s/Mino Bot Ultra/${BOTNAME}/g" .env 2>/dev/null || sed -i "" "s/Mino Bot Ultra/${BOTNAME}/g" .env
  if [ -n "$GEMINI" ]; then
    sed -i "s/your_gemini_api_key_here/${GEMINI}/g" .env 2>/dev/null || sed -i "" "s/your_gemini_api_key_here/${GEMINI}/g" .env
  fi
  echo ""
fi

# ── Install dependencies ──
echo -e "${YELLOW}📦 Menginstall dependencies...${NC}"
npm install --production
echo -e "${GREEN}✓ Dependencies terinstall${NC}"

# ── Init database ──
if [ ! -f database/users.json ]; then
  echo '{"users":{}}' > database/users.json
  echo '{"groups":{}}' > database/groups.json
  echo '{}' > database/settings.json
  echo -e "${GREEN}✓ Database diinisialisasi${NC}"
fi

# ── Install PM2 ──
if ! command -v pm2 &>/dev/null; then
  echo -e "${YELLOW}📦 Menginstall PM2...${NC}"
  npm install -g pm2 2>/dev/null && echo -e "${GREEN}✓ PM2 terinstall${NC}" || echo -e "${YELLOW}⚠ PM2 skip (jalankan manual)${NC}"
fi

# ── Make scripts executable ──
chmod +x start.sh 2>/dev/null || true

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ INSTALASI SELESAI!                ${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}  Cara menjalankan bot:${NC}"
echo -e "  ${YELLOW}node index.js${NC}          → Jalankan langsung"
echo -e "  ${YELLOW}bash start.sh${NC}          → Jalankan dengan script"
echo -e "  ${YELLOW}bash start.sh pm2${NC}      → Jalankan dengan PM2 (background)"
echo ""
echo -e "${CYAN}  Scan QR code yang muncul dengan WhatsApp!${NC}"
echo ""
echo -e "${YELLOW}  ⚠ Pastikan edit .env jika belum lengkap!${NC}"
echo ""
