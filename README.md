# 🤖 Mino Bot Ultra v2.0

> WhatsApp Bot **150+ Fitur** berbasis Baileys + Gemini AI  
> by **kevsoft-id**

---

## ✨ Fitur Unggulan

| Kategori | Fitur |
|----------|-------|
| 🤖 AI | Chat Gemini, Imagine, Describe Gambar, Summarize, Code Generator, Cerita, Roast, Translate, KBBI, Sinonim, Grammar, Essay, dan lainnya |
| 🔧 Tools | Sticker, QR Code, Screenshot Web, TTS, Binary, Morse, Base64, Caesar, Kalkulator, Password Gen, Weather, Wiki, Carbon Code, Brat, dll |
| 📥 Downloader | TikTok, Instagram, YouTube MP3/MP4, Twitter/X, Facebook, Pinterest, Spotify |
| 👥 Group | Tag All, Kick, Add, Promote, Demote, Antilink, Welcome, Goodbye, Auto AI, Mute, Open/Close, Set Nama/Deskripsi/Foto, dll |
| 🎮 Game | Quiz, Tebak Kata, Tebak Angka, Hangman, Slot Machine, Truth/Dare, WYR, RPS, Trivia, Tebak Emoji |
| 😄 Fun | Joke, Fakta, Love Meter, Zodiak, Shio, Kata Mutiara, Meme, Rekomendasi Film, Acak Kata, dll |
| 🔍 Search | YouTube Search, GitHub, Kurs Valas, Anime, Film, Berita, NPM Package |
| 🕌 Islamic | Jadwal Sholat, Al-Quran, Hadits, Doa Harian, Asmaul Husna, Kalender Hijriah |
| 💰 Economy | Saldo, Daily, Work, Gamble, Transfer, Leaderboard, Rob, Shop, Inventory |
| 🔄 Converter | Suhu, Berat, Panjang, Romawi, Warna HEX, Umur, Timezone |
| 👑 Owner | Broadcast, Eval, Exec Shell, Add/Del Premium, GC List, Uptime, Set Nama Bot, **Read/Edit/Restore/List File (edit settings.js dkk langsung dari WA!)** |
| ✨ AddFitur | **Tambah fitur baru secara otomatis dengan AI Gemini!** |
| 🖼️ Canvas | **Profile Card (.profile), Quote Card (.quote)** — tema minimalis blue white dengan background custom |
| 🔘 Interaktif | **Menu tombol + gambar (.ui)** — pesan interaktif native WhatsApp |
| ⓘ Branding | **.kevsoft** — info & kontak resmi developer |

### 🖼️ Fitur Canvas (Baru!)
- `.profile` / `.pp` / `.card` — kartu profil canvas kamu (avatar, level, XP bar, rank, koin) dengan tema **minimalis blue white**
- `.setbg <url>` atau reply gambar dengan `.setbg` — ganti background canvas profile kamu sendiri
- `.setbg default` — kembali ke background bawaan (tembok bata)
- `.bio <teks>` — atur bio singkat yang tampil di kartu profil
- `.quote <teks> | <author>` — buat kartu kutipan canvas siap dibagikan (bisa reply gambar untuk jadi background)
- Engine: `@napi-rs/canvas` (native, ringan, jalan di Termux/VPS/Panel)

### 🔘 Fitur Interaktif (Baru!)
- `.ui` / `.menuinteraktif` — kirim menu dengan gambar + tombol asli WhatsApp
- Helper `lib/button.js` bisa dipakai plugin lain untuk kirim pesan tombol/list interaktif, dengan fallback otomatis ke teks bernomor jika perangkat tidak mendukung

### 👑 File Editor Owner (Baru!)
- `.listfiles [folder]` — lihat isi folder project bot
- `.readfile <path>` — baca isi file (misal `config.js`, `plugins/main/settings.js`)
- `.editfile <path>` + baris baru + isi baru — **ubah langsung file bot dari chat WhatsApp**, otomatis backup ke `.bak` dan reload plugin bila perlu
- `.restorefile <path>` — kembalikan file dari backup terakhir

---

## 🚀 Cara Install

