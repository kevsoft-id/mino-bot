'use strict';

// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const chalk    = require('chalk');
const axios    = require('axios');
const settings = require('../set/settings');
const queue    = require('./queue');

/* ─────────────────────────────────────────────────────────────
 *  IMAGE URL UTILITIES
 *  Semua fungsi gambar berbasis URL — tidak ada baca file lokal.
 *  fetchImageBuffer() mengambil gambar dari internet lalu
 *  mengembalikan Buffer, atau null jika URL gagal.
 * ───────────────────────────────────────────────────────────── */

/**
 * Validasi apakah string adalah URL HTTP/HTTPS yang valid.
 * @param {string} url
 * @returns {boolean}
 */
function isValidUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch { return false; }
}

/**
 * Ambil gambar dari URL dan kembalikan sebagai Buffer.
 * Otomatis mengikuti redirect (max 5x).
 * Timeout 10 detik. Return null jika gagal.
 * @param {string} url
 * @returns {Promise<Buffer|null>}
 */
async function fetchImageBuffer(url) {
  if (!isValidUrl(url)) return null;
  try {
    const res = await axios.get(url, {
      responseType:  'arraybuffer',
      timeout:        10000,
      maxRedirects:   5,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; KEVSOFTBot/2.0)',
      },
    });
    return Buffer.from(res.data);
  } catch {
    return null;
  }
}

/* ── Reply text biasa ────────────────────────────────────────── */
async function reply(sock, m, text) {
  return queue.add(() =>
    sock.sendMessage(m.key.remoteJid, { text: String(text) }, { quoted: m })
  );
}

/* ── Send text tanpa quote ───────────────────────────────────── */
async function send(sock, jid, text) {
  return queue.add(() =>
    sock.sendMessage(jid, { text: String(text) })
  );
}

/* ── Reply dengan gambar dari URL + caption ──────────────────
 *
 * @param {object}  sock
 * @param {object}  m
 * @param {string}  imgUrl  — URL gambar (https://...)
 * @param {string}  caption — teks di bawah gambar
 * ─────────────────────────────────────────────────────────── */
async function replyImage(sock, m, imgUrl, caption = '') {
  return queue.add(async () => {
    const buf = await fetchImageBuffer(imgUrl);
    if (!buf) {
      // Fallback: kirim teks saja kalau gambar tidak bisa diambil
      return sock.sendMessage(
        m.key.remoteJid,
        { text: String(caption) || '(gambar tidak tersedia)' },
        { quoted: m }
      );
    }
    return sock.sendMessage(
      m.key.remoteJid,
      { image: buf, caption: String(caption), jpegThumbnail: buf },
      { quoted: m }
    );
  });
}

/* ── Send image dari URL (tanpa quote) ───────────────────────── */
async function sendImage(sock, jid, imgUrl, caption = '') {
  return queue.add(async () => {
    const buf = await fetchImageBuffer(imgUrl);
    if (!buf) {
      return sock.sendMessage(jid, { text: String(caption) || '(gambar tidak tersedia)' });
    }
    return sock.sendMessage(jid, { image: buf, caption: String(caption), jpegThumbnail: buf });
  });
}

/* ── Reply dengan dokumen ────────────────────────────────────── */
async function replyDoc(sock, m, fileBuf, fileName, mimetype = 'application/octet-stream') {
  return queue.add(() =>
    sock.sendMessage(m.key.remoteJid,
      { document: fileBuf, fileName, mimetype },
      { quoted: m }
    )
  );
}

/* ── Reply dengan stiker (buffer webp) ──────────────────────── */
async function replySticker(sock, m, stickerBuf) {
  return queue.add(() =>
    sock.sendMessage(m.key.remoteJid, { sticker: stickerBuf }, { quoted: m })
  );
}

/* ── Reply dengan GIF animasi dari URL ───────────────────────
 *
 * Mengambil GIF/WebP dari URL lalu mengirimnya sebagai
 * video dengan gifPlayback: true (agar animasi berjalan).
 * Fallback ke image jika video gagal, lalu teks jika keduanya gagal.
 * ─────────────────────────────────────────────────────────── */
async function replyGif(sock, m, gifUrl, caption = '') {
  return queue.add(async () => {
    const buf = await fetchImageBuffer(gifUrl);
    if (!buf) {
      return sock.sendMessage(
        m.key.remoteJid,
        { text: String(caption) || '(GIF tidak tersedia)' },
        { quoted: m }
      );
    }
    // Try animated gif (video + gifPlayback)
    try {
      return await sock.sendMessage(
        m.key.remoteJid,
        { video: buf, caption: String(caption), gifPlayback: true },
        { quoted: m }
      );
    } catch {
      // Fallback to static image
      try {
        return await sock.sendMessage(
          m.key.remoteJid,
          { image: buf, caption: String(caption) },
          { quoted: m }
        );
      } catch {
        return sock.sendMessage(
          m.key.remoteJid,
          { text: String(caption) || '(GIF tidak tersedia)' },
          { quoted: m }
        );
      }
    }
  });
}

