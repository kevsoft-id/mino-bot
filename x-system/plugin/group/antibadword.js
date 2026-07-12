'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const settings = require('../../../set/settings');
const store    = require('../../../lib/store');

function getStatus(jid) { return !!store.get('antibadword', jid + ':on'); }
function setStatus(jid, val) { store.set('antibadword', jid + ':on', val); }
function getWords(jid) { return store.get('antibadword', jid + ':words') || []; }
function setWords(jid, words) { store.set('antibadword', jid + ':words', words); }

// Default banned words (basic)
const DEFAULT_BADWORDS = ['anjir', 'brengsek', 'bajingan', 'bangsat', 'fuck', 'shit', 'bodoh', 'tolol', 'goblok', 'kontol', 'memek'];

global._antibadwordCheck = async function(sock, m) {
  try {
    if (!m?.message) return;
    const jid = m.key.remoteJid;
    if (!jid.endsWith('@g.us')) return;
    if (!getStatus(jid)) return;

    const words   = [...DEFAULT_BADWORDS, ...getWords(jid)];
    const text    = (
      m.message?.conversation ||
      m.message?.extendedTextMessage?.text ||
      ''
    ).toLowerCase();

    const found = words.find(w => text.includes(w.toLowerCase()));
    if (!found) return;

    const sender = m.key.participant || m.participant;

    // Delete message
    await sock.sendMessage(jid, {
      delete: { remoteJid: jid, id: m.key.id, participant: sender, fromMe: false },
    }).catch(() => {});

    await sock.sendMessage(jid, {
      text: `⚠️ Pesan @${sender.split('@')[0]} dihapus karena mengandung kata terlarang!\n\n${settings.footer}`,
      mentions: [sender],
    }).catch(() => {});
  } catch {}
};

module.exports = {
  commands:    ['antibadword', 'antikata', 'abw'],
  category:    'Group',
  description: 'Anti kata-kata buruk — pesan otomatis dihapus',
  usage:       '.antibadword on/off | .antibadword add {kata} | .antibadword list | .antibadword reset',
  groupOnly:   true,
  adminOnly:   true,
  botAdmin:    true,

  async handler(sock, m, { args, jid, reply, react }) {
    const { theme } = settings;
    const sub  = args[0]?.toLowerCase();
    const kata = args.slice(1).join(' ').toLowerCase();

    if (!sub || sub === 'status') {
      const status = getStatus(jid);
      const words  = getWords(jid);
      return reply([
        `🤬 *Anti Bad Word*`,
        ``,
        `Status: ${status ? '🟢 ON' : '🔴 OFF'}`,
        `Kata custom: ${words.length} kata`,
        ``,
        `• .antibadword on/off`,
        `• .antibadword add {kata}`,
        `• .antibadword list`,
        `• .antibadword reset`,
        ``,
        settings.footer,
      ].join('\n'));
    }

    if (sub === 'on' || sub === 'off') {
      setStatus(jid, sub === 'on');
      await react('✅');
      return reply(`🤬 Anti Bad Word ${sub === 'on' ? '🟢 ON' : '🔴 OFF'}!\n\n${settings.footer}`);
    }

    if (sub === 'add') {
      if (!kata) return reply('❓ Masukkan kata yang mau diblokir\nContoh: .antibadword add {kata}');
      const words = getWords(jid);
      if (words.includes(kata)) return reply(`⚠️ Kata "${kata}" sudah ada di daftar`);
      words.push(kata);
      setWords(jid, words);
      await react('✅');
      return reply(`✅ Kata "*${kata}*" ditambahkan ke daftar blacklist`);
    }

    if (sub === 'list') {
      const words = getWords(jid);
      const all   = [...DEFAULT_BADWORDS, ...words];
      return reply([
        `🤬 *Daftar Kata Terlarang (${all.length})*`,
        ``,
        `📌 Default (${DEFAULT_BADWORDS.length}):`,
        DEFAULT_BADWORDS.join(', '),
        ``,
        words.length ? `➕ Custom (${words.length}):\n${words.join(', ')}` : `➕ Custom: (kosong)`,
        ``,
        settings.footer,
      ].join('\n'));
    }

    if (sub === 'reset') {
      setWords(jid, []);
      await react('🗑️');
      return reply('🗑️ Kata custom berhasil direset. Kata default tetap aktif.');
    }

    return reply('❓ Subperintah tidak dikenal\n• on/off • add {kata} • list • reset');
  },
};
