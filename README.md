# 🐾 MINOBOT v2 — WhatsApp Bot by KevSoft-ID

> Bot WhatsApp kawaii dengan 50+ fitur, plugin system, dan persona neko yang asik!
> Dibuat dengan ❤️ oleh [Kevin (KevSoft-ID)](https://github.com/kevsoft-id)

---

## ✨ Fitur Unggulan

| Kategori | Fitur |
|----------|-------|
| 🎮 **Fun** | Magic 8ball, Dice, Coin, Quote, Roast, Pujian, Gay Rate, Ship/Cintaan, Truth, Dare, Tebak Angka, Waifu, Neko, Meme, Joke, Zodiak, Sticker, AI Chatbot |
| 🛠️ **Tools** | Kalkulator, Wikipedia, QR Code, URL Shortener, Kamus, Cuaca, Translate, Color Info, IP Lookup, Cek Website |
| 📥 **Downloader** | YouTube MP3, YouTube MP4, TikTok (No WM), Instagram |
| 👥 **Group** | TagAll, HideTag, Kick, Add, Promote, Demote, Group Info, Link, Anti Link, Mute/Unmute, Set Nama, Set Desc |
| 👑 **Owner** | Broadcast, Block/Unblock, Runtime, Eval, Restart, Reload, Set Nama Bot |
| ⚙️ **Sistem** | Menu, All Menu, Ping, Info Bot, Help, Plugin Manager |

---

## 🚀 Cara Install di Termux

```bash
# 1. Update dan install Node.js
pkg update && pkg upgrade
pkg install nodejs git

# 2. Clone atau extract bot
# Jika dari zip: extract ke folder wa-bot/
# Jika dari git: git clone https://github.com/kevsoft-id/mino-bot

# 3. Masuk ke folder bot
cd wa-bot

# 4. Install dependencies
npm install

# 5. Jalankan bot
npm start
```

---

## ⚙️ Konfigurasi

Edit file `settings.js`:

```js
botName: 'MinoBot',           // Nama bot (boleh diganti)
botNumber: '6281234567890',   // Nomor WA bot
ownerNumber: ['628xxxxxxxxx'], // Nomor owner (bisa lebih dari satu)
prefix: '.',                   // Prefix perintah
```

---

## 🖼️ Setup Gambar Thumbnail

Letakkan gambar-gambar di folder `media/`:

```
wa-bot/
└── media/
    ├── menu.png      ← Gambar utama menu (neko kawaii)
    ├── thumb.png     ← Thumbnail default
    ├── banner.png    ← Banner bot
    ├── logo.png      ← Logo developer
    └── bg.jpg        ← Background
```

> Jalankan `bash setup.sh` untuk otomatis copy gambar dari attached_assets

---

## 📱 Cara Pakai

1. Scan QR Code yang muncul di terminal dengan WhatsApp kamu
2. Tunggu hingga muncul "Bot MINOBOT aktif nya~"
3. Kirim `.menu` untuk melihat semua fitur
4. Kirim `.test` untuk tes apakah bot aktif

---

## 📋 Daftar Perintah Lengkap

Kirim `.allmenu` di WhatsApp untuk melihat semua perintah!

---

## 🔌 Plugin System

### Tambah Plugin dari URL:
```
.addplugin https://raw.githubusercontent.com/.../plugin.js
```

### Format Plugin:
```js
module.exports = {
  commands:    ['nama', 'alias'],  // Perintah
  category:    'Fun',              // Kategori
  description: 'Deskripsi plugin',
  usage:       '.nama <args>',
  ownerOnly:   false,              // Khusus owner?
  groupOnly:   false,              // Hanya di grup?
  adminOnly:   false,              // Butuh admin grup?
  botAdmin:    false,              // Bot harus admin?
  
  async handler(sock, m, { args, text, reply, react, isOwner, isAdmin, isGroup, pushName, mentions, quotedSender, groupMetadata, jid, prefix, command }) {
    await reply('Hello World!');
  },
};
```

---

## 📁 Struktur Folder

```
wa-bot/
├── index.js                    ← Entry point
├── settings.js                 ← Konfigurasi bot
├── package.json
├── session/                    ← Sesi WhatsApp (auto dibuat)
├── media/                      ← Gambar thumbnail
├── lib/
│   ├── connection.js           ← Koneksi WhatsApp
│   ├── handler.js              ← Handler pesan
│   ├── loader.js               ← Plugin loader
│   ├── utils.js                ← Utility functions
│   ├── queue.js                ← Antrian pesan
│   ├── ratelimit.js            ← Anti-spam
│   └── license.js              ← Lisensi & watermark
└── x-system/plugin/
    ├── main/                   ← Plugin utama
    ├── fun/                    ← Plugin hiburan
    ├── tools/                  ← Plugin utilitas
    ├── downloader/             ← Plugin downloader
    ├── group/                  ← Plugin grup
    ├── owner/                  ← Plugin owner
    └── extra/                  ← Plugin tambahan (via .addplugin)
```

---

## ⚠️ Ketentuan Penggunaan

1. ❌ Dilarang menghapus kredit & watermark developer
2. ❌ Dilarang memperjualbelikan script ini
3. ✅ Boleh rename bot sesuai keinginan

---

## 🤝 Kontribusi

Pull Request dan plugin baru sangat disambut! Visit: [github.com/kevsoft-id/mino-bot](https://github.com/kevsoft-id/mino-bot)

---

*Created by Kevin (KevSoft-ID) © 2026. All rights reserved.*