/* ── Kirim list message (dropdown interaktif) ────────────────
 *
 * sections format:
 *   [{ title: 'Label', rows: [{ id: '.cmd', title: 'Label', description: 'Desc' }] }]
 *
 * imgUrl  — URL gambar opsional. Jika diisi, fallback kirim image+caption.
 *           Jika null/undefined, fallback langsung ke teks.
 *
 * Fallback chain:  listMessage → image+caption → plain text
 * ─────────────────────────────────────────────────────────── */
async function replyList(sock, m, title, text, btnText, sections, footer = settings.footer, imgUrl = null) {
  return queue.add(async () => {

    // ── 1. Coba kirim sebagai listMessage ────────────────────
    try {
      await sock.sendMessage(m.key.remoteJid, {
        text:       String(text),
        footer:     String(footer),
        title:      String(title),
        buttonText: String(btnText),
        sections,
        listType:   1,
      }, { quoted: m });
      return;
    } catch { /* lanjut ke fallback */ }

    // ── 2. Fallback: fetch gambar dari URL → image + caption ─
    if (isValidUrl(imgUrl)) {
      const buf = await fetchImageBuffer(imgUrl);
      if (buf) {
        try {
          await sock.sendMessage(
            m.key.remoteJid,
            { image: buf, caption: String(text), jpegThumbnail: buf },
            { quoted: m }
          );
          return;
        } catch { /* lanjut ke plain text */ }
      }
    }

    // ── 3. Final fallback: plain text + daftar pilihan ───────
    let extra = '\n\n';
    for (const sec of sections) {
      if (sec.title) extra += `*${sec.title}*\n`;
      for (const row of sec.rows) {
        extra += `  ▪️ ${row.title}`;
        if (row.description) extra += ` — ${row.description}`;
        extra += '\n';
      }
      extra += '\n';
    }
    await sock.sendMessage(m.key.remoteJid, { text: String(text) + extra }, { quoted: m });
  });
}

/* ── Kirim buttons message ─────────────────────────────────────
 *
 * buttons: array of string (label saja) atau { id, label }
 * imgUrl : URL gambar opsional untuk header image
 *
 * Fallback chain:  buttonsMessage → image+caption → plain text
 * ─────────────────────────────────────────────────────────── */
async function replyButtons(sock, m, text, buttons, footer = settings.footer, imgUrl = null) {
  const normalised = buttons.map((b, i) =>
    typeof b === 'string' ? { id: `btn_${i}`, label: b } : b
  );

  const btns = normalised.map(b => ({
    buttonId:   b.id,
    buttonText: { displayText: b.label },
    type: 1,
  }));

  return queue.add(async () => {
    // Fetch gambar terlebih dahulu (jika ada URL)
    const buf = isValidUrl(imgUrl) ? await fetchImageBuffer(imgUrl) : null;

    // ── 1. Coba kirim buttonsMessage ────────────────────────
    try {
      const msg = buf
        ? { image: buf, caption: String(text), footer, buttons: btns, headerType: 4 }
        : { text: String(text), footer, buttons: btns, headerType: 1 };
      await sock.sendMessage(m.key.remoteJid, msg, { quoted: m });
      return;
    } catch { /* lanjut ke fallback */ }

    // ── 2. Fallback: image + caption ────────────────────────
    if (buf) {
      try {
        await sock.sendMessage(
          m.key.remoteJid,
          { image: buf, caption: String(text), jpegThumbnail: buf },
          { quoted: m }
        );
        return;
      } catch { /* lanjut ke plain text */ }
    }

    // ── 3. Final fallback: plain text ────────────────────────
    const fallback =
      String(text) + '\n\n' +
      normalised.map((b, i) => `  ${i + 1}. ${b.label}`).join('\n') +
      '\n\n' + footer;
    await sock.sendMessage(m.key.remoteJid, { text: fallback }, { quoted: m });
  });
}

/* ── React emoji ──────────────────────────────────────────────── */
async function react(sock, m, emoji) {
  try {
    await sock.sendMessage(m.key.remoteJid, {
      react: { text: emoji, key: m.key },
    });
  } catch {}
}

