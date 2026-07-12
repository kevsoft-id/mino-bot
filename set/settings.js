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
// NOTE: bold unicode letters are astral (surrogate-pair) code points — must
// split by code point (Array.from / spread), NOT by UTF-16 code unit
// (String.split('')), or the mapping desyncs and produces "�" garbage.
const BOLD_UNI = Array.from('𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵');

function bold(str) {
  return Array.from(String(str)).map(c => {
    const i = BOLD_MAP.indexOf(c);
    return i >= 0 ? BOLD_UNI[i] : c;
  }).join('');
}

// ── Divider & branding ───────────────────────────────────────
const DIV = '──────────────────────────────────';

// ── Override via Environment Variable (opsional) ─────────────
// Beberapa panel hosting (Pterodactyl, Katabump, dsb) mengatur
// konfigurasi lewat "Environment/Startup Variables" alih-alih
// mengedit file langsung. Jika env var di bawah diisi, nilainya
// akan dipakai. Jika tidak diisi, nilai default di bawah tetap
// berlaku — tidak ada perubahan perilaku untuk yang tidak butuh ini.
const ENV_BOT_NUMBER   = process.env.BOT_NUMBER || process.env.WA_BOT_NUMBER || '';
const ENV_OWNER_NUMBER = process.env.OWNER_NUMBER || process.env.WA_OWNER_NUMBER || '';
const ENV_PREFIX       = process.env.BOT_PREFIX || '';
const ENV_BOT_NAME     = process.env.BOT_NAME || '';

module.exports = {
  // ─── IDENTITAS BOT ────────────────────────────────────────
  botName:    ENV_BOT_NAME || 'KEVSOFT BOT',
  botVersion: '2.0.0',
  botDesc:    'Logic Driven, High Performance.',
  botTag:     '@kevsoft_id',
  webUrl:     'kevsoft.developer.li',

  // Nomor HP bot (kode negara tanpa +, tanpa spasi)
  // Bisa juga diisi lewat env var BOT_NUMBER (berguna di panel hosting).
  botNumber: ENV_BOT_NUMBER || '6281234567890',

  // Nomor owner (array, tanpa + dan spasi)
  // Bisa juga diisi lewat env var OWNER_NUMBER, pisahkan dengan koma
  // jika lebih dari satu, contoh: OWNER_NUMBER=628111,628222
  ownerNumber: ENV_OWNER_NUMBER
    ? ENV_OWNER_NUMBER.split(',').map(n => n.trim()).filter(Boolean)
    : ['6281234567890'],

  // Prefix perintah (bisa juga diisi lewat env var BOT_PREFIX)
  prefix: ENV_PREFIX || '.',

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
  // ⚠️ Jangan hapus/ubah total kredit di bawah — lihat lib/license.js.
  // Bot akan berhenti (hard error) kalau watermark hilang tanpa jejak.
  footer: '📡 kevsoft.developer.li // @kevsoft_id',

  // ─── CREDITS ───────────────────────────────────────────────
  // Developer utama TIDAK BOLEH dihapus (lihat lib/license.js).
  // Tambahkan nama di "additionalDevs" untuk siapa pun yang ikut
  // berpartisipasi dalam pembuatan/pengembangan script ini —
  // akan otomatis tampil di banner startup & .thanksto / .credits.
  credits: {
    mainDev: 'Kevin (KevSoft-ID)',
    additionalDevs: [
      // { name: 'Nama Kontributor', role: 'Plugin Developer' },
    ],
  },

  // ─── WAKTU ZONA ───────────────────────────────────────────
  timezone: 'Asia/Jakarta',

  // ═══════════════════════════════════════════════════════════
  // ─── API KEYS (isi sesuai kebutuhanmu) ───────────────────
  // ═══════════════════════════════════════════════════════════

  // OpenRouter — https://openrouter.ai/keys
  // Digunakan untuk: .ai .gpt .claude .gemini .llama .createweb dll
  openRouterApiKey: '',

  // Model AI default untuk setiap alias (harus tersedia di OpenRouter)
  aiModels: {
    default:  'openai/gpt-4o-mini',        // .ai
    gpt:      'openai/gpt-4o',             // .gpt
    claude:   'anthropic/claude-3.5-sonnet', // .claude
    gemini:   'google/gemini-flash-1.5',   // .gemini
    llama:    'meta-llama/llama-3.1-70b-instruct', // .llama
    mistral:  'mistralai/mistral-7b-instruct',     // .mistral
    createweb: 'openai/gpt-4o',            // .createweb
  },

  // ElevenLabs — https://elevenlabs.io (API Keys di profile)
  // Digunakan untuk: .tts
  elevenLabsApiKey: '',

  // GitHub Personal Access Token — https://github.com/settings/tokens
  // Scope yang dibutuhkan: repo (full)
  // Digunakan untuk: .ghdeploy .github .ghrepo
  githubToken: '',

  // Vercel Token — https://vercel.com/account/tokens
  // Digunakan untuk: .vercel
  vercelToken: '',

  // Pixabay API Key — https://pixabay.com/api/docs/ (gratis)
  // Digunakan untuk: .unsplash .foto
  pixabayApiKey: '',

  // ─── AI SYSTEM PROMPT ──────────────────────────────────────
  aiSystemPrompt: `Kamu adalah ${bold('KEVSOFT BOT')}, asisten AI cerdas dan ramah. Jawab dalam bahasa yang sama dengan pertanyaan user. Jika tidak ada konteks khusus, jawab secara singkat, padat, dan informatif.`,
};
