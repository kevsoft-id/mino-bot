'use strict';
// @minobot-seal:KevSoft-ID — JANGAN HAPUS BARIS INI

const axios    = require('axios');
const settings = require('../../../settings');

const MODELS = {
  ai:      { key: 'default',  label: 'GPT-4o Mini',        emoji: '🤖' },
  gpt:     { key: 'gpt',     label: 'GPT-4o',              emoji: '✨' },
  claude:  { key: 'claude',  label: 'Claude 3.5 Sonnet',   emoji: '🧠' },
  gemini:  { key: 'gemini',  label: 'Gemini Flash 1.5',    emoji: '💎' },
  llama:   { key: 'llama',   label: 'Llama 3.1 70B',       emoji: '🦙' },
  mistral: { key: 'mistral', label: 'Mistral 7B',          emoji: '🌀' },
};

// Per-user chat history (in-memory, reset on restart)
const chatHistory = new Map();

async function askOpenRouter(model, systemPrompt, messages) {
  const key = settings.openRouterApiKey;
  if (!key) throw new Error('openRouterApiKey belum diisi di settings.js');

  const { data } = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 1500,
      temperature: 0.7,
    },
    {
      headers: {
        Authorization:    `Bearer ${key}`,
        'Content-Type':   'application/json',
        'HTTP-Referer':   'https://github.com/kevsoft-id/mino-bot',
        'X-Title':        settings.botName,
      },
      timeout: 30000,
    }
  );
  return data.choices?.[0]?.message?.content?.trim() || 'Tidak ada respons dari AI.';
}

async function handleAI(cmd, sock, m, { text, sender, reply, react }) {
  const { theme } = settings;
  const info = MODELS[cmd] || MODELS.ai;
  const modelKey = info.key;
  const modelName = settings.aiModels[modelKey] || settings.aiModels.default;

  if (!text) {
    return reply([
      theme.header, '',
      ` ⬡  ${info.emoji}  ${theme.bold(info.label)}`, '',
      `    ${theme.bullet} Tanya apa saja dengan ${theme.bold('.' + cmd + ' <pertanyaan>')}`,
      `    ${theme.bullet} Contoh: .${cmd} siapa kamu?`,
      `    ${theme.bullet} Riwayat chat disimpan per sesi`,
      `    ${theme.bullet} Ketik .aiclear untuk reset riwayat`,
      '',
      theme.footer,
    ].join('\n'));
  }

  await react('⏳');

  // Build per-user history
  const histKey = `${sender}:${cmd}`;
  if (!chatHistory.has(histKey)) chatHistory.set(histKey, []);
  const hist = chatHistory.get(histKey);

  // Limit history to last 10 messages
  if (hist.length > 20) hist.splice(0, hist.length - 20);

  hist.push({ role: 'user', content: text });

  try {
    const answer = await askOpenRouter(
      modelName,
      settings.aiSystemPrompt,
      hist
    );

    hist.push({ role: 'assistant', content: answer });

    await react('✅');
    await reply([
      `${info.emoji} *${info.label}*`,
      ``,
      answer,
      ``,
      `_Model: \`${modelName}\`_`,
      `_Ketik .aiclear untuk reset obrolan_`,
      ``,
      settings.footer,
    ].join('\n'));
  } catch (err) {
    await react('❌');
    await reply(`❌ Gagal menghubungi AI:\n${err.response?.data?.error?.message || err.message}`);
  }
}

module.exports = [
  // ── AI Chat (multi-alias) ────────────────────────────────
  ...Object.keys(MODELS).map(cmd => ({
    commands:    [cmd],
    category:    'AI',
    description: `Chat dengan ${MODELS[cmd].label}`,
    usage:       `.${cmd} <pertanyaan>`,
    handler:     (sock, m, ctx) => handleAI(cmd, sock, m, { ...ctx }),
  })),

  // ── AI List ─────────────────────────────────────────────
  {
    commands:    ['ailist', 'aimodels', 'listai'],
    category:    'AI',
    description: 'Daftar model AI yang tersedia',
    usage:       '.ailist',
    async handler(sock, m, { reply }) {
      const { theme } = settings;
      const rows = Object.entries(MODELS).map(([cmd, info]) => {
        const model = settings.aiModels[info.key] || settings.aiModels.default;
        return `    ${info.emoji} .${cmd.padEnd(8)} → ${info.label}\n         \`${model}\``;
      }).join('\n');

      await reply([
        theme.header, '',
        ` ⬡  🤖  ${theme.bold('DAFTAR AI TERSEDIA')}`, '',
        rows,
        '',
        `    ${theme.bullet} Ubah model di settings.js → aiModels`,
        `    ${theme.bullet} .aiclear untuk reset riwayat`,
        '',
        theme.footer,
      ].join('\n'));
    },
  },

  // ── AI Clear history ────────────────────────────────────
  {
    commands:    ['aiclear', 'airclear', 'resetchat'],
    category:    'AI',
    description: 'Reset riwayat percakapan AI',
    usage:       '.aiclear',
    async handler(sock, m, { sender, reply, react }) {
      let count = 0;
      for (const [k] of chatHistory) {
        if (k.startsWith(sender + ':')) { chatHistory.delete(k); count++; }
      }
      await react('🗑️');
      await reply(`🗑️ Riwayat chat AI berhasil direset! (${count} sesi dihapus)`);
    },
  },
];
