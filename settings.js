/*
  ===========================================================
  [ WATERMARK & LICENSE NOTICE ]
  ===========================================================
  🤖 BOT NAME : KEVSOFT BOT
  👤 DEVELOPER: KEVIN (KevSoft-ID)
  🌐 GITHUB   : https://github.com/kevsoft-id/mino-bot
  ===========================================================
*/

'use strict';

// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

// ── Unicode Bold Sans-Serif helper ──────────────────────────
const BOLD_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const BOLD_UNI = '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵';

function bold(str) {
  return String(str).split('').map(c => {
    const i = BOLD_MAP.indexOf(c);
    return i >= 0 ? BOLD_UNI[i] : c;
  }).join('');
}

// ── Divider & branding ───────────────────────────────────────
const DIV = '──────────────────────────────────';

module.exports = {
  // ─── IDENTITAS BOT ────────────────────────────────────────
  botName:    'KEVSOFT BOT',
  botVersion: '2.0.0',
  botDesc:    'Logic Driven, High Performance.',
  botTag:     '@kevsoft_id',
  webUrl:     'kevsoft.developer.li',

  // Nomor HP bot (kode negara tanpa +, tanpa spasi)
  botNumber: '6281234567890',

  // Nomor owner (array, tanpa + dan spasi)
  ownerNumber: ['6281234567891'],

  // Prefix perintah
  prefix: '.',

  // ─── PERILAKU BOT ─────────────────────────────────────────
  autoRead:    true,
  autoTyping:  true,
  autoOnline:  true,

  // ─── TEMA KEVSOFT ─────────────────────────────────────────
  theme: {
    header: `▋ ${bold('KEVSOFT BOT INTERFACE')}\n  "${bold('Logic Driven, High Performance.')}"\n${DIV}`,
    div:    DIV,
    bullet: '▪️',
    hex:    '⬡',
    indent: '    ',
    footer: `${DIV}\n 📡 ${bold('Web')} : kevsoft.developer.li // @kevsoft_id`,
    bold,
  },

  // ─── RATE LIMIT ───────────────────────────────────────────
  rateLimit: {
    enabled:    true,
    maxMsg:     8,
    windowMs:   10000,
    cooldownMs: 8000,
  },

  // ─── ANTRIAN ──────────────────────────────────────────────
  queue: {
    enabled:      true,
    delayMs:      400,
    maxQueueSize: 80,
  },

  // ─── FITUR GRUP ───────────────────────────────────────────
  antiLink:   false,
  welcomeMsg: true,

  // ─── THUMBNAIL IMAGES (URL) ───────────────────────────────
  //  Ganti URL di bawah dengan URL gambar milikmu sendiri.
  //  Bisa upload ke: imgur.com, imgbb.com, catbox.moe, dll.
  //  Format yang didukung: JPG, PNG, WEBP, GIF (statik).
  //  Jika URL gagal diambil, bot otomatis fallback ke teks.
  // ──────────────────────────────────────────────────────────
  images: {
    // Thumbnail untuk .menu utama (listMessage / daftar kategori)
    menu:   'https://placehold.co/800x400/0d1117/00d4ff.png',

    // Thumbnail untuk .menu <kategori> & .allmenu
    thumb:  'https://placehold.co/800x400/0d1117/ffffff.png',

    // Banner umum / sambutan
    banner: 'https://placehold.co/1280x640/0d1117/00d4ff.png',

    // Logo kecil (icon bot)
    logo:   'https://placehold.co/400x400/0d1117/00d4ff.png',

    // Background / wallpaper
    bg:     'https://placehold.co/1280x720/0d1117/ffffff.png',
  },

  // ─── PESAN SISTEM ─────────────────────────────────────────
  msg: {
    ownerOnly:   '❌ Akses ditolak — perintah khusus *Owner*.',
    groupOnly:   '❌ Perintah ini hanya tersedia di *Grup*.',
    privateOnly: '❌ Perintah ini hanya tersedia di *Private Chat*.',
    adminOnly:   '❌ Kamu harus menjadi *Admin Grup* untuk menggunakan ini.',
    botAdmin:    '❌ Bot harus dijadikan *Admin Grup* terlebih dahulu.',
    rateLimited: `⚠️ *Rate limit* — tunggu sebentar sebelum mengirim perintah lagi.`,
    error:       `❌ *Internal error* — coba lagi beberapa saat.`,
    invalidCmd:  `❓ Perintah tidak dikenal. Ketik *.menu* untuk daftar lengkap.`,
    processing:  `⏳ Memproses permintaan...`,
    noArgs:      `❌ Argumen tidak lengkap. Cek *.help {cmd}* untuk panduan.`,
  },

  // ─── FOOTER (untuk plugin individual) ─────────────────────
  footer: '📡 kevsoft.developer.li // @kevsoft_id',

  // ─── WAKTU ZONA ───────────────────────────────────────────
  timezone: 'Asia/Jakarta',
};
