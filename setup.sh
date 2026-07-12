#!/bin/bash

# ===========================================================
# KEVSOFT BOT v2 Setup Script
# by KevSoft-ID
# ===========================================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}"
echo "╔╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╗"
echo "┆           𓆩 MINO BOT 𓆪"
echo "┆           by KevSoft-ID              "
echo "╚╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╝"
echo -e "${NC}"

# ── 1. Install dependencies ──────────────────────────────────
echo -e "${YELLOW}[1/2] Menginstall dependencies...${NC}"
if command -v npm &> /dev/null; then
  npm install
  echo -e "${GREEN}  ✓ Dependencies berhasil diinstall!${NC}"
else
  echo -e "${RED}  ✗ npm tidak ditemukan! Install Node.js dulu.${NC}"
  echo -e "${YELLOW}  Termux: pkg install nodejs${NC}"
  exit 1
fi

# ── 2. Buat folder session, data, media & extra ──────────────
echo -e "${YELLOW}[2/2] Menyiapkan folder...${NC}"
node scripts/ensure-dirs.js 2>/dev/null || mkdir -p session data media x-system/plugin/extra
echo -e "${GREEN}  ✓ Folder session/, data/, media/ dan extra/ siap.${NC}"

# ── Selesai ───────────────────────────────────────────────────
echo ""
echo -e "${CYAN}╔╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╗"
echo -e "┆    ✦ setup success ✦"
echo -e "╚╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╝${NC}"
echo ""
echo -e "${GREEN}Langkah selanjutnya:${NC}"
echo "  1. Edit set/settings.js — isi nomor bot & nomor owner kamu"
echo ""
echo -e "${YELLOW}  Thumbnail Image (URL):${NC}"
echo "  • Buka set/settings.js, cari bagian [ THUMBNAIL IMAGES (URL) ]"
echo "  • Ganti URL di images.menu, images.thumb, dll"
echo "    dengan URL gambar milikmu sendiri"
echo "  • Bisa upload ke: imgur.com | imgbb.com | catbox.moe"
echo "  • Format: JPG, PNG, WEBP (pastikan URL langsung ke file gambar)"
echo ""
echo "  2. Jalankan: npm start   (atau: bash start.sh)"
echo "  3. Masukkan Pairing Code yang tampil di terminal ke WhatsApp"
echo "  4. Kirim .menu untuk mulai!"
echo ""
echo -e "${CYAN}🤖 Selamat menggunakan KEVSOFT BOT!${NC}"