### Termux (Android)
```bash
pkg update && pkg install nodejs git -y
git clone https://github.com/kevsoft-id/mino-bot
cd mino-bot
bash install.sh
```

### VPS Ubuntu/Debian
```bash
apt update && apt install nodejs npm git -y
cd mino-bot
bash install.sh
```

### Panel (cPanel, Pterodactyl, dll)
1. Upload & extract `mino-bot.zip`
2. Buka terminal / file manager
3. Edit `.env` sesuai kebutuhan
4. Jalankan `npm install` lalu `node index.js`

---

## ⚙️ Konfigurasi (.env)

```env
BOT_NAME=Mino Bot Ultra
OWNER_NUMBER=6281234567890
PREFIX=.
MODE=public
GEMINI_API_KEY=your_key_here   # Gratis di aistudio.google.com
TIMEZONE=Asia/Jakarta
```

---

## ▶️ Cara Menjalankan

```bash
# Mode biasa
node index.js

# Mode PM2 (background, auto-restart)
bash start.sh pm2

# Mode development
bash start.sh dev
```

---

## 🧠 Fitur AddFitur (UNIK!)

Tambah fitur baru tanpa coding manual!

```
.addfitur buat command .palindrom yang mengecek apakah kata adalah palindrom
.addfitur buat command .kalkulator dengan operasi tambah kurang kali bagi
.addfitur buat command .motivasiinggris yang menampilkan motivasi Bahasa Inggris
```

AI Gemini akan otomatis:
1. Generate kode plugin JavaScript
2. Simpan ke `plugins/addfitur/`
3. Auto-reload plugins
4. Plugin langsung bisa digunakan!

---

## 📋 Daftar Perintah Utama

```
.menu          → Menu utama
.help          → Bantuan
.ai <tanya>   → Chat AI Gemini
.settings      → Konfigurasi bot (owner)
.addfitur      → Tambah fitur via AI (owner)
.ping          → Cek latency
.sticker       → Buat stiker
.ytmp3 <url>  → Download YouTube audio
.tiktok <url> → Download TikTok
.quiz          → Main kuis
.daily         → Klaim koin harian
.sholat <kota> → Jadwal sholat
.quran 1:1    → Baca Al-Quran
```

---

## 📁 Struktur Direktori

```
mino-bot/
├── index.js              ← Entry point
├── config.js             ← Konfigurasi
├── handler.js            ← Handler pesan + anti-spam + auto-AI
├── .env                  ← Variabel lingkungan
├── lib/
│   ├── gemini.js         ← Klien AI Gemini
│   ├── database.js       ← Database JSON
│   ├── function.js       ← Fungsi utilitas
│   ├── menu.js           ← Builder menu
│   └── sender.js         ← Helper kirim pesan
├── plugins/
│   ├── main/             ← Menu, Settings, dll
│   ├── ai/               ← Semua fitur AI
│   ├── tools/            ← Alat-alat
│   ├── downloader/       ← Downloader
│   ├── group/            ← Manajemen grup
│   ├── game/             ← Permainan
│   ├── fun/              ← Hiburan
│   ├── search/           ← Pencarian
│   ├── islamic/          ← Fitur islami
│   ├── economy/          ← Sistem ekonomi
│   ├── converter/        ← Konverter
│   ├── owner/            ← Owner only
│   └── addfitur/         ← Plugin buatan AI
└── database/
    ├── users.json        ← Data pengguna
    ├── groups.json       ← Pengaturan grup
    └── settings.json     ← Pengaturan global
```

---

## 💡 Tips

- **Auto AI**: Ketik `.autoai on` di grup untuk auto-reply semua pesan dengan AI
- **Anti Link**: Ketik `.antilink on` di grup untuk blokir link
- **Welcome**: Ketik `.welcome on` + `.setwelcome Halo @user!` untuk pesan sambutan
- **PM2**: Gunakan `pm2 logs mino-bot` untuk lihat log real-time
- **Gemini API Key**: Gratis di [aistudio.google.com](https://aistudio.google.com/apikey)

---

## 📞 Support

- Owner: kevsoft-id
- GitHub: github.com/kevsoft-id

---

*Made with ❤️ by kevsoft-id — Mino Bot Ultra v2.0*
