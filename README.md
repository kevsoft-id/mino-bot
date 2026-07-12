# KEVSOFT BOT (MinoBot v2)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org)
[![Baileys](https://img.shields.io/badge/Baileys-7.0.0--rc13-25D366.svg)](https://github.com/WhiskeySockets/Baileys)

> **Logic Driven, High Performance.**
> by Kevin (KevSoft-ID) — https://github.com/kevsoft-id/mino-bot

Bot WhatsApp berbasis [Baileys](https://github.com/WhiskeySockets/Baileys) dengan sistem plugin (149+ perintah siap pakai) dan auto-loader — cukup drop file `.js` ke `x-system/plugin/extra/` untuk menambah fitur baru tanpa restart.

Script ini murni Node.js + JavaScript (tanpa binary native/tanpa Chromium), sehingga bisa dijalankan di hampir semua tempat yang punya Node.js: **Termux, VPS, Panel Pterodactyl, Panel Katabump, Command Prompt (Windows), Replit,** dan lainnya.

## 📥 Instalasi dari GitHub

```bash
git clone https://github.com/kevsoft-id/mino-bot.git
cd mino-bot
npm install
```

---

## ⚡ Quick Start (semua platform)

### 1. Isi `set/settings.js`

Semua konfigurasi utama bot ada di **satu file**: `set/settings.js`. Buka dan sesuaikan:

```js
botNumber:   '6281234567890',   // ← Nomor WA bot (kode negara + nomor, tanpa + atau spasi)
ownerNumber: ['6281234567891'], // ← Nomor owner/admin bot
prefix:      '.',               // ← Prefix perintah
botName:     'KEVSOFT BOT',     // ← Nama bot (boleh diganti)
```

> ⚠️ `botNumber` **wajib diisi** dengan nomor WhatsApp yang akan dipakai bot sebelum menjalankan.

Di panel hosting (Pterodactyl/Katabump/VPS Docker) kamu juga bisa mengisi ini lewat **Environment Variable** tanpa mengedit file — lihat bagian [Environment Variable](#️-environment-variable-opsional) di bawah.

### 2. Install & Jalankan

```bash
npm install
npm start
```

Atau pakai launcher otomatis (install dependency kalau belum ada, lalu langsung jalan):

```bash
bash start.sh        # Linux / Termux / VPS / Pterodactyl / Katabump
start.bat             # Windows Command Prompt / PowerShell
```

### 3. Autentikasi via Pairing Code (bukan QR)

Bot menggunakan **pairing code** — **tidak perlu scan QR**. Saat pertama jalan, terminal akan menampilkan:

```
 ───────────────────────────────────────────
  🔐  PAIRING CODE  :  XXXX-XXXX
  📱  Nomor Bot     :  6281234567890
 ───────────────────────────────────────────
```

**Cara memasukkan pairing code di WhatsApp:**
1. Buka WhatsApp di HP yang nomornya sesuai `botNumber`
2. Masuk ke **Setelan → Perangkat Tertaut → Tautkan Perangkat**
3. Pilih **"Tautkan dengan nomor telepon"**
4. Masukkan kode 8 karakter yang tampil di terminal
5. Bot akan otomatis terhubung ✅

Setelah berhasil login, sesi disimpan di folder `session/` — tidak perlu pairing code lagi sampai logout.

---

## 🖥️ Panduan per Platform

### Termux (HP Android)

```bash
pkg update && pkg install nodejs git -y
git clone https://github.com/kevsoft-id/mino-bot.git wa-bot
cd wa-bot
bash setup.sh
npm start
```

> Jika `npm install` lambat/gagal di Termux, coba `pkg install nodejs-lts` lalu ulangi.

### VPS (Ubuntu/Debian/CentOS, dsb)

```bash
sudo apt update && sudo apt install -y nodejs npm   # sesuaikan package manager
cd wa-bot
bash setup.sh
```

Jalankan permanen di background dengan **pm2** (disarankan, auto-restart jika crash):

```bash
npm install -g pm2
pm2 start index.js --name wa-bot
pm2 save
pm2 startup   # agar auto-start saat VPS reboot
```

### Panel Pterodactyl

1. Buat server baru dengan egg **"Generic Node.js"** (atau egg Node yang tersedia di panel kamu).
2. Upload seluruh isi folder `wa-bot/` ke direktori server (lewat File Manager atau SFTP).
3. **Startup Command**, isi salah satu:
   - `npm install && node index.js`
   - atau `bash start.sh` (jika egg mendukung bash)
4. (Opsional) Isi **Environment/Startup Variables**: `BOT_NUMBER`, `OWNER_NUMBER`, `BOT_PREFIX` — lihat [Environment Variable](#️-environment-variable-opsional).
5. Klik **Start**. Pairing code akan tampil di **Console** panel.

### Panel Katabump

1. Buat server Node.js baru, upload folder `wa-bot/` (via file manager/zip upload lalu extract).
2. Set **Main File** / entry point ke `index.js`.
3. Set **Start Command** ke `npm install && npm start` (atau `bash start.sh` jika tersedia).
4. Isi env var (`BOT_NUMBER`, dll) di menu **Variables** panel jika tersedia.
5. Start server, buka Console untuk melihat pairing code.

### Command Prompt / PowerShell (Windows)

```bat
cd wa-bot
setup.bat
npm start
```

Atau jalankan `start.bat` langsung (double-click atau lewat cmd) — otomatis `npm install` kalau `node_modules` belum ada.

### Replit

1. Import/upload folder `wa-bot/` ke sebuah Repl Node.js.
2. Jalankan di **Shell**: `cd wa-bot && npm install && npm start` (atau `bash start.sh`).
3. Pairing code tampil di Console/Shell. Karena Replit gratis bisa idle, gunakan **Deployments** (Reserved VM/Always On) atau layanan uptime kalau ingin bot tetap online 24/7.

### Lainnya (Docker, Heroku-like, dsb)

Karena bot ini pure Node.js (tanpa dependency native/binary khusus), cukup pastikan:
- Node.js **>= 18** tersedia,
- perintah start memanggil `npm install` (sekali) lalu `node index.js`,
- folder `session/` bersifat **persistent** (jangan sampai dihapus/reset setiap deploy, atau kamu harus pairing ulang tiap kali).

---

## ⚙️ Environment Variable (opsional)

Berguna kalau kamu deploy di panel yang mengatur konfigurasi lewat "Variables" alih-alih edit file:

| Env Var | Menggantikan | Contoh |
|---|---|---|
| `BOT_NUMBER` | `settings.botNumber` | `BOT_NUMBER=6281234567890` |
| `OWNER_NUMBER` | `settings.ownerNumber` | `OWNER_NUMBER=6281111,6282222` (pisah koma untuk lebih dari satu) |
| `BOT_PREFIX` | `settings.prefix` | `BOT_PREFIX=!` |
| `BOT_NAME` | `settings.botName` | `BOT_NAME=MyBot` |

Jika env var tidak diisi, nilai default di `set/settings.js` tetap dipakai — tidak ada perubahan perilaku untuk siapa pun yang tidak memakai fitur ini.

---

## 📁 Struktur Folder

```
wa-bot/
├── index.js           — Entry point utama
├── set/
│   └── settings.js    — ⭐ SEMUA konfigurasi utama bot (edit di sini)
├── start.sh / start.bat — Launcher lintas platform (auto npm install)
├── setup.sh / setup.bat — Setup awal (install dependency + buat folder)
├── scripts/
│   └── ensure-dirs.js — Bikin folder session/data/media/extra (cross-platform)
├── session/           — Data sesi WhatsApp (auto-dibuat, jangan hapus)
├── data/              — Penyimpanan JSON persisten (auto-dibuat)
├── lib/
│   ├── connection.js  — Koneksi Baileys + pairing code
│   ├── handler.js     — Handler pesan masuk
│   ├── loader.js      — Sistem auto-load plugin
│   ├── utils.js        — Helper fungsi
│   ├── store.js        — Penyimpanan persisten (JSON)
│   ├── queue.js        — Antrian pesan
│   ├── ratelimit.js    — Rate limiter
│   └── license.js      — Pengecekan watermark
└── x-system/
    └── plugin/        — Semua plugin bot
        ├── main/        — Perintah utama (menu, help, info, ping)
        ├── fun/         — Perintah hiburan
        ├── tools/       — Perintah utilitas
        ├── group/       — Perintah manajemen grup
        ├── owner/       — Perintah khusus owner
        ├── downloader/  — Perintah download media
        ├── anime/       — Perintah anime
        ├── ai/          — Chat AI (OpenRouter)
        ├── tts/         — Text-to-speech
        ├── dev/         — Deploy ke GitHub/Vercel
        └── extra/       — Plugin tambahan (drop .js di sini, auto-load)
```

---

## 🔌 Tambah Plugin

Drop file `.js` ke folder `x-system/plugin/extra/` — bot otomatis load tanpa restart (auto-watcher aktif).

Format plugin minimal:

```js
module.exports = {
  commands: ['halo'],
  category: 'Extra',
  description: 'Deskripsi perintah',
  async handler(sock, m, { reply }) {
    await reply('Hello!');
  }
};
```

---

## ⚙️ Konfigurasi Lengkap (`set/settings.js`)

| Key | Default | Keterangan |
|-----|---------|------------|
| `botNumber` | `6281234567890` | **Wajib diisi** — nomor WA bot (atau env `BOT_NUMBER`) |
| `ownerNumber` | `['6281234567890']` | Nomor owner (array, atau env `OWNER_NUMBER`) |
| `prefix` | `.` | Prefix perintah (atau env `BOT_PREFIX`) |
| `autoRead` | `true` | Auto centang biru |
| `autoTyping` | `true` | Tampilkan "mengetik..." |
| `autoOnline` | `true` | Status online terus |
| `rateLimit.enabled` | `true` | Aktifkan rate limiter |
| `antiLink` | `false` | Anti-link di grup |
| `welcomeMsg` | `true` | Pesan sambutan member baru |
| `openRouterApiKey` | `''` | Untuk fitur `.ai/.gpt/.claude` dll |
| `elevenLabsApiKey` | `''` | Untuk fitur `.tts` |
| `githubToken` | `''` | Untuk fitur `.ghdeploy` |
| `vercelToken` | `''` | Untuk fitur `.vercel` |
| `pixabayApiKey` | `''` | Untuk fitur `.unsplash` |

---

## 🛠️ Troubleshooting

- **Bot langsung keluar / error `Cannot find module`** → jalankan `npm install` dulu di folder `wa-bot/`.
- **Pairing code gagal terus** → pastikan `botNumber` di `set/settings.js` (atau env `BOT_NUMBER`) benar dan nomor tersebut aktif di WhatsApp, lalu coba lagi.
- **Setelah logout, tidak bisa konek lagi** → hapus folder `session/` lalu jalankan ulang bot untuk pairing code baru.
- **Deploy di panel tapi sesi selalu hilang** → pastikan folder `session/` tidak direset setiap kali container restart/redeploy (gunakan persistent volume/storage panel).
- **`npm install` gagal karena native module** → project ini sudah dibersihkan dari dependency native (sharp/jimp/cheerio dihapus karena tidak dipakai), jadi seharusnya install lancar di semua platform termasuk Termux (ARM).

---

## ⚠️ Ketentuan Penggunaan

1. **DILARANG** menghapus atau mengubah kredit & lisensi asli
2. **DILARANG** menghapus watermark developer
3. **DILARANG** memperjualbelikan script ini
4. **DIPERBOLEHKAN** mengubah nama bot sesuai keinginan

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE) — bebas dipakai/dimodifikasi
selama kredit & watermark KevSoft-ID tetap dipertahankan (lihat Ketentuan Penggunaan
di atas).

## 🔗 Links

- Repository: https://github.com/kevsoft-id/mino-bot
- Issues: https://github.com/kevsoft-id/mino-bot/issues
- Author: [@kevsoft-id](https://github.com/kevsoft-id)

*Created by Kevin © 2026. All rights reserved.*
