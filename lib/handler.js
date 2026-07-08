'use strict';

// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const chalk    = require('chalk');
const settings = require('../settings');
const { checkRateLimit }  = require('./ratelimit');
const { reply, react, markRead, sendTyping, getMentions, getQuotedSender } = require('./utils');

/* ── Ambil teks dari berbagai jenis pesan ── */
function extractText(msg) {
  return (
    msg?.conversation ||
    msg?.extendedTextMessage?.text ||
    msg?.imageMessage?.caption ||
    msg?.videoMessage?.caption ||
    msg?.documentMessage?.caption ||
    msg?.buttonsResponseMessage?.selectedButtonId ||
    msg?.listResponseMessage?.singleSelectReply?.selectedRowId ||
    msg?.templateButtonReplyMessage?.selectedId ||
    ''
  );
}

/* ── Parse pesan masuk ── */
function parseMessage(m) {
  const jid     = m.key.remoteJid;
  const isGroup = jid.endsWith('@g.us');
  const sender  = isGroup
    ? (m.key.participant || m.participant)
    : m.key.remoteJid;

  const msg      = m.message;
  const msgType  = Object.keys(msg || {})[0] || '';
  const body     = extractText(msg);

  const prefix   = settings.prefix;
  const isCmd    = body.startsWith(prefix);
  const command  = isCmd ? body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const args     = isCmd ? body.slice(prefix.length + command.length).trim().split(/\s+/).filter(Boolean) : [];
  const text     = args.join(' ');

  const pushName = m.pushName || 'kak';
  const isOwner  = settings.ownerNumber.includes(sender.split('@')[0]);
  const fromMe   = m.key.fromMe;
  const isBot    = sender === (settings.botNumber + '@s.whatsapp.net');

  const mentions    = getMentions(m);
  const quotedSender = getQuotedSender(m);

  return {
    jid, isGroup, sender, msg, msgType, body,
    isCmd, command, args, text, pushName,
    isOwner, fromMe, isBot, mentions, quotedSender,
    prefix,
  };
}

/* ── Handle pesan masuk ── */
async function handleMessage(sock, upsert, plugins) {
  if (upsert.type !== 'notify') return;

  for (const m of upsert.messages) {
    try {
      await processMessage(sock, m, plugins);
    } catch (err) {
      console.error(chalk.red('[Handler] Error:'), err.message);
    }
  }
}

async function processMessage(sock, m, plugins) {
  if (!m.message) return;
  if (m.key.fromMe && !settings.ownerNumber.includes(m.key.remoteJid?.split('@')[0])) return;

  const p = parseMessage(m);
  if (!p.isCmd) return;

  const jid     = p.jid;
  const isOwner = p.isOwner;

  // ── Anti-PM check ────────────────────────────────────────────
  if (global.antiPM && !p.isGroup && !isOwner) {
    return reply(sock, m, '🔒 Bot sedang dalam mode *Anti-PM*. Gunakan di grup ya~');
  }

  // ── Bot mode check ───────────────────────────────────────────
  const mode = global.botMode || 'public';
  if (mode === 'group'   && !p.isGroup  && !isOwner) return;
  if (mode === 'private' && p.isGroup   && !isOwner) return;
  if (mode === 'owner'   && !isOwner)                return;

  // Auto read
  if (settings.autoRead) markRead(sock, m);

  // Rate limit
  if (checkRateLimit(p.sender)) {
    return reply(sock, m, settings.msg.rateLimited);
  }

  // ── Disabled commands check ──────────────────────────────────
  if (global.disabledCmds?.has(p.command) && !isOwner) {
    return reply(sock, m, `❌ Perintah *.${p.command}* sedang *dinonaktifkan* oleh admin bot.`);
  }

  const plugin = plugins.get(p.command);
  if (!plugin) {
    // Perintah tidak ditemukan
    return;
  }

  // Cek pembatasan
  if (plugin.ownerOnly && !p.isOwner) {
    return reply(sock, m, settings.msg.ownerOnly);
  }
  if (plugin.groupOnly && !p.isGroup) {
    return reply(sock, m, settings.msg.groupOnly);
  }
  if (plugin.privateOnly && p.isGroup) {
    return reply(sock, m, settings.msg.privateOnly);
  }

  // Ambil info grup jika perlu
  let groupMetadata = null;
  let isAdmin       = false;
  let botAdmin      = false;

  if (p.isGroup) {
    try {
      groupMetadata = await sock.groupMetadata(jid);
      const admins  = groupMetadata.participants
        .filter(pp => pp.admin)
        .map(pp => pp.id);
      isAdmin  = admins.includes(p.sender);
      botAdmin = admins.includes(sock.user.id.split(':')[0] + '@s.whatsapp.net') ||
                 admins.includes(sock.user.id);
    } catch {}
  }

  if (plugin.adminOnly && !isAdmin && !p.isOwner) {
    return reply(sock, m, settings.msg.adminOnly);
  }
  if (plugin.botAdmin && !botAdmin) {
    return reply(sock, m, settings.msg.botAdmin);
  }

  // Typing indicator
  if (settings.autoTyping) {
    sendTyping(sock, jid, 800).catch(() => {});
  }

  console.log(
    chalk.gray(`[${p.isGroup ? 'G' : 'P'}]`),
    chalk.cyan(`${p.pushName}`),
    chalk.white(`→`),
    chalk.yellow(`${p.prefix}${p.command}`),
    p.args.length ? chalk.gray(p.args.join(' ').slice(0, 50)) : ''
  );

  // Jalankan plugin
  try {
    await plugin.handler(sock, m, {
      args:          p.args,
      text:          p.text,
      prefix:        p.prefix,
      command:       p.command,
      isGroup:       p.isGroup,
      isOwner:       p.isOwner,
      isAdmin,
      botAdmin,
      sender:        p.sender,
      pushName:      p.pushName,
      mentions:      p.mentions,
      quotedSender:  p.quotedSender,
      groupMetadata,
      jid,
      plugins,
      reply:    (txt) => reply(sock, m, txt),
      react:    (emoji) => react(sock, m, emoji),
    });
  } catch (err) {
    console.error(chalk.red(`[Handler] Plugin error [${p.command}]:`), err.message);
    try { await reply(sock, m, settings.msg.error); } catch {}
  }
}

module.exports = { handleMessage };