/* ── Tandai sudah dibaca ──────────────────────────────────────── */
async function markRead(sock, m) {
  try { await sock.readMessages([m.key]); } catch {}
}

/* ── Kirim typing indicator ───────────────────────────────────── */
async function sendTyping(sock, jid, duration = 1200) {
  try {
    await sock.sendPresenceUpdate('composing', jid);
    await new Promise(r => setTimeout(r, duration));
    await sock.sendPresenceUpdate('paused', jid);
  } catch {}
}

/* ── Format waktu ms → "2j 14m 03s" ──────────────────────────── */
function formatDuration(ms) {
  const totalS = Math.floor(ms / 1000);
  const s = totalS % 60;
  const m = Math.floor(totalS / 60) % 60;
  const h = Math.floor(totalS / 3600) % 24;
  const d = Math.floor(totalS / 86400);
  if (d > 0) return `${d}h ${h}j ${m}m ${s}s`;
  if (h > 0) return `${h}j ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

/* ── Pilih random dari array ──────────────────────────────────── */
function randPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ── Format nomor → JID ───────────────────────────────────────── */
function toJid(number) {
  return number.replace(/\D/g, '') + '@s.whatsapp.net';
}

/* ── Mention singkat ──────────────────────────────────────────── */
function mention(jid) {
  return `@${jid.split('@')[0]}`;
}

/* ── Welcome / Goodbye handler ────────────────────────────────── */
async function welcomeOnParticipantsUpdate(sock, update) {
  if (!settings.welcomeMsg) return;
  const { id, participants, action } = update;

  // Lazy-load store to avoid circular dep issues at module init
  let store;
  try { store = require('./store'); } catch { store = null; }

  for (const jid of participants) {
    const number = jid.split('@')[0];
    const { theme } = settings;

    if (action === 'add') {
      // Check for custom welcome message
      const customMsg = store?.get('welcomeMsg', id);
      if (customMsg) {
        // Get group info for variables
        let groupName = id, memberCount = 0;
        try {
          const meta = await sock.groupMetadata(id);
          groupName   = meta.subject;
          memberCount = meta.participants.length;
        } catch {}
        const text = customMsg
          .replace(/{name}/g,   number)
          .replace(/{number}/g, number)
          .replace(/{group}/g,  groupName)
          .replace(/{count}/g,  String(memberCount));
        await sock.sendMessage(id, { text, mentions: [jid] });
      } else {
        // Default welcome
        const text = [
          theme.header, '',
          ` 👋 ${theme.bold('Selamat datang!')}`,
          `    @${number} baru saja bergabung.`,
          '',
          ` ${theme.bullet} Baca deskripsi grup sebelum bertanya.`,
          ` ${theme.bullet} Ketik ${settings.prefix}menu untuk daftar fitur.`,
          '',
          theme.footer,
        ].join('\n');
        await sock.sendMessage(id, { text, mentions: [jid] });
      }
    } else if (action === 'remove') {
      const customMsg = store?.get('goodbyeMsg', id);
      if (customMsg) {
        let groupName = id;
        try { groupName = (await sock.groupMetadata(id)).subject; } catch {}
        const text = customMsg
          .replace(/{name}/g,   number)
          .replace(/{number}/g, number)
          .replace(/{group}/g,  groupName);
        await sock.sendMessage(id, { text, mentions: [jid] });
      } else {
        const text = [
          theme.div,
          ` 👋 ${theme.bold('@' + number)} telah keluar dari grup.`,
          theme.div,
        ].join('\n');
        await sock.sendMessage(id, { text, mentions: [jid] });
      }
    }
  }
}

/* ── Parse mention dari pesan ────────────────────────────────── */
function getMentions(m) {
  return (
    m.message?.extendedTextMessage?.contextInfo?.mentionedJid ||
    m.message?.imageMessage?.contextInfo?.mentionedJid ||
    []
  );
}

/* ── Get quoted message sender ───────────────────────────────── */
function getQuotedSender(m) {
  return (
    m.message?.extendedTextMessage?.contextInfo?.participant ||
    m.message?.imageMessage?.contextInfo?.participant ||
    null
  );
}

/* ── Potong teks panjang ─────────────────────────────────────── */
function truncate(str, max = 100) {
  return str.length > max ? str.slice(0, max - 3) + '...' : str;
}

module.exports = {
  reply, send, replyImage, sendImage, replyGif, replyDoc, replySticker,
  replyButtons, replyList, react, markRead, sendTyping,
  formatDuration, randPick, toJid, mention,
  isValidUrl, fetchImageBuffer,
  welcomeOnParticipantsUpdate, getMentions, getQuotedSender,
  truncate,
};
