# KEVSOFT BOT (MinoBot v2)

> **Logic Driven, High Performance.**
> by Kevin (KevSoft-ID) — https://github.com/kevsoft-id/mino-bot

---

## ⚡ Quick Start

### 1. Isi `settings.js`

Buka `settings.js` dan sesuaikan:

```js
botNumber:   '6281234567890',   // ← Nomor WA bot (kode negara + nomor, tanpa + atau spasi)
ownerNumber: ['6281234567891'], // ← Nomor owner/admin bot
prefix:      '.',               // ← Prefix perintah
botName:     'KEVSOFT BOT',     // ← Nama bot (boleh diganti)
```

> ⚠️ `botNumber` **wajib diisi** dengan nomor WhatsApp yang akan dipakai bot sebelum menjalankan.

### 2. Jalankan Bot

```bash
node index.js
# atau
pnpm --filter @workspace/wa-bot run dev
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

## 📁 Struktur Folder

```
wa-bot/
├── index.js           — Entry point utama
├── settings.js        — Konfigurasi bot (edit di sini)
├── session/           — Data sesi WhatsApp (auto-dibuat, jangan hapus)
├── lib/
│   ├── connection.js  — Koneksi Baileys + pairing code
│   ├── handler.js     — Handler pesan masuk
│   ├── loader.js      — Sistem auto-load plugin
│   ├── utils.js       — Helper fungsi
│   ├── store.js       — Penyimpanan in-memory
│   ├── queue.js       — Antrian pesan
│   └── ratelimit.js   — Rate limiter
└── x-system/
    └── plugin/        — Semua plugin bot
        ├── main/      — Perintah utama (menu, help, info, ping)
        ├── fun/       — Perintah hiburan
        ├── tools/     — Perintah utilitas
        ├── group/     — Perintah manajemen grup
        ├── owner/     — Perintah khusus owner
        ├── downloader/ — Perintah download media
        ├── anime/     — Perintah anime
        └── extra/     — Plugin tambahan (drop .js di sini)
```

---

## 🔌 Tambah Plugin

Drop file `.js` ke folder `x-system/plugin/extra/` — bot otomatis load tanpa restart (auto-watcher aktif).

Format plugin minimal:

```js
module.exports = {
  name:    'namacommand',
  alias:   ['alias1', 'alias2'],
  category: 'Extra',
  desc:    'Deskripsi perintah',
  async run({ sock, m, args }) {
    await sock.sendMessage(m.key.remoteJid, { text: 'Hello!' }, { quoted: m });
  }
};
```

---

## ⚙️ Konfigurasi Lengkap (`settings.js`)

| Key | Default | Keterangan |
|-----|---------|------------|
| `botNumber` | `6281234567890` | **Wajib diisi** — nomor WA bot |
| `ownerNumber` | `['6281234567891']` | Nomor owner (array) |
| `prefix` | `.` | Prefix perintah |
| `autoRead` | `true` | Auto centang biru |
| `autoTyping` | `true` | Tampilkan "mengetik..." |
| `autoOnline` | `true` | Status online terus |
| `rateLimit.enabled` | `true` | Aktifkan rate limiter |
| `antiLink` | `false` | Anti-link di grup |
| `welcomeMsg` | `true` | Pesan sambutan member baru |

---

## ⚠️ Ketentuan Penggunaan

1. **DILARANG** menghapus atau mengubah kredit & lisensi asli
2. **DILARANG** menghapus watermark developer
3. **DILARANG** memperjualbelikan script ini
4. **DIPERBOLEHKAN** mengubah nama bot sesuai keinginan

*Created by Kevin © 2026. All rights reserved.*
